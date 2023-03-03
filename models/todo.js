'use strict';
import { DataTypes, Model } from 'sequelize';

const todo = (sequelize, DataTypes) => {
  class todo extends Model {
    static associate(models) {
      todo.belongsTo(models.user, {
        foreignKey: 'user_id'
      });
    }
  }

  todo.init(
    {
      task: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: DataTypes.STRING,
      desciption: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'todo',
      tableName: 'todos',
      createdAt: 'created_on',
      updatedAt: 'updated_on'
    }
  );
  return todo;
};

export default todo;
