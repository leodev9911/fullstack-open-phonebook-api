const express = require('express');
const app = express();

app.use(express.json());

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
];

const generateRandomId = () => {
    return Math.floor(Math.random() * 100000);
}

app.get('/', (request, response) =>
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
    const person = persons.find(person => person.id === id);

    response.json(person);
});

app.post('/api/persons/', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Content is missing'
        })
    }

    const isInList = persons?.some(person => person.name === body.name);

    if (isInList) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        id: generateRandomId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson); 
    console.log(persons);
    console.log(newPerson);

    return response.status(201).json(newPerson);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`App running in the port ${PORT}`);
});
