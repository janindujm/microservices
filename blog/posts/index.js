
const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors'); // Importing CORS middleware
const axios = require('axios');
const { type } = require('os');

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON request body
app.use(cors()); // Enable CORS for all routes

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
}); 

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  try {
    await axios.post('http://event-bus-srv:3005/events', {
      type: 'PostCreated',
      data: { id, title }
    });
    res.status(201).send(posts[id]);
  } catch (error) {
    console.error('Error sending event to event-bus:', error.message);
    res.status(500).send({ error: 'Failed to send event to event-bus' });
  }

});


app.post('/events', (req,res) => {
  console.log('Received Event', req.body.type);
  res.send({});
});


app.listen(3000, () => {
  console.log('v20');
  console.log('Server is running on port 3000');
}  );