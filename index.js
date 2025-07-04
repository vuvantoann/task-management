// index.js
const express = require('express')
const database = require('./config/database')
require('dotenv').config()
const app = express()
const routeApiVer1 = require('./api/v1/routes/index.route')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var cors = require('cors')
port = process.env.PORT
database.connect()

app.use(cors())
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser())

routeApiVer1(app)

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`)
})
