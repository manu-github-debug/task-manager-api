const express=require('express')
const router=new express.Router()
const User=require('../models/users')
const auth=require('../middleware/Authentication')
const multer=require('multer')
const sendMail=require('../email/emailaccount')


const upload=multer({// this is multipart used for file uploading and for that we use multer

    limits:{
        fileSize:100000000
    },fileFilter(req,file,cb){// file filtering checking wheather a file is pdf or not

        if(!file.originalname.match('.jpg')){
            res.status(404).send({error:'Please upload only pdf'})
        }
        cb(undefined,true)

    }
})
// post process for uploading an user pic
router.post('/users/me/pic',auth,upload.single('upload'), async(req,res)=>{

    req.user.multipart=req.file.buffer// this is used for storing buffer data
    await req.user.save()// after uploading that we are just saving the image data that we uploaded
    res.status(200).send({message:'Successfully uploaded'})
})

// get process for rendering the stored image in the data base

router.get('/users/:id/pic', async(req,res)=>{
    
    try{
    const user=await User.findById(req.params.id)
    if(!user || !user.multipart){
        throw new Error('No data found')
    }
    res.set('Content-Type', 'image/jpg')
    res.send(user.multipart)
    }catch(e){
        res.status(404).send({error:error.message})
    }
})

//for post requests
router.post('/users', async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    try {
        await user.save()
        sendMail(user.email,user.name)// used for sending email
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})
//Routing for getting data by email and password

router.post('/users/login', async(req,res)=>{

    const user= await User.findByEmailAndPassword(req.body.email)
    const token= await user.generateAuthToken()
    try{
        res.status(200).send({user,token})
    }catch(e){
        res.status(404).send(e)
    }
})


//For get requests
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})
// getting model by id
router.get('/users/:id', (req, res) => {
    const _id = req.params.id// we need use this req.params for getting the string that we had given in the url
    User.findById(_id).then((user) => {
        if (!user) {
            res.status(401).send()
        }
        res.send(user)
    }).catch((error) => {
        res.status(404).send()
    })
})


// logging of the user

router.post('/users/logout', auth, async(req,res)=>{
    try{
    req.user.tokens=req.user.tokens.filter((token)=>{
        return token.token!=req.token
    })
    await user.save()
    res.send()
    }catch(e){
        res.status(404).send()
    }
})

//logging out the whole 
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


//update
router.patch('/users/:id', async (req, res) => {
    // checking 
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','age','email','password']

    const isValidUpdate=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidUpdate){// checking wheather it is a valid update or not
        return res.status(404).send()
    }

    const user= await User.findById(req.params.id)

    updates.forEach((update)=>{
        user[update]=req.body[update]
    })
    await user.save()
    //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    try {
        if (!user) {
            res.status(400).send()
        } else {
            res.status(200).send(user)
        }
    } catch (e) {
        res.status(400).send()
    }
})


//Delete By Id
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }else{
        res.send(user)
        }
    } catch (e) {
        res.status(500).send()
    }
})

//newly added code


// for updation
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})






module.exports=router