-- Initial master data
INSERT IGNORE INTO countries (name) VALUES 
('Sri Lanka'), ('India'), ('USA'), ('UK'), ('Australia'), 
('Canada'), ('Germany'), ('France'), ('Japan'), ('China'),
('Singapore'), ('United Arab Emirates'), ('Netherlands'), ('Italy'), ('Spain');

INSERT IGNORE INTO cities (name, country_id) VALUES
-- Sri Lanka (1)
('Colombo', 1), ('Kandy', 1), ('Galle', 1), ('Jaffna', 1), ('Negombo', 1),
-- India (2)
('Mumbai', 2), ('Delhi', 2), ('Bangalore', 2), ('Chennai', 2), ('Hyderabad', 2),
-- USA (3)
('New York', 3), ('Los Angeles', 3), ('Chicago', 3), ('Houston', 3), ('Miami', 3),
-- UK (4)
('London', 4), ('Manchester', 4), ('Birmingham', 4), ('Edinburgh', 4), ('Liverpool', 4),
-- Australia (5)
('Sydney', 5), ('Melbourne', 5), ('Brisbane', 5), ('Perth', 5),
-- Canada (6)
('Toronto', 6), ('Vancouver', 6), ('Montreal', 6), ('Ottawa', 6),
-- Germany (7)
('Berlin', 7), ('Munich', 7), ('Hamburg', 7), ('Frankfurt', 7),
-- France (8)
('Paris', 8), ('Lyon', 8), ('Marseille', 8),
-- Japan (9)
('Tokyo', 9), ('Osaka', 9), ('Kyoto', 9),
-- China (10)
('Beijing', 10), ('Shanghai', 10), ('Shenzhen', 10),
-- Singapore (11)
('Singapore', 11),
-- UAE (12)
('Dubai', 12), ('Abu Dhabi', 12),
-- Netherlands (13)
('Amsterdam', 13), ('Rotterdam', 13),
-- Italy (14)
('Rome', 14), ('Milan', 14), ('Venice', 14),
-- Spain (15)
('Madrid', 15), ('Barcelona', 15), ('Valencia', 15);

-- Sample Customers
INSERT IGNORE INTO customers (id, name, date_of_birth, nic_number) VALUES
(1001, 'John Doe', '1990-05-15', '901354231V'),
(1002, 'Jane Smith', '1992-08-22', '927654321V'),
(1003, 'Robert Wilson', '1985-03-10', '854567890V'),
(1004, 'Mary Wilson', '1988-11-05', '884567891V');

-- Sample Mobile Numbers
INSERT IGNORE INTO customer_mobile_numbers (customer_id, mobile_number) VALUES
(1001, '0771234567'), (1001, '0112345678'),
(1002, '0719876543'),
(1003, '0775556667'),
(1004, '0775556668');

-- Sample Addresses
INSERT IGNORE INTO addresses (id, address_line_1, address_line_2, city_id, country_id, customer_id) VALUES
(1, '123 Main St', 'Apartment 4B', 1, 1, 1001), -- Colombo, Sri Lanka
(2, '456 Side Ave', '', 2, 1, 1001),         -- Kandy, Sri Lanka
(3, '789 Broadway', 'Floor 12', 11, 3, 1002), -- New York, USA
(4, '321 Park Lane', '', 16, 4, 1003),        -- London, UK
(5, '321 Park Lane', '', 16, 4, 1004);        -- London, UK

-- Sample Family Members
INSERT IGNORE INTO customer_family_members (customer_id, family_member_id) VALUES
(1003, 1004), -- Robert and Mary are family
(1004, 1003);
