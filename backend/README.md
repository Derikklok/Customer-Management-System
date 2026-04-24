# Customer Management System

A Spring Boot application configured to handle extremely large Excel customer ingestion tasks (up to 1+ million rows per file) with full API documentation and relationships.

## Features Required & Completed 

- **Basic Customer API**: `Create`, `Update`, `Get`, `Get All (Paginated Table)`.
- **Relational Integrity**: Handles multiple Family Members and multiple Addresses (Country & City validations).
- **Asynchronous Bulk Upload**: Returns a `202 ACCEPTED` status immediately to the frontend, moving data unmarshalling to an optimal background thread.
- **Batched Processing (`saveAll`)**: Eliminates the N+1 SELECT overhead, executing bulk SQL chunks while maintaining localized persistent states to bypass Memory limits (`OutOfMemoryError`).
- **Low Overhead**: Automatically switches SQL logs to false during runs, utilizing minimal queries using standard JVM `Set` filters.
- **Terminal Progress Bar**: Implemented in place of thousands of SQL statements. Displays exactly how many rows successfully flushed per database batch execution.
- **Error Control**: Specific batch rollbacks upon violation errors, guaranteeing partial data persistence for remaining data.

## Getting Started
Ensure you have an empty MariaDB database configured in `src/main/resources/application.properties`, specifically:
`jdbc:mariadb://localhost:3300/customer_db?rewriteBatchedStatements=true`

By default the system will `update` and auto-initialize required Data `DDL` structures, as well as `DML` seeds (`data.sql` with Master data for Country strings).

1. Execute: `mvn clean install` 
2. Execute: `mvn spring-boot:run`

Please see `/docs/API_DOCUMENTATION.md` for endpoint specifics and valid JSON body/responses.
