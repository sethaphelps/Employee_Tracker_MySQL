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
// Creates list of actions for users to choose from
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

// When View Departments is selected, this function allows the user to view all departments
const viewDepartments = async () => {
  const [rows, fields] = await db.promise().query("SELECT * FROM department");
  console.table(rows);
  handleOptions();
};

// When View Roles is selected, this function allows the user to view all roles
const viewRoles = async () => {
  const [rows, fields] = await db.promise().query("SELECT * FROM role");
  console.table(rows);
  handleOptions();
};

// When View Employees is selected, this function allows the user to view all employees
const viewEmployees = async () => {
  const [rows, fields] = await db.promise().query("SELECT * FROM employee");
  console.table(rows);
  handleOptions();
};

// Allows user to add a department
const addDepartment = async () => {
  const response = await inquirer
    .prompt([
      {
        message: "What is the name of the department you would like to add?",
        type: "input",
        name: "departmentName",
      },
    ])
    .then((res) => {
      db.query("INSERT INTO department SET ?;", {
        department_name: res.departmentName,
      });
      handleOptions();
    });
};

// Allows user to add a role
const addRole = async () => {
  const [rows] = await db.promise().query("SELECT * FROM department");
  const newArray = rows.map((department) => {
    return {
      value: department.id,
      name: department.department_name,
    };
  });

  const response = await inquirer
    .prompt([
      {
        message: "What role would you like to add?",
        type: "input",
        name: "roleName",
      },
      {
        message: "What is the salary of this role?",
        type: "input",
        name: "salary",
        validate: (answer) => {
          if (isNaN(answer)) {
            return `Entry not valid. Please enter a number.`;
          } else if (answer === "") {
            return `Entry not valid. Please enter a number.`;
          }
          return true;
        },
      },
      {
        message: "Which department does this role belong to?",
        type: "list",
        name: "department_number",
        choices: newArray,
      },
    ])
    .then((res) => {
      db.query("INSERT INTO role SET ?;", {
        title: res.roleName,
        salary: res.salary,
        department_id: res.department_number,
      });
      handleOptions();
    });
};

// Allows user to add an employee
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
  handleOptions();
};

// Allows user to update employees
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

  const response = await inquirer.prompt({
    message: "Which employee would you like to update?",
    type: "list",
    name: "employee",
    choices: newArray,
  });
  const newRole = await inquirer.prompt({
    message: "What is the employee's new role?",
    type: "list",
    name: "role",
    choices: updatedRole,
  });
  const updateFunction = async () =>
    await db
      .promise()
      .query("UPDATE employee SET role_id = ? WHERE id = ?", [
        newRole.role,
        response.employee,
      ]);
  updateFunction().then(handleOptions());
};

handleOptions();
