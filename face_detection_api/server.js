import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';
import register from './controllers/register.js';
import signin from './controllers/signin.js';
import profile from './controllers/profile.js';
import image from './controllers/image.js';

 const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'cristina',
      database : 'face-detect'
    }
  });

  console.log(db.select('*').from('users').then(data => {
    console.log(data)
  }));


const app = express();
app.use(bodyParser.json());
app.use(cors());




const database = {
    users: [
        {
            id: '123',
            name: 'john', 
            mail: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'johneet', 
            mail: 'johneet.congokol@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john.congokol@gmail.com'
        }
    ]

}

app.get('/', (req, res) => {
    res.send(db.users);
})

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post("/register",register.handleRegister(db, bcrypt))

app.get('/profile/:id', profile.handleProfile(db))

app.put('/image', image.handleImage(db))

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})



app.listen(3000, () => {
    console.log('app is running on port 3000');
})



/*
/ ==> res = this is working;
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user 


*/
