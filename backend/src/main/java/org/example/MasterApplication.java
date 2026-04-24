package org.example;

import org.apache.poi.util.IOUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MasterApplication {
    public static void main(String[] args) {
        // Increase the maximum allowable size for Apache POI byte arrays to avoid
        // allocation limits when processing large Excel files (e.g., 1M records)
        IOUtils.setByteArrayMaxOverride(Integer.MAX_VALUE);
        SpringApplication.run(MasterApplication.class, args);
    }
}