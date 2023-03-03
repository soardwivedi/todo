import { readdirSync } from 'fs';
import { basename, dirname } from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';

//here database = dbconfig. Note :- When we export something wwith default keword than we
//can import that rewuired file with any name by using import keword.

import database from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const db = {};

const sequelize = new Sequelize(database.development);

const filess = readdirSync(__dirname);

const files = filess.filter(
  (file) =>
    file.indexOf('.') !== 0 &&
    file !== basename(__filename) &&
    file.slice(-3) === '.js'
);

for (const file of files) {
  const model = await import(`./${file}`);
  const namedModel = model.default(sequelize, DataTypes);
  db[namedModel.name] = namedModel;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
