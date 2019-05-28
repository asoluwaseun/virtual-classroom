const mysql = require('mysql');

const connection = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'virtual_classroom',
	connectionLimit: 100
});

module.exports = connection;