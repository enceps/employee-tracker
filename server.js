
const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');
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

  // Get all employees
app.get('/api/employee', (req, res) => {
  const sql = `SELECT employee.*, role.id 
             AS role_name 
             FROM employee 
             LEFT JOIN role 
             ON employee.role_id = role.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get a single employee
app.get('/api/employee/:id', (req, res) => {
  const sql = `SELECT employee.*, role.id 
             AS role_name 
             FROM employee 
             LEFT JOIN role 
             ON employee.role_id = role.id 
             WHERE employee.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Delete an employee
app.delete('/api/employee/:id', (req, res) => {
  const sql = `DELETE FROM employee WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Create an employee
app.post('/api/employee', ({ body }, res) => {
  const errors = inputCheck(body, 'id', 'first_name', 'last_name', 'role_id', 'manager_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
 VALUES (?,?,?,?,?)`;
const params = [body.id, body.first_name, body.last_name, body.role_id, body.manager_id];

db.query(sql, params, (err, result) => {
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.json({
    message: 'success',
    data: body
  });
});
});



//get all roles
app.get('/api/role', (req, res) => {
  const sql = `SELECT * FROM role`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

//get single role

app.get('/api/role/:id', (req, res) => {
  const sql = `SELECT * FROM role WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

//delete role
app.delete('/api/role/:id', (req, res) => {
  const sql = `DELETE FROM role WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Role not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Update an employee's role
app.put('/api/employee/:id', (req, res) => {
  const errors = inputCheck(req.body, 'role_id');

if (errors) {
  res.status(400).json({ error: errors });
  return;
}
  const sql = `UPDATE employee SET role_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'employee not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

  // db.query(`SELECT * FROM role`, (err, rows) => {
  //   console.log(rows);
  // });

// //get single department
//   db.query('SELECT * FROM department WHERE id = 1', (err, row) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(row);
//   });

  // //delete an employee
  // db.query(`DELETE FROM employee WHERE id = ?`, 1, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log(result);
  // });

//   //Create an employee
//   const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
//               VALUES (?,?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1, 1];

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

  // Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });