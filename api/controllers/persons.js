const personsRouter = require('express').Router();
const logger = require('../utils/logger');
const Person = require('../models/person');

personsRouter.get('/', (request, response) => {
    Person.find({}).then((people) => response.json(people));
});

personsRouter.get('/:id', (request, response, next) => {
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

personsRouter.put('/:id', (request, response, next) => {
    const { name, number } = request.body;
    const { id } = request.params;


    const person = { name, number };

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
        .then((updatedPhone) => response.json(updatedPhone))
        .catch((error) => next(error));
});

personsRouter.post('/', (request, response, next) => {
    const { name, number }= request.body;
    logger.info(typeof(number))

    const newPerson = new Person({
        name,
        number
    });

    newPerson.save()
        .then((person) => {
            logger.info(person);
            return response.status(201).json(newPerson);
        })
        .catch(error => next(error));
});

personsRouter.delete('/:id', (request, response, next) => {
    const { id } = request.params;

    Person.findByIdAndDelete(id)
        .then((person) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

personsRouter.put('/:id');


module.exports = personsRouter;