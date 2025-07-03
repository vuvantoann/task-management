const express = require('express')
const router = express.Router()

const controller = require('../controllers/task.controller')

router.get('/', controller.task)

module.exports = router
