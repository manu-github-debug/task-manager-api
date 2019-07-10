const sendMail=require('@sendgrid/mail')
//const sendMailAccessKey='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'

//setting api key
sendMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMailForUser=(email,name)=>{
    sendMail.send({
        to: email,
        from: 'manojsai149@gmail.com',
        subject: 'Reg:User Creation',
        text: 'Welcome to the app,Please dont reply back to the mail'
    })
}


module.exports=sendMailForUser


