const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dealRoutes = require('./routes/deal.routes');
const hubspotRoutes = require('./routes/hubspot.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', dealRoutes)
app.use('/api', hubspotRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the Deals API');
});

const PORT = process.env.PORT || 4000;

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));