const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}

  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull:false,
      unique: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull:false,
      unique: false,
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull:false,
      isEmail: true,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull:false,
      unique: false,
    }
  }, {sequelize});

  User.associate = models => {
     User.hasMany(models.Course, {
       foreignKey: "userId",
       allowNull:false
     })
  }

  return User
}