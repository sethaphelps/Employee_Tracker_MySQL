const inquirer = require('inquirer');

const mysql = require('mysql2');


// Connects to mysql database
const db = mysql.createConnection(
    {
        host: "127.0.0.1",
        user: "root",
        password: "cheese",
        database: "employee_db"
    },
    console.log("connected to database")
)

function handleOptions() {
    inquirer.prompt([
        {
        message: "What would you like to do?",
        type: "list",
        name: "action",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"]
        },

    ]).then (res => {
        switch (res.action){
            case "View All Departments":
                viewDepartments()
                break;
            case "View All Roles":
                viewRoles()
                break;
            case "View All Employees":
                viewEmployees()
                break;
            case "Add a Department":
                addDepartment()
                break;
            case "Add a Role":
                addRole()
                break;
            case "Add an Employee":
                addEmployee()
                break;
            case "Update an Employee Role":
                updateEmployee()
                break;
        }
    })
}

const viewDepartments = () => {
    db.query("SELECT * FROM department", function(err, result, fields) {
        console.table (result)
    })
}

const addEmployee = () => {
    inquirer.prompt ([
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
        }
    ]).then ((res) => {
        db.query ("INSERT INTO employee SET?;", {
            first_name: res.first_name
        })
        handleOptions();
    })
}

handleOptions();