const express = require('express');
const {MongoClient, ServerApiVersion} = require('mongodb');
const cors =require('cors');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = 5000;

// middleWare

app.use(cors());
app.use(express.json());

app.get('/',(req, res)=>{
    res.send('Server ok')
})
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r5j5a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

console.log(uri);
const run = async() =>{
    try{
        const servicesCollection = client.db("carMechanic").collection("services");
        await client.connect();
        // console.log("Connected successfully to server");
 

        // GET Method

        app.get("/services",async(req,res)=>{
            const dataFromDB = servicesCollection.find({});
           await dataFromDB.toArray()
            .then(result=>{
                console.log('data Successfully come from DB')
                res.send(result)
            })
            .catch(err=>{
                console.log(err.message)
            })
        })

        //GET Method using dynamic id

        app.get("/service/:id",async(req,res)=>{
            const id = req.params.id;
            // console.log(id)
            const query = {_id: ObjectID(id)}
            await servicesCollection.findOne(query)
            .then(result=>{
                console.log('data come successfully.');
                res.send(result)
            })
        })



        //POST Method

        app.post("/service",async(req,res)=>{  
            const service  = req.body;
            // console.log(service)
            await servicesCollection.insertOne(service)
            .then(result=>{
                console.log(`A document was inserted with the _id: ${result.insertedId}`);
                res.json(result)
            })
            .catch(err=>{
                console.log(err.message)
            })
        })

        // Delete Method

        app.delete("/services/:id", async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectID(id)}
            await servicesCollection.deleteOne(query)
            .then(result=>{
                console.log('Service deleted', result);
                res.json(result)
            })
            console.log(id)
            
        })

    }catch(err){
        console.log('Error-----',err.message);
    }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`You app listening on port ${port}`)
})
