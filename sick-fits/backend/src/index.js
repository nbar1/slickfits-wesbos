const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const jwt = require('jsonwebtoken');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

// decode the jwt so we can get the user id
// on each request
server.express.use((req, res, next) => {
	const { token } = req.cookies;

	if (token) {
		const { userId } = jwt.verify(token, process.env.APP_SECRET);

		// attach userId to requests
		req.userId = userId;
	}

	next();
});

// create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
	if (!req.userId) return next();

	const user = await db.query.user({ where: { id: req.userId } }, `{id, permissions, email, name}`);

	req.user = user;

	next();
});

server.start(
	{
		cors: {
			credentials: true,
			origin: process.env.FRONTEND_URL,
		},
	},
	deets => {
		console.log(`server is now running on port http://localhost:${deets.port}`);
	}
);
