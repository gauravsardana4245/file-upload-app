const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const File = require("./Models/File")
const port = 5000;
const connectToMongo = require("./db.js");
app.use(cors());
app.use(express.json());

// app.use(express.static(path.join(__dirname, 'saved')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
let uploadedFiles = [];

app.post('/upload', upload.array('files'), async (req, res) => {
    try {
        uploadedFiles = req.files.map((file) => ({
            fileName: file.originalname,
            fileSize: file.size,
            creationDate: fs.statSync(file.path).ctime,
        }));
        const savedFiles = File.create({ uploadedFiles })

        res.json(uploadedFiles);
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'Error uploading files' });
    }
});

app.post('/save', (req, res) => {
    const { fileName } = req.body;
    const sourcePath = path.join(__dirname, 'uploads', fileName);
    const destinationPath = path.join(__dirname, 'saved', fileName);

    try {
        fs.renameSync(sourcePath, destinationPath);

        const downloadLinks = uploadedFiles.map((savedFileName) => ({
            fileName: savedFileName,
            downloadLink: `/saved/${savedFileName}`,
        }));

        res.status(200).json({
            message: 'File saved successfully',
            savedFiles: downloadLinks,
        });
    } catch (error) {
        console.error('Error saving the file:', error);
        res.status(500).json({ error: 'Error saving file' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

connectToMongo();
