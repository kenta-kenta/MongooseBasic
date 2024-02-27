const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shopApp')
    .then(() => {
        console.log('コネクションOK!');
    })
    .catch((err) => {
        console.log('コネクションエラー');
        console.log(err);
    })

const personSchema = new mongoose.Schema({
    first: String,
    last: String
});

personSchema.virtual('fullName').get(function() {
    return `${this.first} ${this.last}`;
});

personSchema.pre('save', async function() {
    this.first = 'ほげ';
    this.last = 'もげ';
    console.log('今から保存するよ');
});

personSchema.post('save', async function() {
    console.log('保存したよ!');
});

const Person = mongoose.model('Person', personSchema);