# Virtual Classroom API

*Corresponding MySQL table template is included in repository as virtual_classroom.sql*

*Host url is localhost:5200 for local development and virtual-class.herokuapp.com*



### API CALLS


* #### Log in as Admin
URL - /api/admin/login

Method - post

Body - email and password

* #### Register as Admin
URL - /api/admin/register

Method - post

Body - email, name, password

*If successful an auth code is sent with the admin info for subsequent api calls*

* #### Register New Student/Lecturer
URL - /api/admin/new

Method - post

Header - auth

Body - email, name, password, role ( 1 for student, 2 for lecturer), department, level(for student),picture (max size 50kb since it saves as base64 on db)

* #### Get All Students/Specific Student Info
URL - /api/admin/students

Method - get

Header - auth

To get specific student info use localhost:5200/api/admin/students/*matric number of student*

* #### Get All Lecturers/Specific Student Info
URL - /api/admin/lecturers

Method - get

Header - auth

To get specific lecturer info use 
/api/admin/lecturers/*staff number*


## Deploying on HEROKU

*Environmental Variables Used*

DB_HOST

DB_USERNAME

DB_PASSWORD

DB_NAME

JWT_KEY

* The app is ready-made to be deployed on heroku. On deployment please set the environment variables to enable the app function well with the database. A free database can be setup on https://remotemysql.com and the corresponding details entered as the environment variables.

