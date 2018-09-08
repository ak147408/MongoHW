var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//create object noteSchemea
var NoteSchema = new Schema({

    title: String,

    body: String
});

//creates the model from the title and body string from above
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
