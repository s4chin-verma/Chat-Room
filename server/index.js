const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("./socket");
const userRoute = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoutes");
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoute);

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Something went wrong.' });
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error Occurred while connecting to MongoDB", error);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

const io = socket(server);
