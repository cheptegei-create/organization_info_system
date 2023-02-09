const router = require("express").Router();
const inquirer = require("inquirer");
require("console.table");

//Function to prompt the user
const clientInteraction = () => {
  inquirer
    .prompt({
      type: "list",
      name: "options",
      message: "How can we help you today?",
      choices: [
        "View all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
        "End",
      ],
    })
    .then(function ({ options }) {
      if (options === "view all departments") {
        viewDepartments();
      } else if (options === "view all roles") {
        viewRoles();
      } else if (options === "view all employees") {
        viewEmployees();
      } else if (options === "add a department") {
        addDepartment();
      } else if (options === "add a role") {
        addRole();
      } else if (options === "add an employee") {
        addEmployee();
      } else if (options === "update an employee role") {
        updateRole();
      } else if (options === "End") {
        connection.end();
      }
    });
};

//Function to view all departments
function viewDepartments() {
  console.log("showing departments");

  //reading all departments
  router.get("/api/departments", (req, res) => {
    const sql = `SELECT id, department_name AS title FROM departments`;

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      console.table(res);

      clientInteraction();
    });
  });
}

//Function to view the roles
function viewRoles() {
  console.log("showing roles");

  //reading all roles
  router.get("/api/roles", (req, res) => {
    const sql = `SELECT id, job_title, department_id, salary AS title FROM roles`;

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      console.table(res);

      clientInteraction();
    });
  });
}

//Function to view the employees
function viewEmployees() {
  console.log("showing employees");

  //reading all employees
  router.get("/api/employees", (req, res) => {
    const sql = `SELECT role_id, first_name, last_name, manager_id, AS title FROM employees`;

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      console.table(res);

      clientInteraction();
    });
  });
}

function addDepartment() {
  router.post('/api/departments', ({ body }, res) => {
    const sql = `INSERT INTO movies (department_name)
      VALUES (?)`;
    const params = [body.department_name];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      const departmentChoices = res.map(({ id, department_name }) => ({
        value: id, department_name: `${department_name}`
      }));

      console.table(res);

      insertDepartment(departmentChoices);
    });
  });
}

function insertDepartment(departmentChoices) {
  inquirer
  .prompt([
    {
      type: "input",
      name: "department_name",
      message: "What is the name of the department?"
    },
    {
      type: "list",
      name: "id",
      message: "What is the department's number id?",
      choices: departmentChoices
    },
  ])
  .then(function (data) {
    console.log(data);

    const sql = `INSERT INTO departments SET ?`
    // when finished prompting, insert a new item into the db with that info
    db.query(sql,
      {
        department_name: data.department_name,
        id: data.id,
       
      },
      function (err, res) {
        if (err) throw err;

        console.table(res);
        

        clientInteraction();
      });
  });
}

function addRole() {
  router.post('/api/roles', ({ body }, res) => {
    const sql = `INSERT INTO roles (department_id, job_title, salary)
      VALUES (?)`;
    const params = [body.department_id, body.job_title, bodu.salary];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      const roleChoices = res.map(({ id, department_id, job_title, salary }) => ({
        value: id, department_id: `${department_id}`, job_title: `${job_title}`, salary: `${salary}`
      }));

      console.table(res);

      insertRole(roleChoices);
    });
  });
}

function insertRole(roleChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "What is the role number id?"
      },
      {
        type: "input",
        name: "department_id",
        message: "In which department_id does it belong to?"
      },
      {
        type: "input",
        name: "job_title",
        message: "What is the title of the role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this job position?"
      },
    ])
    .then(function (data) {
      console.log(data);

      var sql = `INSERT INTO roles SET ?`
      // when finished prompting, insert a new item into the db with that info
      db.query(sql,
        {
          job_title: data.job_title,
          department_id: data.department_id,
          id: data.id,
          salary: data.salary,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          
          clientInteraction();
        });
    });
}