module.exports = (db) => {
  let Endpoint = db.sequelize.define("endpoint", {
    id: {
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: db.Sequelize.STRING
    },
    post: {
      type: db.Sequelize.BOOLEAN,
      defaultValue: false
    },
    put: {
      type: db.Sequelize.BOOLEAN,
      defaultValue: false
    },
    delete: {
      type: db.Sequelize.BOOLEAN,
      defaultValue: false
    },
    get: {
      type: db.Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Endpoint;
}