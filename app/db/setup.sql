-- Drop existing tables if they exist
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS timesheets;

-- Create employees table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Employee ID
    full_name TEXT NOT NULL,                  -- Full Name of the employee
    email TEXT NOT NULL UNIQUE,               -- Employee's email (unique)
    phone TEXT NOT NULL,                      -- Employee's phone number
    date_of_birth DATE NOT NULL,              -- Employee's date of birth
    job_title TEXT,                           -- Employee's job title
    department TEXT,                          -- Employee's department
    salary DECIMAL(10, 2)                     -- Employee's salary (decimal for monetary value)
);

-- Create timesheets table
CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Timesheet ID
    start_time DATETIME NOT NULL,            -- Start time of the timesheet
    end_time DATETIME NOT NULL,              -- End time of the timesheet
    summary TEXT,                            -- Summary of the work done (nullable)
    employee_id INTEGER NOT NULL,            -- Employee ID (foreign key)
    FOREIGN KEY (employee_id) REFERENCES employees(id)  -- Link to the employee
);
