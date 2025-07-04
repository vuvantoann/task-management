const Task = require('../models/task.model')

const paginationHelper = require('../../../helper/pagination')
//[GET]/api/v1/tasks
module.exports.task = async (req, res) => {
  let find = {
    deleted: false,
  }

  //Bộ lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status
  }

  // phân trang
  const countTasks = await Task.countDocuments(find)
  let objectPagination = paginationHelper(
    {
      limitItem: 4,
      currentPage: 1,
    },
    req.query,
    countTasks
  )
  console.log(objectPagination)
  //Sắp xếp theo tiêu chí
  let sort = {}

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  }

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)

  res.json(tasks)
}
