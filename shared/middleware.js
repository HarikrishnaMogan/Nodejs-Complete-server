
const jwt = require("jsonwebtoken");

const middleware = {

    authToken(req,res,next)
    {
        const token = req.headers["auth-token"];
          console.log(token);
          if(token)
          {
              try{
                req.user = jwt.verify(token,process.env.JWT_SECRET);//this will give error if token fails that is why we use try,catch
                console.log(req.user);//if verified suceesfull it contains userid,email etc because we give that in creating token
                next();
              }
              catch(err)
              {
                  res.sendStatus(401);
              }
           
          }
          else{
              res.sendStatus(401);
          }
    },

    logging(req,res,next)
    {
        console.log("logging middleware");
        console.log(`${new Date()}-${req.user.userId}-${req.url}-${req.method}`);
        next();
    }
}
module.exports = middleware;