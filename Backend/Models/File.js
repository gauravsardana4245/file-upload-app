const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fileName: String,
    fileSize: Number,
    creationDate: Date,
});

const File = mongoose.model('File', FileSchema);

module.exports = File;