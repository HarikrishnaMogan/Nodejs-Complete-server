const db = require("../shared/mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {registerSchema,loginSchema} = require("../shared/schema");
const { ObjectId } = require("mongodb");

const service ={

    async register(req,res)
    {
       try{
           //req body validation or form validation
           const {error,value} = await registerSchema.validate(req.body);
           if(error)
           {
               return res.status(401).send({error:error.details[0].message});
           }
           
           //check user exists
          const user =  await db.users.findOne({email:req.body.email}) //or value.email can be used
          if(user)
          {
              return res.status(400).send({error:"user already exists"});
          }
          
          //use bcrypt to encrypt password and insert it in database for security purpose
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password,salt);
          console.log(req.body.password);
           

          //email verification
          req.body.isVerified = false;

          //insert user
          await db.users.insertOne(req.body);
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
             
             //creating auth-token for user to access posts 
             const authToken =  jwt.sign({userId:user._id, email:user.email},process.env.JWT_SECRET);//"naruto437"
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

            //update Isverified to true in database
           /* await db.users.updateOne(
                {_id:ObjectId()}
                
                )*/

        }
        catch(err)
        {
            console.log("error verifying user",err);
            res.sendStatus(500);
        }
        
    }

}
module.exports = service;