/**
 * 
 * @description: Sequelize model for User
 * 
 */

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}

  // firstName and lastName require letters only validated via Regex
  // emailAddress requires a unique value and also requires an valid email (e.g. user@domain.com)
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull:false,
      validate: {
        is: /^[a-z]+$/i,
      },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull:false,
      validate: {
        is: /^[a-z]+$/i,
      },
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull:false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull:false,
    }
  }, {sequelize});

  // User may be associated with many courses
  User.associate = models => {
     User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        allowNull:false
      }
     })
  }

  return User
}