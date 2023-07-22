const inquirer = require("inquirer");

const mysql = require("mysql2");

// Connects to mysql database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "cheese",
    database: "employee_db",
  },
  console.log("connected to database")
);

function handleOptions() {
  inquirer
    .prompt([
      {
        message: "What would you like to do?",
        type: "list",
        name: "action",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((res) => {
      switch (res.action) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployee();
          break;
      }
    });
}

const viewDepartments = async () => {
  const [rows, fields] = await db.promise().query("SELECT * FROM department");
  console.table(rows);
  handleOptions();
};

const viewRoles = async () => {
  const [rows, fields] = await db.promise().query("SELECT * FROM role");
  console.table(rows);
  handleOptions();
};

const viewEmployees = async () => {
  const [rows, fields] = await db.promise().query("SELECT * FROM employee");
  console.table(rows);
  handleOptions();
};

const addEmployee = async () => {
  const response = await inquirer.prompt([
    {
      message: "What is the employee's first name?",
      type: "input",
      name: "first_name",
    },
    {
      message: "What is the employee's last name?",
      type: "input",
      name: "last_name",
    },
    {
      message: "What is the employee's role id?",
      type: "input",
      name: "role_id",
    },
    {
      message: "What is the employee's manager id?",
      type: "input",
      name: "manager_id",
    },
  ]);

  const { first_name, last_name, role_id, manager_id } = response;
  const [rows] = await db
    .promise()
    .query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
      [first_name, last_name, role_id, manager_id]
    );
  console.log("rows are", rows);
  handleOptions();
};

const updateEmployee = async () => {
  const [rows] = await db.promise().query("SELECT * FROM employee");
  const [updateEmployee] = await db.promise().query("SELECT * FROM role");
  const newArray = rows.map((employee) => {
    return {
      value: employee.id,
      name: employee.first_name + " " + employee.last_name,
    };
  });

  const updatedRole = updateEmployee.map((role) => {
    return {
      value: role.id,
      name: role.title,
    };
  });
  console.log("newArray is", newArray);

  const response = await inquirer.prompt({
    message: "Which employee would you like to update?",
    type: "list",
    name: "employee",
    choices: newArray,
  });
  console.log(response.employee);
  const newRole = await inquirer.prompt({
    message: "What is the employee's new role?",
    type: "list",
    name: "role",
    choices: updatedRole,
  });
  const updateFunction = async () => await db
    .promise()
    .query("UPDATE employee SET role_id = ? WHERE id = ?", [
      newRole.role,
      response.employee,
    ]);
  updateFunction().then(handleOptions());
};

handleOptions();
