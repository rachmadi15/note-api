const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.set("strictQuery", true);

mongoose.connect('mongodb+srv://cobaDB:passwordbaru123@cluster0.rmaq9f3.mongodb.net/?retryWrites=true&w=majority/notesapp').then(() => {
    console.log('DB Connected Succesfully');
}).catch((err) => {
    console.log(err);
});

module.exports = mongoose;