const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
  // Send a message to the client
  res.sendFile(path.join(__dirname, './db/db.json'))
  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
});

// GET request for a single review
app.get('/api/notes/:id', (req, res) => {
  let dbnotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  res.json(dbnotes[Number(req.params.id)]);

});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// POST request to add a review
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a new note`);
  let dbnotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  let newNote = req.body;
  let newId = dbnotes.length.toString();
  newNote.id = newId;
  dbnotes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(dbnotes));
  res.json(dbnotes);
});

// Delete notes 
app.delete('/api/notes/:id', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to delete this note`);
  let dbnotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  let noteId = req.params.id;
  let tempId = 0;
  dbnotes = dbnotes.filter((note) =>{
    return note.id != noteId;
  });

  for (note of dbnotes) {
    note.id = tempId.toString();
    tempId++;
  }

  fs.writeFileSync('./db/db.json', JSON.stringify(dbnotes));
  res.json(dbnotes);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
