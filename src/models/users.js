const mongoose=require('mongoose')
const validator=require('validator')// used for data validation
const bcryptjs=require('bcryptjs')//used for hashing
const jwt=require('jsonwebtoken')// this is used for generating authentication tokens
const userSchema=new mongoose.Schema({

    name:{

        required:true,
        type:String,
        trim:true
        
    },age:{

        required:true,
        type:Number,
        trim:true

    },email:{

        required:true,
        type:String,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){

                throw new Error('This is not valid Email Address')
            }
        }
    },password:{

        required:true,
        type:String,
        trim:true,
    },tokens:[{
        token:{
            type:String
        }
    }],multipart:{// 
        type:Buffer
    }
},{
    timestamps:true// this is used for creation of data
})// this helps in supporting the middle ware express

// telling the scheme that local field is id and foriegn key is user_id
userSchema.virtual('tasks', {// creates a virtual type
    ref: 'Task',
    localField: '_id',
    foreignField: 'user_id'
})

userSchema.methods.generateAuthToken= async function(){

    console.log('In to authentication')
    const user=this
    console.log('user id is '+user.id)
    const token=jwt.sign({ _id:user._id.toString() },'Ammananna')// generating jwt and signing in with a name
    console.log('Token is '+token)
    user.tokens=user.tokens.concat({token})// storing this for reference in database
    console.log('This is from gen '+user.tokens)
    await user.save()
    return token

}
// this is used for hiding the private data
userSchema.methods.toJSON = function () {     // here toJson is used for manipulation
    const user = this     
    const userObject = user.toObject() // this returns the rawdata of user object
 
    delete userObject.password     // this helps in hiding the data so that it will not be visible to the user
    delete userObject.tokens 
 
    return userObject 
}


// Creating a native method for email and password
userSchema.statics.findByEmailAndPassword= async ({email})=>{

    const user= await Users.findOne({email})
    if(!user){// if no user was found then we will throw an error
        throw new Error('Email not found')
    }
  return user
}


// telling middle ware to hash the password before saving
userSchema.pre('save',async function(next){

    const user=this
    if(user.isModified('password')){

        console.log('In to if-condition')
        user.password=await bcryptjs.hash(user.password,8)
    }
    next()
})

// used for removing

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ user_id: user._id })
    next()
})


const Users=mongoose.model('USER_MASTER',userSchema)// Final step

module.exports=Users