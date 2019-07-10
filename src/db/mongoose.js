const mongoose=require('mongoose')// this is acquired from npm library
const validator=require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
   
    useNewUrlParser:true,
    useCreateIndex:true

})

const user=mongoose.model('TASK_MASTER',{// creating a model for a table called USER_MASTER

    name:{

        type:String,
        required:true,
        trim:true,
        validate(value){

            if(value===null){
                throw new Error()
            }
        }

    },age:{

        type:Number,
        default:0,
        validate(value){
    
            if(value<0){
                throw new Error('Age Must be a positive number')
            }

        }

    },email:{

        type:String,
        required:true,
        trim:true,
        validate(value){
 
            if(!validator.isEmail(value)){

                throw new Error('Invalid Email Address')


            }

        }
    

    }


})

const user1=new user({// new user creation

    name:'Madhavi',
    age:31,
    email:'manojsai149@gmail.com'
})

// Here we are saving the user created by default
user1.save().then(()=>{// here then is a promise and promise is an enhanced version of callbacks
    console.log(user1)
}).catch((error)=>{

    console.log(error)
})