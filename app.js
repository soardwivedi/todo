import express from 'express';
const app = express();
const port = 3001;
import Yup from 'yup';
import bodyParser from 'body-parser';
import controllers from './controllers/index.js';
import { validate } from 'express-yup';
import { todoAddSchema } from './controllers/todo/validation.js';
import {
  userAddSchema,
  userLoginSchema,
  userPasswordUpdateSchema,
  userRfreshShema
} from './controllers/user/validation.js';
import models from './models/index.js';
import auth from './middlewares/auth.js';

// Middleware: For hadling yup validation error
app.use((error, req, res, next) => {
  if (error instanceof Yup.ValidationError) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
});

// Syncronizing models with database tables
app.use(bodyParser.json());

// models.sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log(`Database connected and syncronized successfully!`);
//   })
//   .catch((error) => {
//     console.log('Error while syncronizing models.', error);
//   });

app.post('/', (req, res) => {
  res.send('successful connection.');
});

app.post('/mail-us', (req, res) => {
  res.send({
    mail_to: 'soarvivekdwivedi@gmail.com'
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.post('/todo', auth, validate(todoAddSchema), controllers.todo.addTodo);

app.put(
  '/todo/:id',
  auth,
  validate(todoAddSchema),
  controllers.todo.updateTodo
);

app.get('/todo', auth, controllers.todo.orderBy);
app.delete('/deleteTodo', auth, controllers.todo.deleteTodo);

app.post('/user', validate(userAddSchema), controllers.user.addUser);

app.post('/user/login', validate(userLoginSchema), controllers.user.userLogin);
app.post('/user/logout', auth, controllers.user.logoutUser);
app.post(
  '/user/refresh_token',
  validate(userRfreshShema),
  controllers.user.userRefresLogin
);
app.post(
  '/user/updatePassword',
  auth,
  validate(userPasswordUpdateSchema),
  controllers.user.updatePassword
);
// Middleware: For hadling yup validation error
app.use((error, req, res, next) => {
  if (error instanceof Yup.ValidationError) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

// Assignment- Node JS

// 1. Create a login api with auth.

// 2. Create a registration api (first name, last name, email, password, mobile no, address)

//  (Please use hash and salt for password)

// 3. List api for all users with token and pagination

// 4. Update user details api with token

// 5. Search api on (first name, last name, email, mobile no) single key with token and pagination
