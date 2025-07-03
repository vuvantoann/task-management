const Task = require('../models/task.model')
//[GET]/api/v1/tasks
module.exports.task = async (req, res) => {
  let find = {
    deleted: false,
  }
  if (req.query.status) {
    find.status = req.query.status
  }
  const tasks = await Task.find(find)

  res.json(tasks)
}
