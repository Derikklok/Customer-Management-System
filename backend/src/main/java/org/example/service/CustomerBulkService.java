package org.example.service;

import java.io.File;
import java.util.List;
import org.example.dto.CustomerRequestDTO;

public interface CustomerBulkService {
    void bulkCreateFromExcelAsync(File file);
    void processBatch(List<CustomerRequestDTO> batchDtos);
    void saveSingleCustomer(CustomerRequestDTO dto);
}
