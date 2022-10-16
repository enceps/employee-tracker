
const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.get('/', (req, res) => {
    res.json({
      message: 'Hello World'
    });
  });

  // Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '4Fearfirefox',
      database: 'tracker'
    },
    console.log('Connected to the election database.')
  );

  db.query(`SELECT * FROM role`, (err, rows) => {
    console.log(rows);
  });
//get single department
  db.query('SELECT * FROM department WHERE id = 1', (err, row) => {
    if (err) {
      console.log(err);
    }
    console.log(row);
  });
  //delete an employee
  db.query(`DELETE FROM employee WHERE id = ?`, 1, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  //Create an employee
  const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
              VALUES (?,?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1, 1];

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
  // Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });