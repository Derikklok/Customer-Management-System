-- Master data tables
CREATE TABLE IF NOT EXISTS countries (
                                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                         name VARCHAR(100) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS cities (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      name VARCHAR(100) NOT NULL,
    country_id BIGINT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    UNIQUE (name, country_id)
    );


-- Customer tables
CREATE TABLE IF NOT EXISTS customers (
                                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                         name VARCHAR(200) NOT NULL,
    date_of_birth DATE NOT NULL,
    nic_number VARCHAR(50) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS customer_mobile_numbers (
                                                       customer_id BIGINT NOT NULL,
                                                       mobile_number VARCHAR(20),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

CREATE TABLE IF NOT EXISTS addresses (
                                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                         address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    city_id BIGINT,
    country_id BIGINT,
    customer_id BIGINT,
    FOREIGN KEY (city_id) REFERENCES cities(id),
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

CREATE TABLE IF NOT EXISTS customer_family_members (
                                                       customer_id BIGINT NOT NULL,
                                                       family_member_id BIGINT NOT NULL,
                                                       PRIMARY KEY (customer_id, family_member_id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (family_member_id) REFERENCES customers(id)
    );