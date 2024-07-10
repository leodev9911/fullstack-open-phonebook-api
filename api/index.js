require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const Person = require('./models/person');
const app = express();

app.use(express.static('dist'));
morgan.token('body', (request, response) => JSON.stringify(request.body));

app.use(express.json());
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :body'
    )
);
app.use(cors());

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }

    next(error);
};

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

app.get('/api/people', (request, response) => {
    Person.find({}).then((people) => response.json(people));
});

app.get('/api/people/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findById(id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.put('/api/people/:id', (request, response, next) => {
    const { name, number } = request.body;
    const { id } = request.params;


    const person = { name, number };

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
        .then((updatedPhone) => response.json(updatedPhone))
        .catch((error) => next(error));
});

app.post('/api/people/', (request, response, next) => {
    const { name, number }= request.body;
    console.log(typeof(number))

    const newPerson = new Person({
        name,
        number
    });

    newPerson.save()
        .then((person) => {
            console.log(person);
            return response.status(201).json(newPerson);
        })
        .catch(error => next(error));
});

app.delete('/api/people/:id', (request, response, next) => {
    const { id } = request.params;

    Person.findByIdAndDelete(id)
        .then((person) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

app.put('/api/people/:id');

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App running in the port ${PORT}`);
});
