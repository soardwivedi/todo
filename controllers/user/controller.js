import models from '../../models/index.js';
import * as bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { where } from 'sequelize';

const userModel = models.user;

const addUser = async (request, response) => {
  const data = request.body;
  try {
    const user = await userModel.create({
      name: data.name,
      email: data.email,
      password: data.password
    });
    response.send({
      success: true,
      message: 'User created successfully.'
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return response.status(200).send({
        success: false,
        message: `There is already an user exists with email ${data.email}`
      });
    }
    response.status(400).send({
      success: false,
      message: 'Something went wrong while saving user.'
    });
  }
};

const userLogin = async (req, res) => {
  const loginData = req.body;
  try {
    const user = await userModel.findOne({
      where: { email: loginData.email }
    });
    if (!user) {
      return res.status(400).send({
        message: `User with email ${loginData.email} has not found.`
      });
    }
    const isValidPassword = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).send({
        message: `Either email or password is incorrect.`
      });
    }

    const access_token = JWT.sign(
      {
        id: user.id,
        email: user.email
      },
      'saltkey',
      { expiresIn: '1h' }
    );

    const refresh_token = JWT.sign(
      {
        id: user.id,
        email: user.email
      },
      'saltkey',
      { expiresIn: '1d' }
    );
    await userModel.update(
      {
        refresh_token,
        access_token
      },
      { where: { id: user.id } }
    );
    res.send({
      message: 'Your login data is correct.',
      access_token,
      refresh_token
    });
    //console.log(access_token, 'access_token');
  } catch (error) {
    res.status(500).send({
      message: 'An error occured while login.'
    });
  }
};

const updatePassword = async (req, res) => {
  const inputData = req.body;
  const user = req.user;

  try {
    const userU = await userModel.findOne({
      where: { email: inputData.email }
    });
    if (!userU) {
      return res.status(400).send({
        message: `User with email has not found.`
      });
    }

    const passs = bcrypt.compare(inputData.oldPassword, userU.password);
    if (!passs)
      return res.send({
        message: 'Entered old password is wrong.'
      });

    // userModel.update(
    //   {
    //     password: inputData.newPassword
    //   },
    //   { where: { id: user.id } }
    // );
    user.password = inputData.newPassword;
    await user.save();
    res.send({
      message: 'Password updated successfully.'
    });
  } catch (error) {
    console.log(error, 'There is an error while updating password.');
  }
};

const userRefresLogin = async (req, res) => {
  const inputData = req.body;
  // Verify token;
  let payload;
  JWT.verify(inputData.refresh_token, 'saltkey', (error, data) => {
    // If any error on verifying token then return
    if (error) return;
    // If no error on verifying token then update payload variable with data(token payload)
    payload = data;
  });
  // If payload is undefind then throw error
  if (!payload) {
    return res.status(400).send({
      message: 'The given authorization token is invalid.'
    });
  }
  const user = await userModel.findOne({
    where: { email: payload.email, id: payload.id }
  });
  if (!user) {
    return res.send({
      message: `user not found with ${payload.email} "and id" ${payload.id}`
    });
  }
  //why we are genrating below new_access_token.
  const new_access_token = JWT.sign(
    {
      id: user.id,
      email: user.email
    },
    'saltkey',
    { expiresIn: '1d' }
  );
  await userModel.update(
    {
      access_token: new_access_token
    },
    { where: { id: user.id } }
  );
  res.send({
    message: 'New access token upadated in DB generated.',
    new_access_token
  });
};

const logoutUser = async (req, res) => {
  try {
    await userModel.update(
      {
        access_token: null
      },
      {
        where: { id: req.user.id }
      }
    );
    res.send({
      message: ' You loged out successfully.'
    });
  } catch (error) {}
};

// const updateTodo = async (req, res) => {
//   try {
//     const updateData = req.body;
//     const id = req.params.id;
//     //console.log(updateData);
//     const updateRow = await todoModel.update(
//       {
//         task: updateData.task,
//         status: updateData.status,
//         description: updateData.description,
//         email: updateData.email
//       },
//       { where: { id } }
//     );
//     //console.log((a = 4));
//     res.send({
//       message: 'todo updated successfully.'
//     });
//   } catch (error) {
//     console.log(error), 'errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr';
//   }
// };

// const orderBy = async (req, res) => {
//   try {
//     let limit = 0;
//     if (req.query.limit) {
//       limit = parseInt(req.query.limit);
//     }

//     const todos = await todoModel.findAll({
//       ///// order: [[orderBy, limit]],
//       ////// key: [column name, order (ASC, DSCE)]
//       limit: [limit]
//     });
//     res.send({
//       message: 'todo fetched successfully',
//       todos
//     });
//   } catch (error) {
//     console.log(
//       error,
//       'erroroooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
//     );
//   }
// };
// const deleteTodo = async (req, res) => {
//   try {
//     const deleteData = req.body;
//     const deleteTodoRow = await todoModel.destroy({
//       where: { id: deleteData.id }
//     });
//     res.send({
//       message: 'Todo row deleted successfully.'
//     });
//   } catch (error) {
//     console.log(
//       error,
//       'errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'
//     );
//   }
// };

export default {
  addUser,
  userLogin,
  logoutUser,
  userRefresLogin,
  updatePassword
};
