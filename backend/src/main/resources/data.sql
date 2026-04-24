-- Initial master data
INSERT IGNORE INTO countries (name) VALUES ('Sri Lanka'), ('India'), ('USA'), ('UK');
INSERT IGNORE INTO cities (name, country_id) VALUES
                                          ('Colombo', 1), ('Kandy', 1), ('Galle', 1),
                                          ('Mumbai', 2), ('Delhi', 2), ('Bangalore', 2),
                                          ('New York', 3), ('Los Angeles', 3),
                                          ('London', 4), ('Manchester', 4);