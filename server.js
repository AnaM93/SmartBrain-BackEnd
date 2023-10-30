const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '192.168.0.177',
      port : 5432,
      user : 'ana',
      password : 'test',
      database : 'smart-brain'
    }
  });



const app = express();


const database = {
    users : [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login : [
        {
            id : '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
 bcrypt.compare("apples", '$2a$10$Pg9JHjQ1Z/RRzRR2bT7qWu5.wiHKxRMCSZKAaQDE.IEef0PK5C3g.', function(err, res) {
    console.log ('first guess', res)
});
bcrypt.compare("veggies", '$2a$10$Pg9JHjQ1Z/RRzRR2bT7qWu5.wiHKxRMCSZKAaQDE.IEef0PK5C3g.', function(err, res) {
    console.log ('second guess', res)
});
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json(database.users[0])
        } else {
            res.status(400).json('error logging in')
        }
    res.json('signing')
})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user => {
    res.json(user[0])
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db.select('*').from('users').where({
        id:id
    })
    .then(user => {
        if(user.length) {
            res.json(user[0])
        }else{
            res.status(400).json('Not found') 
        }
        
    })
    .catch(err => res.status(400).json('error getting user'))
    
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries ++
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('not found')
    }
})



app.listen(3001, ()=> {
    console.log('app running at port 3001')
})

/* endpoints
root route / --> 'this is working'
/signin route --> POST = succes/fail
/register route --> POST = user
/profile/:userId --> GET = AUSER
/image--> PUT = updated user

*/