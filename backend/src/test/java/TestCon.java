import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import java.lang.reflect.Constructor;
import java.util.Arrays;
public class TestCon {
    public static void main(String[] args) {
        for (Constructor<?> c : XSSFSheetXMLHandler.class.getConstructors()) {
            System.out.println(Arrays.toString(c.getParameterTypes()));
        }
    }
}
