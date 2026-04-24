package org.example.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.eventusermodel.ReadOnlySharedStringsTable;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import org.apache.poi.xssf.model.StylesTable;
import org.example.dto.CustomerRequestDTO;
import org.example.entity.Customer;
import org.example.repository.CustomerRepository;
import org.example.service.CustomerBulkService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import javax.persistence.EntityManager;
import java.io.File;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerBulkServiceImpl implements CustomerBulkService {

    private final CustomerRepository customerRepository;
    private final EntityManager entityManager;

    @Autowired
    @Lazy
    private CustomerBulkService self;

    @Override
    @Async
    public void bulkCreateFromExcelAsync(File file) {
        log.info("Started bulk processing file using Event API: {}", file.getName());
        try (OPCPackage pkg = OPCPackage.open(file)) {
            XSSFReader reader = new XSSFReader(pkg);
            StylesTable styles = reader.getStylesTable();
            ReadOnlySharedStringsTable strings = new ReadOnlySharedStringsTable(pkg);
            
            CustomerSheetHandler sheetHandler = new CustomerSheetHandler();
            XMLReader parser = org.apache.poi.util.XMLHelper.newXMLReader();
            parser.setContentHandler(new XSSFSheetXMLHandler(styles, strings, sheetHandler, new org.apache.poi.ss.usermodel.DataFormatter(), false));

            XSSFReader.SheetIterator sheets = (XSSFReader.SheetIterator) reader.getSheetsData();
            while (sheets.hasNext()) {
                try (InputStream sheetStream = sheets.next()) {
                    parser.parse(new InputSource(sheetStream));
                }
                break; // Only process the first sheet
            }
            
            // In case there are remaining records not flushed at the end
            sheetHandler.flushRemaining();
            
            System.out.println("\nBulk processing completed. Successfully processed: " + sheetHandler.getProcessedCount() + ", Errors: " + sheetHandler.getErrorCount());
        } catch (Exception e) {
            log.error("Failed to process bulk customer excel file", e);
        } finally {
            if (file.exists()) {
                file.delete(); // clear tmp file
            }
        }
    }

    private class CustomerSheetHandler implements XSSFSheetXMLHandler.SheetContentsHandler {
        private final int BATCH_SIZE = 1000;
        private List<CustomerRequestDTO> batchDtos = new ArrayList<>();
        private int processedCount = 0;
        private int errorCount = 0;
        private boolean firstRow = true;
        
        private String currentName;
        private String currentDateOfBirth;
        private String currentNic;
        
        @Override
        public void startRow(int rowNum) {
            currentName = null;
            currentDateOfBirth = null;
            currentNic = null;
        }

        @Override
        public void endRow(int rowNum) {
            if (firstRow) {
                firstRow = false;
                return; // Skip header
            }
            
            if (currentNic == null || currentNic.trim().isEmpty()) {
                // If the row was empty or NIC was missing, it's either an empty row or invalid
                if (currentName != null || currentDateOfBirth != null) {
                    errorCount++;
                    log.warn("Row {}: NIC is missing, skipping.", rowNum);
                }
                return;
            }

            try {
                CustomerRequestDTO dto = CustomerRequestDTO.builder()
                        .name(currentName != null ? currentName : "")
                        .dateOfBirth(parseDob(currentDateOfBirth))
                        .nicNumber(currentNic)
                        .mobileNumbers(new ArrayList<>()) 
                        .build();

                batchDtos.add(dto);

                if (batchDtos.size() >= BATCH_SIZE) {
                    flushBatch();
                }
            } catch (Exception e) {
                log.error("Row {}: Error parsing data - {}", rowNum, e.getMessage());
                errorCount++;
            }
        }

        @Override
        public void cell(String cellReference, String formattedValue, org.apache.poi.xssf.usermodel.XSSFComment comment) {
            // Excel Columns: A=Name, B=DOB, C=NIC
            if (cellReference.startsWith("A")) {
                currentName = formattedValue;
            } else if (cellReference.startsWith("B")) {
                currentDateOfBirth = formattedValue;
            } else if (cellReference.startsWith("C")) {
                currentNic = formattedValue;
            }
        }

        public void flushRemaining() {
            if (!batchDtos.isEmpty()) {
                flushBatch();
            }
        }

        private void flushBatch() {
            try {
                self.processBatch(batchDtos);
                processedCount += batchDtos.size();
            } catch (Exception e) {
                log.warn("Batch failed, falling back to individual inserts. Error: {}", e.getMessage());
                int errs = processIndividual(batchDtos);
                errorCount += errs;
                processedCount += (batchDtos.size() - errs);
            }
            printProgressBar(processedCount, errorCount);
            batchDtos.clear();
        }
        
        public int getProcessedCount() { return processedCount; }
        public int getErrorCount() { return errorCount; }
    }

    private LocalDate parseDob(String val) {
        if (val == null || val.trim().isEmpty()) return LocalDate.now();
        try {
            // SAX Event API formatter might give standard date strings, 
            // handle parsing issues robustly
            return LocalDate.parse(val.trim());
        } catch (DateTimeParseException e) {
            try {
                // If it gives numeric Excel date, we might receive the float number as String.
                // Normally XSSFSheetXMLHandler applies the data format, returning a proper string like 15-May-1990.
                // rely on the handler's formattedValue for most part. If parsing fails, use now() for fallback demo/or throw err
                return LocalDate.parse(val.trim(), java.time.format.DateTimeFormatter.ofPattern("M/d/yy"));
            } catch (Exception e2) {
                // Just fallback to now if we can't handle the format
                return LocalDate.now();
            }
        }
    }

    @Override
    @Transactional
    public void processBatch(List<CustomerRequestDTO> batchDtos) {
        List<String> nics = batchDtos.stream().map(CustomerRequestDTO::getNicNumber).collect(Collectors.toList());
        List<Customer> existingCustomers = customerRepository.findByNicNumberIn(nics);
        Map<String, Customer> customerMap = existingCustomers.stream()
                .collect(Collectors.toMap(Customer::getNicNumber, c -> c));

        List<Customer> entitiesToSave = new ArrayList<>();
        for (CustomerRequestDTO dto : batchDtos) {
            Customer customer = customerMap.get(dto.getNicNumber());
            if (customer == null) {
                customer = new Customer();
                customer.setAddresses(new ArrayList<>());
                customer.setFamilyMembers(new ArrayList<>());
            }
            customer.setName(dto.getName());
            customer.setDateOfBirth(dto.getDateOfBirth());
            customer.setNicNumber(dto.getNicNumber());
            customer.setMobileNumbers(dto.getMobileNumbers());

            entitiesToSave.add(customer);
        }

        customerRepository.saveAll(entitiesToSave);
        entityManager.flush();
        entityManager.clear(); // Clear persistence context
    }

    private int processIndividual(List<CustomerRequestDTO> batchDtos) {
        int errs = 0;
        for (CustomerRequestDTO dto : batchDtos) {
            try {
                // Must be wrapped in its own short transaction for fallback
                self.saveSingleCustomer(dto);
            } catch (Exception ex) {
                log.error("Failed to save customer with NIC {}: {}", dto.getNicNumber(), ex.getMessage());
                errs++;
            }
        }
        return errs;
    }

    @Override
    @Transactional
    public void saveSingleCustomer(CustomerRequestDTO dto) {
        Customer customer = customerRepository.findByNicNumber(dto.getNicNumber()).orElse(new Customer());
        if (customer.getId() == null) {
            customer.setAddresses(new ArrayList<>());
            customer.setFamilyMembers(new ArrayList<>());
        }
        customer.setName(dto.getName());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer.setNicNumber(dto.getNicNumber());
        customer.setMobileNumbers(dto.getMobileNumbers());

        customerRepository.save(customer);
        entityManager.flush();
        entityManager.clear();
    }

    private void printProgressBar(int processedCount, int errorCount) {
        System.out.print("\r\033[KProcessed: " + processedCount + " | Errors: " + errorCount + " rows...");
    }
}
