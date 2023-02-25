const express = require("express")
const app = express();
let cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require("body-parser")

app.set('view engine', 'ejs');
app.use(cors())
app.use(express.static('./views'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const collection = client.db('myplayers').collection('teamMembers');
const cursor = collection.find();

async function connection() {
    await client.connect()
} 
   

app.get(('/player/all'), (req, res) => {
    async function connect() {
        try {
            await client.connect();
            console.log('Connected to get all players');
        } catch (err) {
            console.log(err.stack);
        }
        await cursor.forEach((data) => {
            let playerNames = []
            let playerPosition = []
            let playerTouchdown = []
            let playerRushing = []
            let playerSacks = []
            let playerGoalMade = []
            let playerMissed = []
            let playerCatchesMade = []

            for (let i = 0; i < data.players.length; i++) {
                playerNames.push(`${data.players[i].name}`)
                playerPosition.push(`${data.players[i].position}`)
                playerTouchdown.push(`${data.players[i].touchdowns_thrown}`)
                playerRushing.push(`${data.players[i].rushing_yards}`)
                playerSacks.push(`${data.players[i].sacks}`)
                playerGoalMade.push(`${data.players[i].field_goals_made}`)
                playerMissed.push(`${data.players[i].field_goals_missed}`)
                playerCatchesMade.push(`${data.players[i].catches_made}`)

            }

            res.render('app', { fulldata: data.players, item: "" })
        })
    }
    connect()

})

app.get(('/player/add'), (req, res) => {

    res.render('form')

})

app.post(('/player/add'), (req, res) => {

    const { name, position, touchdown, rushing, sacks, goalmade, goalmissed, catchesmade } = req.body

    connection()

    let id = new ObjectId().toHexString()

    collection.updateOne(
        { _id: new ObjectId("63f91d776dc40fda73b9b057") },
        {
            $push: {
                "players": {
                    id: `${id}`,
                    name: `${name}`,
                    position: `${position}`,
                    touchdowns_thrown: `${touchdown}`,
                    rushing_yards: `${rushing}`,
                     sacks: `${sacks}`,
                    field_goals_made: `${goalmade}`,
                    field_goals_missed: `${goalmissed}`,
                    catches_made: `${catchesmade}`
                }
            }

        },
        { $position: 5 }
    );
    res.redirect('/player/all')
})

app.post(('/player/delete'), (req, res) => {
    connection()
    const user = req.body
    const id = Object.keys(user);
    collection.updateOne(
        {},
        { $pull: { players: { id: `${id}` } } }
    )
    res.redirect('/player/all')
})

app.post(('/player/update'), (req, res) => {
    res.render('form2')  
    connection()

    const user = req.body
    const id = Object.keys(user);

    console.log(id);
    collection.updateOne(
        {},
        { $pull: { players: { id: `${id}` } } }
    )

    // const { name, position, touchdown, rushing, sacks, goalmade, goalmissed, catchesmade } = req.body

    // collection.updateOne(
    //     { _id: new ObjectId("63f91d776dc40fda73b9b057") },
    //     {
    //         $push: {
    //             "players": {       
    //                 id: `${id}`,   
    //                 name: `${name}`,
    //                 position: `${position}`,
    //                 touchdowns_thrown: `${touchdown}`,
    //                 rushing_yards: `${rushing}`,
    //                 sacks: `${sacks}`,
    //                 field_goals_made: `${goalmade}`, 
    //                 field_goals_missed: `${goalmissed}`,
    //                 catches_made: `${catchesmade}`
    //             }
    //         }

    //     },      
    // );
  



   
  


})

app.listen(6060, () => {
    console.log("http://127.0.0.1:6060",);
})
     