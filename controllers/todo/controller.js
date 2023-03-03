import models from '../../models/index.js';
const todoModel = models.todo;

const addTodo = async (request, response) => {
  try {
    const data = request.body;
    await todoModel.create({
      task: data.task,
      status: data.status,
      description: data.description,
      user_id: request.user.id
    });
    response.send({
      message: 'Todo created successfully.'
    });
  } catch (error) {
    console.log('error', error);
    response.status(500).send({
      message: 'Something went wrong while saving todo.'
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const updateData = req.body;
    const id = req.params.id;
    await todoModel.update(
      {
        task: updateData.task,
        status: updateData.status,
        description: updateData.description,
        email: updateData.email
      },
      { where: { id } }
    );

    res.send({
      message: 'todo updated successfully.'
    });
  } catch (error) {
    res.status(500).send({
      message: 'An error occured while updating todo.'
    });
  }
};

const orderBy = async (req, res) => {
  try {
    let limit = 0;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    const todos = await todoModel.findAll({
      // order: [[orderBy, limit]],
      // key: [column name, order (ASC, DSCE)]
      limit: [limit]
    });
    res.send({
      message: 'todo fetched successfully',
      todos
    });
  } catch (error) {
    res.status(500).send({
      message: 'An error occured while getting todo.'
    });
  }
};
const deleteTodo = async (req, res) => {
  try {
    const deleteData = req.body;
    const deleteTodoRow = await todoModel.destroy({
      where: { id: deleteData.id }
    });
    res.send({
      message: 'Todo row deleted successfully.'
    });
  } catch (error) {
    res.status(500).send({
      message: 'An error occured while deleting todo.'
    });
  }
};

export default { addTodo, updateTodo, orderBy, deleteTodo };
