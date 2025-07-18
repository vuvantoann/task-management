const Task = require('../models/task.model')

const paginationHelper = require('../../../helper/pagination')
const searchHelper = require('../../../helper/search')
//[GET]/api/v1/tasks
module.exports.task = async (req, res) => {
  let find = {
    $or: [{ createdBy: req.user.id }, { listUser: { $in: [req.user.id] } }],
    deleted: false,
  }
  // Tìm kiếm
  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
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

//[PATCH]/api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id
    const status = req.body.status

    await Task.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    )

    res.json({
      code: 200,
      message: 'Cập nhật trạng thái thành công',
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Cập nhật trạng thái thất bại',
    })
  }
}

//[PATCH]/api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const ids = req.body.ids
    const key = req.body.key
    const value = req.body.value

    switch (key) {
      case 'status':
        await Task.updateMany({ _id: { $in: ids } }, { [key]: value })
        res.json({
          code: 200,
          message: 'Cập nhật trạng thái thành công',
        })
        break
      case 'delete':
        await Task.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        )
        res.json({
          code: 200,
          message: 'xóa tất cả thành công',
        })
        break
      default:
        res.json({
          code: 400,
          message: 'Không tồn tại',
        })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Cập nhật trạng thái thất bại',
    })
  }
}

//[POST]/api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user._id
    const newTask = new Task(req.body)
    const data = await newTask.save()
    res.json({
      code: 200,
      message: 'tạo sản phẩm thành công',
      data: data,
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'lỗi',
    })
  }
}

//[PATCH]/api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    console.log(id)
    await Task.updateOne({ _id: id }, req.body)
    res.json({
      code: 200,
      message: 'chỉnh sửa sản phẩm thành công',
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'lỗi',
    })
  }
}

//[delete]/api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    await Task.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    )
    res.json({
      code: 200,
      message: 'xóa thành công',
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'lỗi',
    })
  }
}
