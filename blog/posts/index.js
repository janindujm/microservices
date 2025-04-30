
const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors'); // Importing CORS middleware

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON request body
app.use(cors()); // Enable CORS for all routes

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
}); 

app.post('/posts', (req, res) => {   // Create a new post
  const id = randomBytes(4).toString('hex');   // Generate a random ID
  const {title} = req.body; // Extract title from request body

    posts[id] = {id, title}; // Store the new post in the posts object
    res.status(201).send(posts[id]);      // Send a 201 Created response with the new post
}); 


app.listen(3000, () => {
  console.log('Server is running on port 3000');
}  );