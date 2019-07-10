const mongoose=require('mongoose')// this is the mongoose we get from npm library

mongoose.connect(process.env.MONGODB_URL,{//connecting to the database

    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false

})


