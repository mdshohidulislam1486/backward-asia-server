const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { json } = require('express');
const cors = require('cors')
const app = express()

app.use(express.json())
const port = process.env.PORT || 5000;
app.use(cors());



require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pp3lw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('tourPackages')
        const packagesCollection = database.collection('packages');
        const bookingCollection = database.collection('bookings')


        // Get Packages Api 

        app.get('/packages', async(req, res)=>{
            const cursor  = packagesCollection.find({});
            const packages = await cursor.toArray()
            res.send(packages)
        })

        // get all bookings 
        app.get('/orders', async(req, res)=>{
            const cursor = bookingCollection.find({})
            const bookedpackages = await cursor.toArray()
            res.send(bookedpackages)
        })

        // POST new booking 
        app.post('/orders', async(req, res)=>{
            const order = req.body
            const result = await bookingCollection.insertOne(order)
            res.json(result)
        })

        // DELETE Package 
        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await  bookingCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally{
        // await client.close()
    }

}

run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Test ! if the server is working')
})

app.listen(port, ()=>{
    console.log(`Project is running on': ${port}`)
})
