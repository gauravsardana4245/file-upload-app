import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Dropzone from 'react-dropzone';
import axios from 'axios';

const FileUpload = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [savedFiles, setSavedFiles] = useState([]);


    const handleDrop = async (acceptedFiles) => {
        try {
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                formData.append('files', file);
            });

            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadedFiles(response.data);


            setSavedFiles([]);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const handleSave = async (fileName) => {
        try {
            await axios.post('http://localhost:5000/save', { fileName });
            setSavedFiles((prevFiles) => [
                ...prevFiles,
                {
                    fileName,
                    downloadLink: `../../Backend/saved/${fileName}`,
                },
            ]);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    return (
        <Container>
            {/* <Typography variant="h5">File Upload</Typography> */}
            <Dropzone
                acceptedFiles={['image/*', 'application/pdf']}
                maxSize={5000000}
                onDrop={handleDrop}
            >
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className='dropzone'>
                        <input {...getInputProps()} />
                        <Container className='buttonContainer'>
                            <Button
                                className='btn'
                                variant="contained"
                                color="primary"
                                sx={{
                                    backgroundColor: '#3f51b5',
                                    color: 'white',
                                }}
                            >
                                Select Files
                            </Button>
                        </Container>
                    </div>
                )}
            </Dropzone>
            <Container className='uploadedFilesTable'>
                <Typography style={{ marginBottom: "10px" }} variant="h6">Uploaded Files</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>File Name</TableCell>
                                <TableCell>File Size</TableCell>
                                <TableCell>Creation Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {uploadedFiles.map((row) => (
                                <TableRow key={row.fileName}>
                                    <TableCell>{row.fileName}</TableCell>
                                    <TableCell>{row.fileSize} bytes</TableCell>
                                    <TableCell>{row.creationDate}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                backgroundColor: '#3f51b5',
                                                color: 'white',
                                            }}
                                            onClick={() => handleSave(row.fileName)}
                                        >
                                            Save
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Container className='savedFilesTable'>
                <Typography style={{ marginBottom: "10px" }} variant="h6">Saved Files</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>File Name</TableCell>
                                <TableCell>Download</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {savedFiles.map((row) => (
                                <TableRow key={row.fileName}>
                                    <TableCell>{row.fileName}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                backgroundColor: '#3f51b5',
                                                color: 'white',
                                            }}
                                            href={row.downloadLink}
                                            download
                                        >
                                            Download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Container>
    );
};

export default FileUpload;
