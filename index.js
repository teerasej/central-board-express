const express = require('express')
const bodyParser = require('body-parser')
console.log('MongoLab URI: ' + process.env.MONGOLAB_URI)
const db = require('monk')(process.env.MONGOLAB_URI || 'localhost/mydb')


const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', (req, res) => res.send('Hello World!'))


app.get('/posts', (req, res) => {

    console.log('access get all post...')

    let posts = db.get('posts')

    posts.find().then(
        (results) => {
            console.log('Get all success')
            res.json(results)
        }
        , (error) => {
            console.log('Get failed')
            res.status(400)
            res.send('error: ' + error.message)
        }
    )

})

app.post('/posts', (req, res) => {

    let _username = req.body.usernames
    let _message = req.body.message

    let posts = db.get('posts')

    posts.insert({ 
        username: _username
        , message: _message
        , create_date: new Date() 
    }).then(
        (results) => {
            console.log('Insert success')
            res.json(results)
        }
        , (error) => {
            console.log('Insert failed')
            res.status(400)
            res.send('error: ' + error.message)
        }
    )

})
app.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 3000!'))