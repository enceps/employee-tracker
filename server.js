const inquirer = require("inquirer");
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
    console.log('Connected to the employee database.')
  );

  startPrompt();


  function startPrompt() {

    inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "CHOOSE OPTION",
      choices: [
        "View Employees",
        "View Employees by Department",
        "Add Employee",
        "Remove Employees",
        "Update Employee Role",
        "Add Role",
        "End"]
    })
    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          viewEmployee();
          break;

        case "View Employees by Department":
          viewEmployeeByDepartment();
          break;
      
        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employees":
          removeEmployees();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Add Role":
          addRole();
          break;

        case "End":
          connection.end();
          break;
      }
    });
};
  //View all employees
function viewEmployee() {
  console.log("Viewing employees\n");


  var query =
  `SELECT employee.*, role.id 
  AS role_name 
  FROM employee 
  LEFT JOIN role 
  ON employee.role_id = role.id`;

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Employees viewed!\n");

    startPrompt();
  });

};

//View employees by department
function viewEmployeeByDepartment(){

  console.log("View By Department\n");

  var query =
  `SELECT department.*, department.id
  FROM department`;
  db.query(query, function (err, res) {
    if (err) throw err;
    const departmentChoices = res.map(data => ({
      value: data.id, name: data.name
    }));
    console.table(res);
    console.log("Departments viewed!\n");

   departmentPrompt(departmentChoices);
  });
};

function departmentPrompt(departmentChoices){

  inquirer
  .prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you choose?",
      choices: departmentChoices
    }
  ])
  .then(function (answer) {
    console.log("answer ", answer.departmentId);

    var query =  `SELECT employee.*, role.id 
    AS role_name 
    FROM employee 
    LEFT JOIN role 
    ON employee.role_id = role.id 
    WHERE employee.id = ?`


db.query(query, answer.departmentId, function (err, res) {
  if (err) throw err;

  console.table("response ", res);
  console.log(res.affectedRows + "Employees are viewed!\n");

  startPrompt();
});
  });
};

//add Employee

function addEmployee() {
  console.log("Inserting an employee!")

  var query =
    `SELECT role.id, role.title, role.salary 
      FROM role `

  db.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("RoleToInsert!");

    promptInsert(roleChoices);
  });
}

function promptInsert(roleChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "role_id",
        message: "What is the employee's role?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {
      console.log(answer);

      var query =`INSERT INTO employee SET ?`
      // when finished prompting, insert a new item into the db with that info
      db.query(query,
        {
          
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          
         
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(`${answer.first_name}` + ` ${answer.last_name} ` + `  Inserted successfully!\n`);

          startPrompt();
        });
    });
}

//remove Employee

//update Employee

















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