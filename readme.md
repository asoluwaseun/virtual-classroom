# Virtual Classroom API

*Corresponding MySQL table template is included in repository as virtual_classroom.sql*

*Host url is localhost:5200*

### API CALLS


* #### Log in as Admin
URL - localhost:5200/api/admin/login

Method - post

Body - email and password

* #### Register as Admin
URL - localhost:5200/api/admin/register

Method - post

Body - email, name, password

*If successful an auth code is sent with the admin info for subsequent api calls*

* #### Register New Student/Lecturer
URL - localhost:5200/api/admin/new

Method - post

Header - auth

Body - email, name, password, role ( 1 for student, 2 for lecturer), department, level(for student)

* #### Get All Students/Specific Student Info
URL - localhost:5200/api/admin/students

Method - get

Header - auth

To get specific student info use localhost:5200/api/admin/students/*matric number of student*

* #### Get All Lecturerss/Specific Student Info
URL - localhost:5200/api/admin/lecturers

Method - get

Header - auth

To get specific lecturer info use localhost:5200/api/admin/lecturers/*staff number*


