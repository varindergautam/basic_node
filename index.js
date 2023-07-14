const express = require('express')
const app = express()
const port = 3000;

const verifyToken = require('./helper/verifyToken');

const mongoose = require('mongoose');

//Database
// mongoose.connect('mongodb://127.0.0.1:27017/test', {useNewUrlParser: true});
const uri = 'mongodb://127.0.0.1:27017'; // Replace with your MongoDB connection string

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the MongoDB server');
  })
  .catch((error) => {
    console.error('Failed to connect to the MongoDB server', error);
  });

// Middleware to parse JSON in the request body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const authRoute = require('./routes/AuthRoute');
app.use('/login', authRoute);

const authRouteApi = require('./routes/api/v1/AuthRoute');
app.use('/api/v1/auth', authRouteApi);

const userRouteApi = require('./routes/api/v1/UserRoute');
app.use('/api/v1/user', userRouteApi);

const categoryRouteApi = require('./routes/api/v1/CategoryRoute');
app.use('/api/v1/category', categoryRouteApi);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})