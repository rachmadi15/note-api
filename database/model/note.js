const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minLength: 10,
        maxLength: 50
    },
    content: {
        type: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

NoteSchema.set('timestamps', true);

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;