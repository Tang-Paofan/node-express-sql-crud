const express = require('express')
const app = express()

const userControllers = require('./controllers/userControllers')
app.use('/api/user', userControllers)

app.listen(5000, () => console.log(`尊贵的用户您的端口已启动====>5000`))