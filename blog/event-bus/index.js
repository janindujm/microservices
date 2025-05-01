const express = require('express'); // Importing Express framework
const bodyParser = require('body-parser'); // Middleware to parse JSON request body
const axios = require('axios'); // For making HTTP requests

const app = express(); // Create an Express application
app.use(bodyParser.json()); // Middleware to parse JSON request body

 app.post('/events', (req, res) => { // Endpoint to handle incoming events  
    const event = req.body; // Extract the event from the request body
    console.log('Event received:', event); // Log the received event

    // Forward the event to other services (e.g., comments, posts, query)
    axios.post('http://localhost:3000/events', event).catch((err) => {
        console.error('Error sending event to posts service:', err.message); // Log any errors
    });
    axios.post('http://localhost:3001/events', event).catch((err) => {
        console.error('Error sending event to comments service:', err.message); // Log any errors
    });
    axios.post('http://localhost:3002/events', event).catch((err) => {
        console.error('Error sending event to query service:', err.message); // Log any errors
    });

    res.send({status: 'OK'}); // Send a response back to the client

 
 
}); // Endpoint to handle incoming events

app.listen(3005, () => {
    console.log('Listening on 3005')
})