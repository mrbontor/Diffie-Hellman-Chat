const express = require("express");
const socket = require("socket.io");
const util = require("./utils/prime");

const app = express();
const server = app.listen(3300, () => {
	console.log("Listening at port 3300");
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

io.on("connection", socket => {
	console.log("Conn. established");
	console.log("Socket", socket.id);

	let q, p;
	const bits = 8;
	const a = Math.floor(Math.random() * 9) + 1;
	console.log("a", a);
	// Generate g and p
	util.getPrime(bits).then(num => {
		q = num;
	});
	util.getPrime(bits).then(num => {
		p = num;
	});

	// 1.) Send p & q to client
	socket.on("request", data => {
		console.log("q", q, "p", p);
		socket.emit("request", {
			q: q,
			p: p
		});
	});

	// 3.) Exchange A & B
	socket.on("exchange", data => {
		console.log("B:", data);
		const B = data;
		// 2.) Calculate A = q^a mod p
		const A = Math.pow(q, a) % p;
		// Calculate K(a) = B^a mod p
		const K_a = Math.pow(B, a) % p;
		// Send A and K_a to client
		socket.emit("exchange", {
			K_a: K_a,
			A: A
		});
	});
});
