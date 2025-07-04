const express = require('express')
const router = express.Router()

const controller = require('../controllers/task.controller')

router.get('/', controller.task)

router.patch('/change-status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.post('/create', controller.create)

router.patch('/edit/:id', controller.edit)

router.delete('/delete/:id', controller.delete)

module.exports = router
