const express = require('express')

var cors = require('cors')
const server = express()
const routes = require('./routes')


server.use(express.json())
server.use(cors())


server.use(routes)



server.listen(3000)


