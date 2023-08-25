const connectToMongo = require('./db');
const express = require('express');
const app = express();
const cors = require('cors');

connectToMongo();

PORT = process.env.PORT || 5000;
// PORT = 5000;

app.use(cors());
app.use(express.json());

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});