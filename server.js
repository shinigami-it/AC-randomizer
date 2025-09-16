const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 50003;

// Blacklists
const EXCLUDE_CAR_KEYWORDS = [
	"rss",
	"vrc",
	"gravygarage",
	"wdb",
	"wdt",
	"traffic",
	"drift",
	"adc",
	"mfg",
	"rw",
	"rfc",
	"gra"
];
const INCLUDE_CAR_KEYWORDS = []; // if not empty → whitelist mode

// Tracks
const EXCLUDE_TRACK_KEYWORDS = ["ks"];
const INCLUDE_TRACK_KEYWORDS = []; // if not empty → whitelist mode

const CARS_FOLDER = "/home/kmf/assetto-corsa/assetto/content/cars";
const TRACKS_FOLDER = "/home/kmf/assetto-corsa/assetto/content/tracks";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let availableCars = [];
let usedCars = [];

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function matchesAny(name, keywords) {
	return keywords.some((k) => name.includes(k.toLowerCase()));
}

function filterWithLists(name, blacklist, whitelist) {
	const lower = name.toLowerCase();
	if (whitelist && whitelist.length > 0) {
		return matchesAny(lower, whitelist);
	}
	if (blacklist && matchesAny(lower, blacklist)) {
		return false;
	}
	return true;
}

function safeReadDir(folder) {
	if (!fs.existsSync(folder)) return [];
	return fs.readdirSync(folder).filter((name) => {
		const full = path.join(folder, name);
		try {
			return fs.lstatSync(full).isDirectory();
		} catch {
			return false;
		}
	});
}

function loadCars() {
	const all = safeReadDir(CARS_FOLDER);
	availableCars = all.filter((name) =>
		filterWithLists(name, EXCLUDE_CAR_KEYWORDS, INCLUDE_CAR_KEYWORDS)
	);
	usedCars = [];
	console.log(`Cars loaded: ${availableCars.length}/${all.length}`);
}

function loadTracks() {
	const all = safeReadDir(TRACKS_FOLDER);
	const tracks = all.filter((name) =>
		filterWithLists(name, EXCLUDE_TRACK_KEYWORDS, INCLUDE_TRACK_KEYWORDS)
	);
	console.log(`Tracks loaded: ${tracks.length}/${all.length}`);
	return tracks;
}

function getNextCars(count) {
	if (availableCars.length < count) {
		loadCars();
	}
	const shuffled = shuffle([...availableCars]);
	const selected = shuffled.slice(0, Math.min(count, shuffled.length));
	availableCars = availableCars.filter((car) => !selected.includes(car));
	usedCars.push(...selected);
	return selected;
}

// --- API routes ---
app.get("/api/cars", (req, res) => {
	const count = parseInt(req.query.count || "1", 10);
	if (isNaN(count) || count <= 0) {
		return res.status(400).json({ error: "Invalid count" });
	}
	const cars = getNextCars(count);
	res.json({ cars });
});

app.get("/api/tracks", (req, res) => {
	const tracks = loadTracks();
	res.json({ tracks });
});

app.get("/api/race", (req, res) => {
	const count = parseInt(req.query.count || "1", 10);
	if (isNaN(count) || count <= 0) {
		return res.status(400).json({ error: "Invalid count" });
	}
	const cars = getNextCars(count);
	const tracks = loadTracks();
	if (tracks.length === 0) {
		return res.status(500).json({ error: "No tracks available" });
	}
	const track = shuffle([...tracks])[0];
	res.json({ track, cars });
});

loadCars();

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
