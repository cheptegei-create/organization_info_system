const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Peaches@2023",
  database: "organization_db",
});

connection.connect(function () {
  clientInteraction();
});

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
        "remove an employee",
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
      } else if (options === "remove an employee") {
        removeEmployee();
      }else if (options === "End") {
        connection.end();
      }
    });
};

//Function to view all departments
function viewDepartments() {
  console.log("showing departments");

  //reading all departments

  const sql = `SELECT id, department_name AS title FROM departments`;

  connection.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);

    clientInteraction();
  });
}

//Function to view the roles
function viewRoles() {
  console.log("showing roles");

  //reading all roles

  const sql = `SELECT id, job_title, department_id, salary AS title FROM roles`;

  connection.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);

    clientInteraction();
  });
}

//Function to view the employees
function viewEmployees() {
  console.log("showing employees");

  //reading all employees

  const sql = `SELECT role_id, first_name, last_name, manager_id, AS title FROM employees`;

  connection.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);

    clientInteraction();
  });
}

function addDepartment() {
  const sql = `INSERT INTO movies (department_name)
      VALUES (?)`;
  const params = [body.department_name];

  connection.query(sql, params, (err, res) => {
    if (err) {
      throw err;
    }

    const departmentChoices = res.map(({ id, department_name }) => ({
      value: id,
      department_name: `${department_name}`,
    }));

    console.table(res);

    insertDepartment(departmentChoices);
  });
}

function insertDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What is the name of the department?",
      },
      {
        type: "input",
        name: "id",
        message: "What is the department's number id?",
      },
    ])
    .then(function (data) {
      console.log(data);

      const sql = `INSERT INTO departments SET ?`;
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        sql,
        {
          department_name: data.department_name,
          id: data.id,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);

          clientInteraction();
        }
      );
    });
}

function addRole() {
  const sql = `INSERT INTO roles (department_id, job_title, salary)
      VALUES (?)`;
  const params = [body.department_id, body.job_title, body.salary];

  connection.query(sql, params, (err, res) => {
    if (err) {
      throw err;
    }

    const roleChoices = res.map(({ id, department_id, job_title, salary }) => ({
      value: id,
      department_id: `${department_id}`,
      job_title: `${job_title}`,
      salary: `${salary}`,
    }));

    console.table(res);

    insertRole(roleChoices);
  });
}

function insertRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "What is the role number id?",
      },
      {
        type: "input",
        name: "department_id",
        message: "In which department_id does it belong to?",
      },
      {
        type: "input",
        name: "job_title",
        message: "What is the title of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this job position?",
      },
    ])
    .then(function (data) {
      console.log(data);

      const sql = `INSERT INTO roles SET ?`;
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        sql,
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
        }
      );
    });
}

function addEmployee() {
  const sql = `INSERT INTO roles (role_id, first_name, last_name, manager_id)
      VALUES (?)`;
  const params = [body.department_id, body.job_title, body.salary];

  connection.query(sql, params, (err, res) => {
    if (err) {
      throw err;
    }

    const roleChoices = res.map(({ id, department_id, job_title, salary }) => ({
      value: id,
      department_id: `${department_id}`,
      job_title: `${job_title}`,
      salary: `${salary}`,
    }));

    console.table(res);

    insertEmployee(roleChoices);
  });
}

function insertEmployee(roleChoices) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "What is the employee number id?",
      },
      {
        type: "list",
        name: "role_id",
        message: "Allocate a role to the employee?",
        choices: roleChoices
      },
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
    ])
    .then(function (data) {
      console.log(data);

      var sql = `INSERT INTO roles SET ?`;
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        sql,
        {
         first_name: data.first_name,
          last_name: data.last_name,
          id: data.id,
          role_id: data.role_id,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);

          clientInteraction();
        }
      );
    });
}

