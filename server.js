const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uniqid');
const nodemon = require('nodemon');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        console.log(err);
        res.json(JSON.parse(data));
    })
})

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        console.log(err);
        const noteData = JSON.parse(data);
        req.body['id'] = uuid();
        noteData.push(req.body);
        fs.writeFile('./db/db.json', JSON.stringify(noteData), (err) => {
            console.log(err);
            res.json(req.body);
        })
    })
})

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        noteData = JSON.parse(data);
        noteData = noteData.filter(function (note) {
            return note.id != req.params.id;
        });
        noteData = JSON.stringify(noteData);

        fs.writeFile('./db/db.json', noteData, 'utf8', function (err) {
            if (err) throw err;
        });

        res.send(JSON.parse(noteData));
        });
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);