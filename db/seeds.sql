INSERT INTO department (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
       ('Accountant', 80000, 2),
       ('Lawyer', 120000, 3),
       ('Sales Lead', 80000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alice', 'Johnson', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES   ('Bob', 'Smith', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Charlie', 'Brown', 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Diana', 'Jones', 4, 3);