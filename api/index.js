const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
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

let persons = [
    {
        id: '1',
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: '2',
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: '3',
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: '4',
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
    {
        id: '5',
        name: 'Leonardo Fernández',
        number: '52592682',
    },
    {
        id: '6',
        name: 'Helena Ruano',
        number: '52592682',
    },
];

//mongodb+srv://leofullstack:<password>@cluster0.0e1ts9z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const generateRandomId = () => {
    return Math.floor(Math.random() * 100000);
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.get('/api', (request, response) =>
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
);

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find((person) => person.id === id);

    response.json(person);
});

app.post('/api/persons/', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Content is missing',
        });
    }

    const isInList = persons?.some((person) => person.name === body.name);

    if (isInList) {
        return response.status(400).json({
            error: 'name must be unique',
        });
    }

    const newPerson = {
        id: generateRandomId(),
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(newPerson);
    console.log(persons);
    console.log(newPerson);

    return response.status(201).json(newPerson);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App running in the port ${PORT}`);
});
