'use strict';
const {
  Model,
  Validator
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, username, firstName, lastName, email } = this;
      return { id, username, firstName, lastName, email };
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    getCurrentUserById(id) {
      return User.scope('currentUser').findByPk(id);
    }

    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ username, email, firstName, lastName, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      try {
        const user = await User.create({
          username,
          firstName,
          lastName,
          email,
          hashedPassword
        });
        return await User.scope('currentUser').findByPk(user.id);
      } catch (e) {
        if (e.fields.email || e.fields.username) {
          const err = new Error('User already exists');
          err.status = 403;
          if (e.fields.email) {
            err.errors = { email: 'User with that email already exists' };
          }

          if (e.fields.username) {
            err.errors.username = 'User with that username already exists';
          }

          throw err;
        }
        else throw e;
      }

    }


    static associate(models) {
      User.hasMany(models.Group, {
        foreignKey: 'organizerId'
      });

      User.belongsToMany(models.Event, {
        through: models.Attendance,
        foreignKey: 'userId'
      });

      User.belongsToMany(models.Group, {
        through: models.Membership,
        foreignKey: 'userId'
      });
    }
  };

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ['hashedPassword'] }
      },
      loginUser: {
        attributes: {}
      }
    }
  });
  return User;
};
