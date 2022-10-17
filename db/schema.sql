 DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
 DROP TABLE IF EXISTS department;
 CREATE TABLE department (
 id INT PRIMARY KEY ,
 name VARCHAR(30)
 );

 CREATE TABLE role ( 
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
title VARCHAR(30),
salary DECIMAL ,
department_id INT, 
CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
  );

  CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) ,
last_name VARCHAR(30) ,
role_id INT ,
manager_id INT,
CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);


-- CREATE TABLE department (
--   id INT NOT NULL AUTO_INCREMENT,
--   name VARCHAR(45) NULL,
--   PRIMARY KEY (id)
-- );

-- CREATE TABLE role (
--   id INT NOT NULL AUTO_INCREMENT,
--   title VARCHAR(45) NULL,
--   salary DECIMAL(10.3) NULL,
--   department_id INT NULL,
--   PRIMARY KEY (id)
-- );

-- CREATE TABLE employee (
--   id INT NOT NULL AUTO_INCREMENT,
--   first_name VARCHAR(45) NULL,
--   last_name VARCHAR(45) NULL,
--   role_id INT NULL,
--   manager_id INT NULL,
--   PRIMARY KEY (id)
-- );