const express = require('express')
require('./db/mongooseMain')
const User = require('./models/users')
const Task = require('./models/tasks')
const userRouter=require('./routers/users')// bringing that route file in to index.js
const taskRouter=require('./routers/tasks')
const bcrypt=require('bcryptjs')
const app = express()// getting all express properties in to app
const port = process.env.PORT// this is the port 
const jwt = require('jsonwebtoken')
app.use(express.json())// this line says that we need to make use of json only
app.use(userRouter)// telling express to use this routing 
app.use(taskRouter)

// for default
app.get('',(req,res)=>{

    res.status(200).send({message:'Welcome to node api....created by sai manoj'})
})

// this is the port where it runs
app.listen(port, () => {
    console.log('Server is up on ' + port)
})


