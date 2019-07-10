const mongoose=require('mongoose')
const validator=require('validator')

const taskSchema=new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,// this is the foriegn key of the task table
        required: true,
        ref: 'User'// this is the user table 
    }
},{
    timestamps:true // this column will be declared like this
})

const Task=mongoose.model('TASK_MASTER',taskSchema)


module.exports=Task
