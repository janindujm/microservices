const express = require('express'); // Importing Express framework
const bodyParser = require('body-parser'); // Middleware to parse JSON request body
const cors = require('cors'); // Importing CORS middleware 
const axios = require('axios'); // For making HTTP requests


const app = express(); // Create an Express application
app.use(bodyParser.json()); // Middleware to parse JSON request body
app.use(cors()); // Enable CORS for all routes

const posts = {}; // Object to store posts

const handleEvent =(type, data) => {

  if (type === 'PostCreated') { // If the event is of type PostCreated
    const { id, title } = data; // Extract id and title from the event data
    posts[id] = { id, title, comments:[] }; // Store the new post in the posts object
  }

  if (type === 'CommentCreated') { // If the event is of type CommentCreated
    const { id, content, postId, status } = data; // Extract id, content, and postId from the event data
    const post = posts[postId]; // Get the post associated with the comment

        // 🛡️ Check if post exists
        if (post) {
            post.comments.push({ id, content , status});
          } else {
            console.warn(`Post with ID ${postId} not found. Skipping comment.`);
        }
    }
  
  if (type === 'CommentUpdated') { // If the event is of type CommentUpdated  
    const { id, content, postId, status } = data; // Extract id, content, and postId from the event data
    const post = posts[postId]; // Get the post associated with the comment

        // 🛡️ Check if post exists
        if (post) {
            const comment = post.comments.find(comment => comment.id === id); // Find the comment with the matching ID
            if (comment) {
                comment.status = status; // Update the status of the comment
                comment.content = content; // Update the content of the comment
            } else {
                console.warn(`Comment with ID ${id} not found in post ${postId}.`);
            }
        } else {
            console.warn(`Post with ID ${postId} not found. Skipping comment update.`);
        }
    }
}


app.get('/posts', (req, res) => { // Endpoint to get all posts
  res.send(posts); // Send the posts object as the response
});

app.post('/events', (req, res) => { // Endpoint to handle incoming events
    
  const { type, data } = req.body; // Extract type and data from the request body
  console.log('Received Event', type); // Log the received event type

  handleEvent(type, data); // Call the handleEvent function to process the event
  
    res.send({}); // Send an empty response back to the client
});

app.listen(3003, async() => { // Start the server on port 3002
  console.log("Listening on 3003");
  try {
    const res = await axios.get("http://event-bus-srv:3005/events");
 
    for (let event of res.data) {
      console.log("Processing event:", event.type);
 
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
}); // Start the server on port 3002