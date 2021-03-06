const mysql = require('mysql');

const connection = mysql.createPool({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USERNAME,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_NAME,
	connectionLimit: 100
});

module.exports = connection;