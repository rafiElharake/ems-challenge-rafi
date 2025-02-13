import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

// Sample Employees with all fields
const employees = [
  {
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    date_of_birth: '1990-05-15',
    job_title: 'Software Engineer',
    department: 'Development',
    salary: 75000,
  },
  {
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '9876543210',
    date_of_birth: '1985-08-30',
    job_title: 'HR Manager',
    department: 'Human Resources',
    salary: 80000,
  },
  {
    full_name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '5551234567',
    date_of_birth: '1992-02-10',
    job_title: 'Product Manager',
    department: 'Product',
    salary: 85000,
  },
];

// Sample Timesheets with summary and employee_id
const timesheets = [
  {
    employee_id: 1,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    summary: 'Worked on feature X and fixed bugs.',
  },
  {
    employee_id: 2,
    start_time: '2025-02-11 12:00:00',
    end_time: '2025-02-11 17:00:00',
    summary: 'Reviewed job applications and conducted interviews.',
  },
  {
    employee_id: 3,
    start_time: '2025-02-12 07:00:00',
    end_time: '2025-02-12 16:00:00',
    summary: 'Worked on product design and meetings with stakeholders.',
  },
];

// Function to insert data into the specified table
const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  // Insert Employees and Timesheets data
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});
