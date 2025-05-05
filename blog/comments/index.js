const express = require('express'); 
const bodyParser = require('body-parser'); // Middleware to parse JSON request body
const {randomBytes} = require('crypto'); // For generating random IDs
const cors = require('cors'); // Importing CORS middleware
const axios = require('axios')



const app =express(); // Create an Express application
app.use(bodyParser.json()); // Middleware to parse JSON request body
app.use(cors()); // Enable CORS for all routes


const commentsByPostId = {}; // Object to store comments by post ID

app.get('/posts/:id/comments', (req, res) => { // Get comments for a specific post
    res.send(commentsByPostId[req.params.id] || []); // Send comments for the post or an empty array if none exist

});

app.post('/posts/:id/comments',async (req, res) => { // Create a new comment for a specific post
    const commentId = randomBytes(4).toString('hex'); // Generate a random ID for the comment
    const {content} = req.body; // Extract content from request body
    const {id} = req.params; // Extract post ID from request parameters
    
    const comments = commentsByPostId[id] || []; // Get existing comments for the post or initialize an empty array
    comments.push({id: commentId, content, status:'pending' }); // Add the new comment to the array


    commentsByPostId[id] = comments; // Update the comments object

    await axios.post('http://event-bus-srv:3005/events',{
        type: 'CommentCreated',
        data:{
            id:commentId,
            content,
            postId: req.params.id,
            status: 'pending' // Set the initial status of the comment to 'pending' 

        }


    })
    
    res.status(201).send(comments); // Send a 201 Created response with the new comment
}); // Create a new comment for a specific post


app.post('/events', async (req,res) => {
  console.log('Received Event', req.body.type);

    if (req.body.type === 'CommentModerated') { // If the event is of type CommentModerated
        console.log('Comment Moderated Event:', req.body.data); // Log the comment moderated event
        const {id, postId, status,content} = req.body.data; // Extract id, postId, status, and content from the event data
        const comments = commentsByPostId[postId]; // Get the comments for the post


        const comment = comments.find(comment => {
            return comment.id === id; // Find the comment with the matching ID
        });

        comment.status = status; // Update the status of the comment

        await axios.post('http://event-bus-srv:3005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        }).catch((err) => {
            console.error('Error sending event to event bus:', err.message); // Log any errors
        });
    }

  res.send({});
});


app.listen(3001, () => { // Start the server on port 3001
    console.log('Server is running on port 3001');
});