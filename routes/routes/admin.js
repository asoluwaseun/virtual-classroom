const bcrypt = require('bcryptjs');
const fs = require('fs');
const formidable = require('formidable');
const jwt = require("jsonwebtoken");

//dbqueries
const query = require('../../config/db/dbqueries');

const jwt_key = "secret";

let admin = {
    //post call to login
    login : (req,res)=>{
        let email = req.body.email;
        let password = req.body.password;
        
        let response = {};

        //checks if any of the required parameters is empty
        if(!email || !password){
            response.status = "error";
            response.statusCode = 400;
            response.error = {
                message: "one or more parameters empty",
                parameters: `${!email ? 'email' : ""}${!email && !password ? ', ' : ""}${!password ? 'password' : ""} `
            }

            res.json(response)
        }

        //checks for user using email and verifies the password, 
        //then generates an auth code to be used for consequent api calls
        else{
            query.read("id,email,name,password,email,role,date_registered","users","email",email,(results,err)=>{
                if(results.length > 0 && results[0].role === 3){
                    bcrypt.compare(password, results[0].password, (err,result)=> {
                        if(result){
                            response.status = "ok";
                            response.statusCode = 200;
                            response.data = {
                                email: results[0].email,
                                name: results[0].name,
                                date_registered: results[0].date_registered
                            }
                            response.data.auth = jwt.sign({user_id: results[0].id},jwt_key);
    
                            res.json(response)
                        }
                        else{
                            response.status = "error";
                            response.statusCode = 400;
                            response.error = {
                                message: "invalid password"
                            }
    
                            res.json(response)
                        }
                    })
                }
                else{
                    response.status = "error";
                    response.statusCode = 403;
                    response.error = {
                        message: `${(!results.length > 0 || !results[0].role !== 3) ? 'admin not found' : ""}`
                    }
    
                    res.json(response)
                }
            })
        }
        
    },

    //post call to register admin
    register: (req,res)=>{
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let response = {};

        //checks if any of the required parameters is empty
        if(!email || !password || !name){
            response.status = "error";
            response.statusCode = 400;
            response.error = {
                message: "one or more parameters empty",
                parameters: `${!email ? 'email' : ""}${!email && !password ? ', ' : ""}${!password ? 'password' : ""}${!name ? ', name' : ""} `
            }

            res.json(response);
        }
        else{
            //checks if the email is in use by the admin,lecturer or student.
            query.read("email","users","email",email,(results,err)=>{
                if(results.length){
                    response.status = "error";
                    response.statusCode = 401;
                    response.error = {
                        message: "email taken",
                    } 

                    res.send(response);
                }
                
                //hashes the password and create the admin's account
                //with a corresponding response containing the admin's basic info
                else{
                    bcrypt.genSalt(10, (err,salt)=>{
                        bcrypt.hash(password,salt,(err,hash)=>{
                            if(!err){
                                let userSchema = {
                                    name: name,
                                    email: email,
                                    password: hash,
                                    role: 3
                                }

                                query.create("users",userSchema,(results)=>{
                                    if(results.affectedRows){
                                        response.status = "user created";
                                        response.statusCode = 201;
                                        response.data = {
                                            email: email,
                                            name: name
                                        }
                                        response.data.auth = jwt.sign({user_id: results.insertId},jwt_key);
                
                                        res.json(response)
                                    }
                                    else{
                                        response.status = "error";
                                        response.statusCode = 500;
                                        response.error = {
                                            message: "server error",
                                        } 
                    
                                        res.send(response);
                                    }
                                    // res.send(response)
                                })
                            }
                            else{
                                response.status = "error";
                                response.statusCode = 500;
                                response.error = {
                                    message: "server error",
                                } 
            
                                res.send(response);
                            }
                        })
                    })
                }
            });

        }
        
    },
    
    //post call to register student or lecturer
    new: (req,res)=>{
        
        let auth = req.headers.auth;
        let response = {};
        let form = new formidable.IncomingForm();

        form.parse(req,(err,fields,files)=>{
            let name = fields.name;
            let email = fields.email;
            let department = fields.department;
            let picture = files.picture;
            let level = fields.level;
            let role = fields.role;

            //checks if any of the required parameters is empty
        if(!email || !name || !department || !role){
            response.status = "error";
            response.statusCode = 400;
            response.error = {
                message: "one or more parameters empty",
                parameters: `${!email ? 'email' : ""}${!name ? ', name' : ""}${!department ? ', department' : ""} `
            }

            res.json(response);
        }
        else{
            //verifies auth code to ensure it is an admin making the request
            //calls the corresponding function depending on the role chosen
            jwt.verify(auth, jwt_key, (err, payload) => {
                if (payload) {
                    let user_id = payload.user_id;
                    query.read("role","users","id",user_id,(results,err)=>{
                        if(results.length > 0){
                            if(results[0].role === 3){
                                if(role === "1"){
                                    create(1)
                                }
                                else if(role === "2"){
                                    create(2)
                                }
                                else{
                                    response.status = "error";
                                    response.statusCode = 401;
                                    response.error = {
                                        message: "role not chosen",
                                    } 
            
                                    res.send(response);
                                }
                            }
                            else{
                                response.status = "error";
                                response.statusCode = 401;
                                response.error = {
                                    message: "auth error",
                                } 
        
                                res.send(response);
                            }
                        } 
                        else{
                            response.status = "error";
                            response.statusCode = 401;
                            response.error = {
                                message: "auth error",
                            } 
            
                            res.send(response);
                        }          
                    })
                }
                else{
                    response.status = "error";
                    response.statusCode = 401;
                    response.error = {
                        message: "auth error",
                    } 
    
                    res.send(response);
                }
            })
        }

        //checks the role and creates a user account and either a lecturer or student account depending on the role chosen
        function create(role){
            query.read("email","users","email",email,(results,err)=>{
                if(results.length){
                    response.status = "error";
                    response.statusCode = 401;
                    response.error = {
                        message: "email taken",
                    } 

                    res.send(response);
                }
                else{
                    bcrypt.genSalt(10, (err,salt)=>{
                        bcrypt.hash(email,salt,(err,hash)=>{
                            if(!err){
                                  
                                    let picture_path = picture.path
                                    let fileStream = fs.readFileSync(picture_path);
                                    
                                    let userSchema = {
                                        name: name,
                                        email: email,
                                        password: hash,
                                        role: role,
                                        picture: Buffer.from(fileStream).toString('base64')
                                    }
                                    query.create("users",userSchema,(results)=>{
                                        if(results.affectedRows){
                                            response.status = `${role === 2 ? "lecturer " : "student "}account created`;
                                            response.statusCode = 201;
                                            response.data = {
                                                email: email,
                                                name: name,
                                                department: department
                                            }

                                            if(role === 1){
                                                let studentCount = results.insertId;
                                                studentCount++
                                                matric =  studentCount.toLocaleString('en', {minimumIntegerDigits:4,minimumFractionDigits:0,useGrouping:false}); 
                                                matricNo = (`ST${matric}`).toUpperCase();
                                                let studentSchema = {
                                                    user_id: results.insertId,
                                                    matric: matricNo,
                                                    level: level,
                                                    department: department
                                                }
                                            
                                                query.create("students",studentSchema,(results)=>{  
                                                    if(results.affectedRows){
                                                        response.data.matric = matricNo;
                                                        response.data.level = level;

                                                        res.send(response)
                                                    }
                                                })
                                            }
                                            else if(role === 2){
                                                let lecturerCount = results.insertId;
                                                lecturerCount++
                                                staff_no =  lecturerCount.toLocaleString('en', {minimumIntegerDigits:4,minimumFractionDigits:0,useGrouping:false}); 
                                                staff_number = (`LT${staff_no}`).toUpperCase();
                                            
                                                let lecturerSchema = {
                                                    user_id: results.insertId,
                                                    staff_number: staff_number,
                                                    department: department
                                                }
                                                
                                                query.create("lecturers",lecturerSchema,(results)=>{
                                                    if(results.affectedRows){
                                                        response.data.staff_number = staff_number;

                                                        res.send(response)
                                                    }
                                                })
                                            }
                                        }
                                        else{
                                            response.status = "error";
                                            response.statusCode = 500;
                                            response.error = {
                                                message: "server error",
                                            } 
                        
                                            res.send(response);
                                        }
                                        // res.send(response)
                                    })
                            }
                            else{
                                response.status = "error";
                                response.statusCode = 500;
                                response.error = {
                                    message: "server error",
                                } 
            
                                res.send(response);
                            } 
                        })
                    });
                }
            });
        }
        })
      
        
    },

    //get request to get specific or all students info
    getAllStudents: (req,res)=>{
        let matric = req.params.matric;
        let auth = req.headers.auth;
        let response = {};
        
        //verifies auth code to ensure it is an admin making the request
        //checks the student info or all students info depending on if a matric number was given
        jwt.verify(auth, jwt_key,(err,payload)=>{
            if(payload){
                let user_id = payload.user_id;
                query.read("role","users","id",user_id,(results,err)=>{
                    if(results[0].role === 3){
                        if(matric){
                            query.getStudent(matric.toUpperCase(),(results,err)=>{
                                if(results.length > 0){
                                    response.status = "ok";
                                    response.statusCode = 200;
                                    response.data = {
                                        name : results[0].name,
                                        email: results[0].email,
                                        department: results[0].department,
                                        level: results[0].level,
                                        matric: results[0].matric
                                    }

                                    res.send(response); 
                                }
                                else{
                                    response.status = "error";
                                    response.statusCode = 404;
                                    response.error = {
                                        message: "student not found",
                                    } 
            
                                    res.send(response); 
                                }
                            })
                        }
                        else{
                            query.getAllStudents((results,err)=>{
                                response.status = "ok";
                                response.statusCode = 200;
                                response.data = {
                                    no_of_students: results.length,
                                    students_data: results
                                }
                                res.send(response);  
                            })
                        }
                    }
                    else{
                        response.status = "error";
                        response.statusCode = 401;
                        response.error = {
                            message: "auth error",
                        } 

                        res.send(response);
                    }
                })
            }
        })
    },

    //get request to get specific or all lecturers info
    getAllLecturers: (req,res)=>{
        let staff_no = req.params.staff_no;
        let auth = req.headers.auth;
        let response = {};

        //verifies auth code to ensure it is an admin making the request
        //checks the lecturer info or all lecturers info depending on if a matric number was given
        jwt.verify(auth, jwt_key,(err,payload)=>{
            if(payload){
                let user_id = payload.user_id;
                query.read("role","users","id",user_id,(results,err)=>{
                    if(results[0].role === 3){
                        if(staff_no){
                            query.getLecturer(staff_no.toUpperCase(),(results,err)=>{
                                if(results.length > 0){
                                    response.status = "ok";
                                    response.statusCode = 200;
                                    response.data = {
                                        name : results[0].name,
                                        email: results[0].email,
                                        department: results[0].department,
                                        staff_number: results[0].staff_number
                                    }

                                    res.send(response); 
                                }
                                else{
                                    response.status = "error";
                                    response.statusCode = 404;
                                    response.error = {
                                        message: "lecturer not found",
                                    } 
            
                                    res.send(response); 
                                }
                            })
                        }
                        else{
                            query.getAllLecturers((results,err)=>{
                                response.status = "ok";
                                response.statusCode = 200;
                                response.data = {
                                    no_of_lecturers: results.length,
                                    lecturers_data: results
                                }
                                res.send(response);  
                            })
                        }
                    }
                    else{
                        response.status = "error";
                        response.statusCode = 401;
                        response.error = {
                            message: "auth error",
                        } 

                        res.send(response);
                    }
                })
            }
        })
    }
}

module.exports = admin;