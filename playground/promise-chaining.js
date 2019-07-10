require('../src/db/mongooseMain')// getting mongoose db connectivity
const User=require('../src/models/users')// getting user model in to this file

// this is the regular way of updating a record by nested promises
User.findByIdAndUpdate('5d22e46da4963a262433d32c',{age:15,name:'Manoj'}).then((user)=>{// this takes 2 inputs one is id and another one is the thing that we want to change
    console.log(user)
    return User.countDocuments({age:15,name:'Manoj'})// this returns the no.of documents count and based on that it makes of then and other functionalities

}).then((result)=>{// 2nd promise
    console.log(result)
}).catch((e)=>{
    console.log(e) 
})



// this method is the new way of updating a record by using 'Async/Await'



const UpdateUserById= async(id,age)=>{// this is an async function

    const update=await User.findByIdAndUpdate(id,{ age })// here we are using es6 destructuring
    const count=await User.countDocuments({age})// counting the no.of records from this
    return count

}

UpdateUserById('5d22e99f58fce2388c4bc9db',2).then((result)=>{
    console.log(result)

}).catch((e)=>{

    console.log(e)

})


