// index.js
const express = require('express')
const database = require('./config/database')
require('dotenv').config()
const app = express()

const Task = require('./models/task.model')

port = process.env.PORT
database.connect()

app.get('/', async (req, res) => {
  const tasks = await Task.find({
    deleted: false,
  })

  res.json(tasks)
})

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`)
})
