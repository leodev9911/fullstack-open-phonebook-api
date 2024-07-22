const mongoose = require('mongoose');
const config = require('../utils/config');

mongoose.set('strictQuery', false);

mongoose.connect(config.MONGODB_URL)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log(`error connecting to MongoDB: ${error.message}`)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema);