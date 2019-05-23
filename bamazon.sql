-- Dropping database if it exists 
DROP DATABASE IF EXISTS amazonDB;

-- Create database if it doesn't exist
CREATE database amazonDB;

-- Setting database
USE amazonDB;

-- Creating table 
CREATE TABLE products (
    sku INT NOT NULL,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price INT NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY(sku)
);

-- Selecting from table
SELECT*FROM products