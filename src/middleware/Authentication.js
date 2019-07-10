const jwt=require('jsonwebtoken')
const User=require('../models/users')

const auth= async(req,res,next)=>{

    try{
    const token=req.header('Authorization').replace('Bearer ','')
    console.log('This is from authentication file '+token)
    const decoded=jwt.verify(token,'Ammananna')// decoded token it contains _id and token
    console.log('This is the decoded token '+decoded._id)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })// we will get this user by ID
    console.log('Finally the user is '+user)

    if(!user){
        throw new Error('Invalid authentication')
    }
    req.user=user
    req.token=token
    next()// here this works/acts as a continue
  }catch(e){
    res.status(401).send({error:'Please authenticate'})
}
}

module.exports=auth