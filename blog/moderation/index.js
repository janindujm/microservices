const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body; // Extract type and data from the request body
    console.log('Received Event', type); // Log the received event type

    if (type === 'CommentCreated') { // If the event is of type CommentModerated
        console.log('Comment Created Event:', data); // Log the comment created event
        let status = data.content.includes('orange') ? 'rejected' : 'approved'; // Check if the content includes the word 'orange'
        const { id, postId, content } = data; // Extract id, postId, and content from the event data

        await axios.post('http://event-bus-srv:3005/events', { // Send the moderated comment to the comments service
            type: 'CommentModerated',
            data: {
                id: id,
                postId: postId,
                status,
                content : content
            }
        });
    }

    res.send({}); // Send an empty response back to the client
});

app.listen(3004, () => { // Start the server on port 3001
    console.log('Server is running on port 3004');
});