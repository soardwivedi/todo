'use strict';
import { DataTypes, Model } from 'sequelize';
import * as bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {}
  }

  user.init(
    {
      name: {
        type: DataTypes.UUID,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      access_token: {
        type: DataTypes.STRING
      },
      refresh_token: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'users',
      createdAt: 'created_on',
      updatedAt: 'updated_on'
    }
  );

  user.beforeSave(async (user, options) => {
    try {
      console.log(user, 'uuuuuuuuuuuuuuuuuuuuuuuuuuu');
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    } catch (error) {
      console.log('Password could not be encrypted.');
    }
  });

  // user.beforeUpdate(async (user, options) => {
  //   try {
  //     console.log(user, 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');

  //     const hashedUpdatedPassword = await bcrypt.hash(user.password, 10);
  //     user.password = hashedUpdatedPassword;
  //   } catch (error) {
  //     console.log('Password could not be encrypted.');
  //   }
  // });

  return user;
};
export default user;
