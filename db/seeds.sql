INSERT INTO department ( id, name)
VALUES
(1, 'Sales' ),
(2, 'Legal' ),
(3, 'Finance' ),
(4, 'Engineering');

INSERT INTO role ( id, title, salary, department_id)
VALUES
(1, 'Sales Manager', 18.00, 1),
(2, 'Sales Associate', 16.50, 1),
(3, 'Law Representative', 20.50, 2),
(4, 'Accountant', 16.50, 3),
(5, 'Engineer', 22.75, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Spencer', 'Cole', 1, 1),
(2, 'John', 'Doe', 3, 1),
(3, 'Jane', 'Smith', 3, 1),
(4, 'Bob', 'Billy', 4, 1),
(5, 'Kevin', 'Bacon', 1, 1);