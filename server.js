//importing packages
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

//Connecting the database
const db = mysql.createConnection(
  {
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Peaches@2023",
    database: "organization_db",
  },
  console.log(`Connected to the organization_db database.`)
);

//Function to execute the program and connects to the database
db.connect(function (err) {
  if (err) {
    console.log(err);
  }
  clientInteraction();
});

//Function to prompt the user
const clientInteraction = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "How can we help you today?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "remove an employee",
          "update an employee role",
          "End",
        ],
      },
    ])
    .then(function (json) {
      console.log(json.options);

      const answer = json.options;

      // switch statements to call individual functions according to the user's prompt selection
      switch (answer) {
        case "view all departments":
          viewDepartments();
          break;
        case "view all roles":
          viewRoles();
          break;
        case "view all employees":
          viewEmployees();
          break;
        case "add a department":
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "Add Role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "update an employee role":
          updateRole();
          break;
        case "remove an employee":
          removeEmployee();
          break;
        case "end":
          db.end();
          break;
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

//Function to view all departments
function viewDepartments() {
  //reading all departments

  let sql = `SELECT id, department_name FROM departments ORDER BY departments.id`;

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);

    clientInteraction();
  });
}

//Function to view the roles
function viewRoles() {
  console.log("showing roles");

  //reading all roles

  let sql = `SELECT departments.department_name AS department, roles.job_title, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name`;

  db.query(sql, function (err, res) {
    if (err) {
      console.log(err);
    }
    console.table(res);

    clientInteraction();
  });
}

//Function to view the employees
function viewEmployees() {
  console.log("showing employees");

  //reading all employees

  let sql = `SELECT departments.department_name AS department, roles.job_title AS role, employee.first_name, employee.last_name, employee.manager_id FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name;`;

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);

    clientInteraction();
  });
}
//Function to add a department to the system
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What is the name of the department?",
      },
    ])
    .then(function (data) {
      console.log(data);

      let sql = `INSERT INTO departments SET ?`;
      // when finished prompting, insert a new item into the db with that info
      db.query(
        sql,
        {
          department_name: data.department_name,
        },
        function (err, res) {
          if (err) {
            console.log(err);
          }
          console.table(res);

          clientInteraction();
        }
      );
    });
}
//Function to map the required information to add a role to the system
function addRole() {
  const sql = `SELECT id, department_name FROM departments ORDER BY departments.id`;

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }

    const department = res.map(({ id, department_name }) => ({
      value: id,
      name: `${id} ${department_name}`,
    }));

    console.table(res);

    insertNewRole(department);
  });
}
// Function to prompt the user for the new role information and adds to the system
function insertNewRole(department) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "In which department does the role belong to?",
        choices: department,
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

      let sql = `INSERT INTO roles SET ?`;
      // when finished prompting, insert a new item into the db with that info
      db.query(
        sql,
        {
          job_title: data.job_title,
          department_id: data.department_id,
          salary: data.salary,
        },
        function (err, res) {
          if (err) {
            console.log(err);
          }
          console.table(res);

          clientInteraction();
        }
      );
    });
}

//Function to map the required information to add an employee to the system
function addEmployee() {
  const sql = `SELECT departments.department_name AS department, roles.id, roles.job_title, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name`;

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }

    const roleChoices = res.map(({ id, job_title }) => ({
      value: id,
      name: `${id} ${job_title}`,
    }));

    console.table(res);

    insertEmployee(roleChoices);
  });
}
// Function to prompt the user for the new employee information and adds to the system
function insertEmployee(roleChoices) {
  console.log(roleChoices);
  inquirer
    .prompt([
      {
        type: "list",
        name: "role_id",
        message: "Allocate a role to the employee?",
        choices: roleChoices,
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

      let sql = `INSERT INTO employee SET ?`;
      // when finished prompting, insert a new item into the db with that info
      db.query(
        sql,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          role_id: data.role_id,
        },
        function (err, res) {
          if (err) {
            console.log(err);
          }
          console.table(res);

          clientInteraction();
        }
      );
    });
}

function updateRole() {
  let sql = `SELECT departments.department_name AS department, roles.job_title AS role, employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name`;

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }

    const employee = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));

    console.table(res);

    updateNewEmployee(employee);
  });
}

function updateNewEmployee(employee) {
  let sql = `SELECT departments.department_name AS department, roles.id, roles.job_title, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name`;

  db.query(sql, function (err, res) {
    if (err) {
      console.log(err);
    }

    const newRoleChoices = res.map(({ id, job_title, salary }) => ({
      value: id,
      job_title: `${job_title}`,
      salary: `${salary}`,
    }));

    console.table(res);

    promptUpdate(employee, newRoleChoices);
  });
}

function promptUpdate(employee, newRoleChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "id",
        message: "Which employee do you want to update their role?",
        choices: employee,
      },
      {
        type: "list",
        name: "role_id",
        message: "Select the role:",
        choices: newRoleChoices,
      },
    ])
    .then(function (data) {
      console.log(data);

      let sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
      // when finished prompting, insert a new item into the db with that info
      db.query(sql, [data.role_id, data.id], function (err, res) {
        if (err) {
          console.log(err);
        }
        console.table(res);

        clientInteraction();
      });
    });
}

function removeEmployee() {
  let sql = `SELECT departments.department_name AS department, roles.job_title AS role, employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name;`;

  db.query(sql, function (err, res) {
    if (err) {
      console.log(err);
    }

    const selectEmployee = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${id} ${first_name} ${last_name}`,
    }));

    console.table(res);

    deleteEmployee(selectEmployee);
  });
}

function deleteEmployee(selectEmployee) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "exEmployee",
        message: "Which employee do you want to fire today?",
        choices: selectEmployee,
      },
    ])
    .then(function (data) {
      console.log(data);

      const sql = `DELETE FROM employee WHERE ?`;
      // when finished prompting, insert a new item into the db with that info
      db.query(sql, { id: data.exEmployee }, function (err, res) {
        if (err) {
          console.log(err);
        }
        console.table(res);

        clientInteraction();
      });
    });
}
