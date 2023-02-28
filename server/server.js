// import npm stuff
const express = require('express');
require('dotenv').config();
const cors = require('cors');

// import custom stuff
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./db');

// import routes
const userRouter = require('./routers/userRouter');
const deckRouter = require('./routers/deckRouter');
const cardRouter = require('./routers/cardRouter');

const port = process.env.PORT || 5000;

// connect the database
connectDB();

// create app
const app = express();

// fix cors for retarded error thing
app.use(cors());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/api/users', userRouter);
app.use('/api/decks', deckRouter);
app.use('/api/cards', cardRouter);

// 'health check' path
app.get('/api', (req, res) => {
  res.status(200);
  res.json('hi');
});

// error handler
app.use(errorHandler);

// start server
app.listen(port, () => console.log(`listening on port ${port}`));
