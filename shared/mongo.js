
//another way of using mongoclient
/*const mongo = require("mongodb");
const mongoclient = mongo.MongoClient;*/


const {MongoClient} = require("mongodb");

//const MONGO_URL = "mongodb://localhost:27017"; //(for local mongodb)
//const MONGO_URL = "mongodb+srv://hari437:harinaruto437@cluster0.v6pfi.mongodb.net/guvi_posts?retryWrites=true&w=majority";
//const DB_NAME = "guvi_posts";
const URI = process.env.MONGO_URL;
const client = new MongoClient(URI);

module.exports={
    //to store database
    db:null,
    
    //to store collections
    posts:null,
    users:null,

    async connect() 
    {  
       
             //connectig databases
        await client.connect();
        console.log("connected database");
        
        //setting database as test_posts
        this.db = client.db(process.env.DB_NAME);
        console.log("got database",process.env.DB_NAME);
       
        this.posts = this.db.collection("posts");
        this.users= this.db.collection("users");
    }
}
