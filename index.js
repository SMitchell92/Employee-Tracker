import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

async function main() {
    await connectToDb();
    mainMenu();

}

async function getRoleChoices() {
    const roles = await pool.query('SELECT * FROM role');
    const originalRoles = roles.rows;

    const choices = originalRoles.map(role => {
        return {
            name: role.title,
            value: role.id
        }
    })

    return choices;
}

async function getEmployeeChoices() {
    const employees = await pool.query('SELECT * FROM employee');
    const originalEmployees = employees.rows;

    const choices = originalEmployees.map(employee => {
        return {
            name: employee.first_name + ' ' + employee.last_name,
            value: employee.id
        }
    })

    return choices;
}


function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'main',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
            },
        ])
        .then(async (response) => {
            if (response.main === 'view all departments') {
                console.log('view all departments')

                pool.query("select * from department;")
                    .then(data => {
                        const departments = data.rows;

                        console.table(departments)
                        mainMenu()
                    })

            }
            else if (response.main === 'view all roles') {
                console.log(`view all roles`)
                pool.query("select role.id, role.title, role.salary, department.name as Department from role JOIN department on role.department_id = department.id;")
                    .then(data => {
                        const roles = data.rows;

                        console.table(roles)
                        mainMenu()
                    })

            }
            else if (response.main === 'view all employees') {
                console.log('view all employees')
                pool.query("select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as Department, manager.first_name as managerFirst, manager.last_name as managerLast from employee JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id LEFT JOIN employee as manager on employee.manager_id = manager.id;")
                    .then(data => {
                        const employees = data.rows;

                        console.table(employees)
                        mainMenu()
                    })
            }
            else if (response.main === 'add a department') {
                console.log('add a department')

                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'What is the name of the department?',
                        name: 'name'
                    },
                ])
                    .then(answers => {
                        pool.query("INSERT INTO department (name) VALUES ($1)", [answers.name])
                            .then(data => {
                                console.log('Department added')
                                mainMenu()
                            })
                    })


            }
            else if (response.main === 'add a role') {
                console.log('add a role')
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'What is the title of the role?',
                        name: 'title'
                    },
                    {
                        type: 'input',
                        message: 'What is the salary of the role?',
                        name: 'salary'
                    },
                    {
                        type: 'input',
                        message: 'What is the department id of the role?',
                        name: 'department_id'
                    }
                ])
                    .then(answers => {
                        pool.query("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)", [answers.title, answers.salary, answers.department_id])
                            .then(data => {
                                console.log('Role added')
                                mainMenu()
                            })
                    })
            }
            else if (response.main === 'add an employee') {
                console.log('add an employee')
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'What is the new employee first name?',
                        name: 'first_name'
                    },
                    {
                        type: 'input',
                        message: 'What is the new employee last name?',
                        name: 'last_name'
                    },
                    {
                        type: 'list',
                        message: 'Which role is gonna be the new role of the employee?',
                        name: 'role_id',
                        choices: await getRoleChoices()
                    },
                    {
                        type: 'input',
                        message: 'What is the manager id of the new employee?',
                        name: 'manager_id'
                    }
                ])
                    .then(answers => {
                        pool.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)", [answers.first_name, answers.last_name, answers.role_id, answers.manager_id])
                            .then(data => {
                                console.log('Employee added')
                                mainMenu()
                            })
                    })
            }
            else if (response.main === 'update an employee role') {
                console.log('update an employee role')
                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Which employee do you want to update?',
                        name: 'id',
                        choices: await getEmployeeChoices()
                    },
                    {
                        type: 'list',
                        message: 'Which role is gonna be the new role of the employee?',
                        name: 'role_id',
                        choices: await getRoleChoices()
                    }
                ])
                    .then(answers => {
                        pool.query("UPDATE employee SET role_id = $1 WHERE id = $2", [answers.role_id, answers.id])
                            .then(data => {
                                console.log('Employee role updated')
                                mainMenu()
                            })
                    })
            }
        });

}

main()
