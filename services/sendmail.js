const nodemailer = require("nodemailer");

let sendmail = async(recivermail,id)=>{

    try{
    console.log(recivermail);
    //created transporter for sending email
    let transporter = await nodemailer.createTransport({
        service:"hotmail",
        auth:{
            user:"testserver437@outlook.com",
            pass:"testsrver437"
        }
    })

    let options ={
        from:"testserver437@outlook.com",
        to:recivermail,
        subject:"Regarding Verification",
        text:"Kindly paste the below link in postman app and call get method",
        html:`<p>Kindly paste the below link in postman app and call get method</p>
        <a>localhost:3001/users/verify/${id}</a>`
    }

    //send mail
    let info = await transporter.sendMail({...options});
}
catch(err)
{
    console.log("emailsend error",err);
}
}

module.exports = sendmail;