/**
 * 
 * @description: Sequelize model for Course
 * 
 */

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}

  // description, estimatedTime, and materialsNeeded all require alphanumeric characters
  // By default all Sequelize.STRING attributes are limited to 255 characters whereas Sequelize.TEXT is not limited
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull:false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull:false,
      validate: {
        is: /[A-z,?!.0-9\s]/g,
      },
    },
    estimatedTime: {
      type: Sequelize.STRING,
      validate: {
        is: /[A-z,?!.0-9\s]/g,
      },
    },
    materialsNeeded: {
      type: Sequelize.STRING,
      validate: {
        is: /[A-z,?!.0-9\s]/g,
      },
    }
  }, {sequelize});

  // Each course model only has 1 user associated with the course (as )
  Course.associate = models => {
     Course.belongsTo(models.User, {
       foreignKey: {
         fieldName: "userId",
        allowNull:false
       }
     })
  }

  return Course
}