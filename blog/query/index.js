const express = require('express'); // Importing Express framework
const bodyParser = require('body-parser'); // Middleware to parse JSON request body
const cors = require('cors'); // Importing CORS middleware 


const app = express(); // Create an Express application
app.use(bodyParser.json()); // Middleware to parse JSON request body
app.use(cors()); // Enable CORS for all routes

const posts = {}; // Object to store posts


app.get('/posts', (req, res) => { // Endpoint to get all posts
  res.send(posts); // Send the posts object as the response
});

app.post('/events', (req, res) => { // Endpoint to handle incoming events
    
  const { type, data } = req.body; // Extract type and data from the request body
  console.log('Received Event', type); // Log the received event type

  if (type === 'PostCreated') { // If the event is of type PostCreated
    const { id, title } = data; // Extract id and title from the event data
    posts[id] = { id, title, comments:[] }; // Store the new post in the posts object
  }

  if (type === 'CommentCreated') { // If the event is of type CommentCreated
    const { id, content, postId } = data; // Extract id, content, and postId from the event data
    const post = posts[postId]; // Get the post associated with the comment

        // 🛡️ Check if post exists
        if (post) {
            post.comments.push({ id, content });
          } else {
            console.warn(`Post with ID ${postId} not found. Skipping comment.`);
        }
    }
  
    res.send({}); // Send an empty response back to the client
});

app.listen(3003, () => { // Start the server on port 3002
  console.log('Server is running on port 3003'); // Log a message indicating the server is running
}); // Start the server on port 3002