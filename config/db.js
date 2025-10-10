const { Sequelize } = require("sequelize");

const DB_CREDENTIAL = process.env
// MySQL connection
const sequelize = new Sequelize(DB_CREDENTIAL.DATABASE, DB_CREDENTIAL.DB_USER, DB_CREDENTIAL.DB_PASSWD, {
  host: DB_CREDENTIAL.HOST,
  dialect: "mysql",
  logging: false, // SQL queries ko console mein print na kare
});



module.exports = sequelize;
