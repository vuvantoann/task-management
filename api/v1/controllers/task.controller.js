const Task = require('../models/task.model')
//[GET]/api/v1/tasks
module.exports.task = async (req, res) => {
  let find = {
    deleted: false,
  }

  //Bộ lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status
  }
  //Sắp xếp theo tiêu chí
  let sort = {}

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  }
  console.log(req.query)
  const tasks = await Task.find(find).sort(sort)

  res.json(tasks)
}
