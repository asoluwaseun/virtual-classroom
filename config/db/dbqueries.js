//dbconnection
const connection = require('../../config/db/dbconn');

const query = {
	create : (table, schema,results)=>{
		connection.query(`INSERT INTO ${table} SET ?`,  schema,(error,result,fields)=>{
			if(error == null){
				return results(result);
			}
			return results([]);
		})
	},

	read : (col, table, finder, identifier,results)=>{
		
		let sql = `SELECT ${col} FROM ${table} WHERE ${finder} = ${connection.escape(identifier)}`; 
		connection.query(sql,(error,result,fields)=>{	
			if(error == null){
					return results(result);
				}
				return results([]);
			})

	},

	update : (table, col, item, finder, identifier, results,err)=>{

		let sql = `UPDATE ${table} SET ${col} = ${connection.escape(item)} WHERE ${finder} = '${identifier}'`;
		connection.query(sql,(error,result,fields)=>{
	
			if(error == null && result){
				return results(result)
			}
			return results([]);
		})
	},

	delete: ()=>{

	},

	getStudent: (matric,results,err)=>{
		connection.query(`SELECT users.name, users.email,students.matric, students.level, students.department 
		FROM students
		LEFT JOIN users ON students.user_id = users.id WHERE students.matric = ? `,[matric],(error,result)=>{
			console.log(error)
			console.log(matric)
			if(error == null){
				return results(result);
			}
			return results([]);
		})
	},

	getAllStudents: (results,err)=>{
		connection.query(`SELECT users.name, users.email,students.matric, students.level, students.department 
		FROM students
		LEFT JOIN users ON students.user_id = users.id`,(error,result)=>{
			if(error == null){
				return results(result);
			}
			return results([]);
		})
	},

	getLecturer: (staff_no,results,err)=>{
			connection.query(`SELECT users.name, users.email, lecturers.staff_number, lecturers.department
			FROM lecturers
			LEFT JOIN users ON lecturers.user_id = users.id WHERE lecturers.staff_number = ? `,[staff_no],(error,result)=>{
			if(error == null){
				return results(result);
			}
			return results([]);
		})
	},

	getAllLecturers: (results,err)=>{
		connection.query(`SELECT users.name, users.email, lecturers.staff_number, lecturers.department
		FROM lecturers
		LEFT JOIN users ON lecturers.user_id = users.id WHERE lecturers.staff_no`,(error,result)=>{
			if(error == null){
				return results(result);
			}
			return results([]);
		})
	}

};

module.exports = query;