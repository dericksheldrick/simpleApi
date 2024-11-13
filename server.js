const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

//configuring database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//Testing database connection
db.connect((err) => {
  if (err) {
    console.error("Database Connection failed:", err.stack);
    return;
  }
  console.log("Connected to Mysql database successfully");
});

app.use(express.json()); //parsing Json bodies

//Retrieving all patients
app.get("/patient", (req, res) => {
  const query =
    "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
//retrieve all providers
app.get("/provider", (req, res) => {
  const query =
    "SELECT first_name, last_name, provider_specialty FROM providers";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//filtering patients with their first name
app.get("/patient/filter", (req, res) => {
  const { firstName } = req.query;
  const query =
    "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";
  db.query(query, [firstName], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//retrieve all provider by specialty
app.get("/providers/filter", (req, res) => {
  const { specialty } = req.query;
  const query =
    "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";
  db.query(query, [specialty], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//listen to the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
