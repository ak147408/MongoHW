var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    //allows pop up for comments
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//creates model using mongoose
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
