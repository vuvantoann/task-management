// index.js
const express = require('express')
const database = require('./config/database')
require('dotenv').config()
const app = express()
const route = require('./api/v1/routes/index.route')
port = process.env.PORT
database.connect()

route(app)

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`)
})
