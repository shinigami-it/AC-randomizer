const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const CARS_FOLDER = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/cars';
const TRACKS_FOLDER = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let availableCars = [];
let usedCars = [];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadCars() {
  availableCars = fs.readdirSync(CARS_FOLDER).filter(name => {
    const fullPath = path.join(CARS_FOLDER, name);
    return fs.lstatSync(fullPath).isDirectory();
  });
  usedCars = [];
}

function loadTracks() {
  return fs.readdirSync(TRACKS_FOLDER).filter(name => {
    const fullPath = path.join(TRACKS_FOLDER, name);
    return fs.lstatSync(fullPath).isDirectory();
  });
}

function getNextCars(count) {
  if (availableCars.length < count) {
    loadCars();
  }

  const shuffled = shuffle([...availableCars]);
  const selected = shuffled.slice(0, count);

  availableCars = availableCars.filter(car => !selected.includes(car));
  usedCars.push(...selected);

  return selected;
}

// --- API ---

app.get('/api/cars', (req, res) => {
  const count = parseInt(req.query.count || '1', 10);
  if (isNaN(count) || count <= 0) {
    return res.status(400).json({ error: 'Invalid count' });
  }

  const cars = getNextCars(count);
  res.json({ cars });
});

app.get('/api/tracks', (req, res) => {
  const tracks = loadTracks();
  res.json({ tracks });
});

app.get('/api/race', (req, res) => {
  const count = parseInt(req.query.count || '1', 10);
  if (isNaN(count) || count <= 0) {
    return res.status(400).json({ error: 'Invalid count' });
  }

  const cars = getNextCars(count);
  const tracks = loadTracks();
  const track = shuffle([...tracks])[0];

  res.json({ track, cars });
});

loadCars();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});