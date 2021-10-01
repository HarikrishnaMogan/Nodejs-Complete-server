
const {ObjectId} = require("mongodb");
const db = require("../shared/mongo");
const {postSchema} = require("../shared/schema");

const service = {
    //find post
    async findpost(req,res)
    {
        try{
            //to get the authorrized user posts only
            const data  =  await db.posts.find({userId:req.user.userId}).toArray();
            console.log(data);
            res.send(data);
        }
        catch(err)
        {
            console.log("get error",err);
            res.sendStatus(500);
        }
    },
    //create post
    async createpost(req,res)
    {
        try{
         //req body validation
         const {error,value} = await postSchema.validate(req.body);
         if(error)
         {
             return res.status(401).send({error:error.details[0].message});
         }

         //inserting posts
            console.log("posts post");
        const data = await db.posts.insertOne({...req.body, userId:req.user.userId});
        console.log(data);
        res.send({...req.body, _id:data.insertedId, userId:req.user.userId});//to get pass the id as response, we get that insertedid in data
        }
        catch(err)
        {
            console.log("post error",err);
            res.sendStatus(500);
        }
    },
   //update post
    async updatepost(req,res)
    {
        try{
              //req body validation
         const {error,value} = await postSchema.validate(req.body);
         if(error)
         {
             return res.status(401).send({error:error.details[0].message});
         }


            console.log("put post");
    
            console.log(req.params);
            //update post validation
            const post = await db.posts.findOne({_id:ObjectId(req.params.id) , userId:req.user.userId});
            if(!post)
            {
                return res.status(401).send({error:"you don't have access to this post"});
            }
             

            //to update post
            const data = await db.posts.findOneAndUpdate({_id:ObjectId(req.params.id)},
              {$set:{...req.body}},
              {returnDocument: "after"}//to return new document value
            );
            console.log(data);
            res.send(data.value);//in value we have req body

        }
        catch(err)
        {
            console.log("put error",err);
            res.sendStatus(500);
        }
    },

    //delete post
    async deletepost(req,res)
    {
        try{

            //delete post validation
            const post = await db.posts.findOne({_id:ObjectId(req.params.id) , userId:req.user.userId});
            if(!post)
            {
                return res.status(401).send({error:"you don't have access to this post"});
            }
             //delete post
            console.log("delete post");
            const data = await db.posts.deleteOne({_id:ObjectId(req.params.id)});
            console.log(data);
            res.end();
            }
            catch(err)
            {
                console.log("delete error",err);
                res.sendStatus(500);
            }
        
    }
}
module.exports = service;