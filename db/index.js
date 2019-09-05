const Sequelize = require("sequelize");
const sequelize = new Sequelize("MVAPIInterface", "APIUser", "poiuytrewq",
  {
    dialect: "mariadb",
    host: "localhost",
    port: 12345,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

sequelize.authenticate().then(
  () => { console.log("succesfully connected.")},
  () => { console.log("failed to connect.")}
)

let db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Endpoint = require("../models/endpoint.model")(db);


sequelize.sync();

module.exports = db;