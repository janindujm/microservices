const express = require('express'); 
const bodyParser = require('body-parser'); // Middleware to parse JSON request body
const {randomBytes} = require('crypto'); // For generating random IDs



const app =express(); // Create an Express application
app.use(bodyParser.json()); // Middleware to parse JSON request body

const commentsByPostId = {}; // Object to store comments by post ID

app.get('/posts/:id/comments', (req, res) => { // Get comments for a specific post
    res.send(commentsByPostId[req.params.id] || []); // Send comments for the post or an empty array if none exist

});

app.post('/posts/:id/comments', (req, res) => { // Create a new comment for a specific post
    const commentId = randomBytes(4).toString('hex'); // Generate a random ID for the comment
    const {content} = req.body; // Extract content from request body
    const {id} = req.params; // Extract post ID from request parameters
    
    const comments = commentsByPostId[id] || []; // Get existing comments for the post or initialize an empty array
    comments.push({id: commentId, content}); // Add the new comment to the array
    commentsByPostId[id] = comments; // Update the comments object
    
    res.status(201).send(comments); // Send a 201 Created response with the new comment
}); // Create a new comment for a specific post

app.listen(3001, () => { // Start the server on port 3001
    console.log('Server is running on port 3001');
});