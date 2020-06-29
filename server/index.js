require("dotenv").config();

const slug = require("mongoose-slug-generator");
const mongoose = require("mongoose");
const express = require("express");
const next = require("next");
const server = express();
const client = next({
  dev: process.env.NODE_ENV !== "production",
  dir: "./client",
});
const clientHandler = client.getRequestHandler();
mongoose.plugin(slug);

const initDbData = require("./utils/dataManager");

const authRouter = require("./routes/auth");
const exhibitsRouter = require("./routes/exhibits");
const usersRouter = require("./routes/users");
const toursRouter = require("./routes/tours");
const rolesRouter = require("./routes/roles");

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/exhibits", exhibitsRouter);
server.use("/api/users", usersRouter);
server.use("/api/tours", toursRouter);
server.use("/api/roles", rolesRouter);

server.all("*", (req, res) => clientHandler(req, res));

server.use((error, req, res, next) => {
  console.log("ERROR: ", error);
  res.status(500).json(error);
});

server.listen(process.env.PORT, async () => {
  await client.prepare();

  await mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  initDbData.initDbData();

  console.log(`Server is runing on ${process.env.PORT} port!`);
});
