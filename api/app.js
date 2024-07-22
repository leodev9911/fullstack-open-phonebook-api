const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const Person = require('./models/person');
const app = express();
const middleware = require('./utils/middleware');
const personsRouter = require('./controllers/persons');

app.use(express.static('dist'));
morgan.token('body', (request, response) => JSON.stringify(request.body));

app.use(express.json());
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :body'
    )
);
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.get('/api', (request, response) => {
    Person.find({}).then((people) =>
        response.send(`
        <p>Phonebook has info for ${people.length} people</p>
        <p>${new Date()}</p>
    `)
    );
});

app.use('/api/people', personsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;