const cors = require("cors");
require('dotenv').config() //always use dotenv at abovr express then only it wont give errors

//or
//const { config } = require("dotenv");//.env environment setup
//config();//.env intialization
const express = require("express");
const postRoute = require("./Routes/postsRoutes");
const usersRoute = require("./Routes/usersRoute");
const mongo = require("./shared/mongo");
const middleware = require("./shared/middleware");



const app = express();
//const port = 3001;

//async function to first  connect database then only start server
(async ()=>{
    try{
        await mongo.connect();

        

         //middleware to allow access apis
         app.use(cors());//this will allow all orgins or everyone to access our api

         //app.use(cors({origin:"guvi.netlify.com"}));//this will only allow guvi.netlify.com
         //app.use(cors({origin:["guvi.netlify.com","hari.netlify.com"]})) //this syntax is used to allow multiple websites to access api

        //to parse req body to json
        app.use(express.json());

       

        
        app.use("/users",usersRoute);
        
        //auth-token middle ware
       app.use(middleware.authToken)

       //loggig middleware
       app.use(middleware.logging);

        //different routes heads
        app.use("/posts",postRoute);
     
       
        
        app.listen(process.env.PORT || 8080,()=>{console.log(`starting server at ${process.env.PORT}`);})
        
    }
    catch(err)
    {
        console.log("error connecting database"+err);
    }
    
})();
