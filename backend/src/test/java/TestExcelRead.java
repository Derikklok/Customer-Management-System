

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.eventusermodel.ReadOnlySharedStringsTable;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import org.apache.poi.xssf.model.StylesTable;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;

import javax.xml.parsers.SAXParserFactory;
import java.io.File;
import java.io.InputStream;

public class TestExcelRead {
    public static void main(String[] args) {
        try {
            File file = new File("docs/customers_1m_no_contact.xlsx");
            try (OPCPackage pkg = OPCPackage.open(file)) {
                XSSFReader reader = new XSSFReader(pkg);
                StylesTable styles = reader.getStylesTable();
                ReadOnlySharedStringsTable strings = new ReadOnlySharedStringsTable(pkg);

                XSSFSheetXMLHandler.SheetContentsHandler sheetHandler = new XSSFSheetXMLHandler.SheetContentsHandler() {
                    int rows = 0;
                    @Override
                    public void startRow(int rowNum) { }

                    @Override
                    public void endRow(int rowNum) {
                        rows++;
                        if (rows % 100000 == 0) {
                            System.out.println("Rows: " + rows);
                        }
                    }

                    @Override
                    public void cell(String cellReference, String formattedValue, org.apache.poi.xssf.usermodel.XSSFComment comment) {
                        if (rows < 5) {
                            System.out.println("Cell: " + cellReference + " = " + formattedValue);
                        }
                    }

                    @Override
                    public void headerFooter(String text, boolean isHeader, String tagName) {}
                };

                XMLReader parser = SAXParserFactory.newInstance().newSAXParser().getXMLReader();
                parser.setContentHandler(new XSSFSheetXMLHandler(styles, strings, sheetHandler, new org.apache.poi.ss.usermodel.DataFormatter(), false));

                XSSFReader.SheetIterator sheets = (XSSFReader.SheetIterator) reader.getSheetsData();
                while (sheets.hasNext()) {
                    try (InputStream sheetStream = sheets.next()) {
                        System.out.println("Parsing sheet: " + sheets.getSheetName());
                        parser.parse(new InputSource(sheetStream));
                    }
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
