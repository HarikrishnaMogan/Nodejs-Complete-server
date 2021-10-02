const db = require("../shared/mongo");
const bcrypt = require("bcrypt");//npm install bcrypt
const jwt = require("jsonwebtoken");//npm install jsonwebtoken
const {registerSchema,loginSchema} = require("../shared/schema");
const { ObjectId } = require("mongodb");
const sendemail = require("./sendmail");

const service ={

    async register(req,res)
    {
       try{
           //req body validation or form validation
           //joi gives two things error and value , value contains req.body
           const {error,value} = await registerSchema.validate(req.body);
           if(error)
           {
               return res.status(401).send({error:error.details[0].message});
              // from error, it is a array with single object,it contains message property, if you have doubt console and see error
           }
           
           //check user exists
          const user =  await db.users.findOne({email:req.body.email}) //or value.email can be used
          if(user)
          {
              return res.status(400).send({error:"user already exists"});
          }
          
          //use bcrypt to encrypt password and insert it in database for security purpose
          //genSalt(10) represents it will encrypt 10 times
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password,salt);
          console.log(req.body.password);
           

          //email verification
          req.body.isVerified = false;
          
         

          //insert user
          let {insertedId} = await db.users.insertOne(req.body);

           //send verify link to user via email
            sendemail(req.body.email,insertedId);

          res.send("user registered sucessfully");
       }
       catch(err)
       {
           console.log("error registering user",err);
           res.sendStatus(500);
       }
    },
    async login(req,res)
    {
        try{
             //req body validation
             const {error,value} = await loginSchema.validate(req.body);
             if(error)
             {
                 return res.status(401).send({error:error.details[0].message})
             }


            //check user exists during login
             const user = await db.users.findOne({email:req.body.email});
             if(!user)
             {
                 return res.status(401).send({error:"user doesn't exists"});
             }
              
             //check password of user is correct or not
             const isValid = await bcrypt.compare(req.body.password,user.password);
             console.log(isValid);
             if(!isValid)
             {
                 return res.status(403).send({error:"Email or password is wrong"});
             }
             
             //check email/user verified or not
             if(!user.isVerified)
             {
                 return res.status(401).send({error:"Email is not Verified"});
             }

             //creating auth-token for user to access posts 
             const authToken =  jwt.sign(
                 {userId:user._id, email:user.email},
                 process.env.JWT_SECRET,//"naruto437"
                 {expiresIn:"8h"}//token is valid upto 8h
                 );
             console.log(authToken);

             res.send({authToken});

        }
        catch(err)
        {
            console.log("error login user",err);
            res.sendStatus(500);
        }
    },

    async verifyUser(req,res)
    {
    try{
            //check user exists
            const user = await db.users.findOne({_id:ObjectId(req.params.id)});
            if(!user)
            {
               return res.status(401).send({error:"user dosent exists"});
            }

            //update Isverified to true in database to verify user
            await db.users.updateOne(
                {_id:ObjectId(req.params.id)},
                {$set:{isVerified:true}}
            );
            
            res.send({message:"Eamail verified successfully"})
           
        }
        catch(err)
        {
            console.log("error verifying user",err);
            res.sendStatus(500);
        }
        
    }

}
module.exports = service;