INSERT INTO department (department_name)
VALUES ("Human Resources"),
       ("Sales"),
       ("IT"),
       ("Marketing"),
       ("Customer Service");


INSERT INTO role (title, salary, department_id)
VALUES ("Human Resources Manager", 65208, 1),
        ("Regional Manager", 72493, 2),
        ("Assistant to the Regional Manager", 40001, 2),
        ("IT Magician", 300546, 3),
        ("Customer Service Lead", 58245, 5),
        ("Customer Service Assistant", 58244, 5),
        ("Part Time Designer", 40002, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Jones", 1, NULL),
        ("Michael", "Scott", 2, NULL),
        ("David", "Blaine", 4, NULL),
        ("Dwight", "Schrute", 3, 2),
        ("Leslie", "Knope", 5, NULL),
        ("John", "Ralphio", 6, 5),
        ("Tommy", "Hilfiger", 7, 1);
        

