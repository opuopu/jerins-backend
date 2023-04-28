const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
// const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 500 
const cors = require('cors')
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgoei.mongodb.net/?retryWrites=true&w=majority`;   

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{

const Database = client.db('jerins')
const servicesCollection = Database.collection('services')
const userCollection = Database.collection('users')
const userservicecollection = Database.collection('userservice')


// get services
app.get('/services',async(req,res)=>{
    const result = await servicesCollection.find({}).toArray()
    res.send(result)
})


// get user 
app.get('/users',async(req,res)=>{
    const result = await userCollection.find({}).toArray()
    res.send(result)
})

app.post('/adduser',async(req,res)=>{
    const email = req.body
    const users = await userCollection.find(email)
    if(users){
        return res.status(403).send('user already exist')
    }
    const result = await userCollection.insertOne(email)
    res.send(result)
})



// post service 

app.post('/postservice',async(req,res)=>{
    const result  = await userservicecollection.insertOne(req.body)
    res.send(result)
})
// get service 
app.get('/getuserservice',async(req,res)=>{
    const email = req.query.email
    console.log(email)
    const result = await userservicecollection.find({email:email}).toArray()
    res.send(result)
})

// see admin 
app.get('/admin',async(req,res)=>{
    const email = req.query.email 
    const result  = await userCollection.findOne({email:email})
    if(result?.adminStatus==='true'){
        res.send({isAdmin:true})
    }
//    else{
//     res.send({isAdmin:false})
//    }
    
})

// put admin 
app.put('/makeadmin',async(req,res)=>{
    const email = req.body
    const filter = email;

    const users = await userCollection.findOne(email)
    const options = { upsert: true };
    if(users){
    const updateDoc = {
        $set:{
           adminStatus:'true'
        }
    }
   const result  = await userCollection.updateOne(filter,updateDoc,options)
   res.send({result,message:'successfull'})
    }
    else{
        res.send({message:'user not found'})
    }
})


    }
    catch{

    }
}


run().catch(console.dir())










app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })