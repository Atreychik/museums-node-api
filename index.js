require("dotenv").config();

const cors = require("cors");
const slug = require("mongoose-slug-generator");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
mongoose.plugin(slug);

const initDbData = require("./utils/dataManager");

const authRouter = require("./routes/auth");
const exhibitsRouter = require("./routes/exhibits");
const usersRouter = require("./routes/users");
const toursRouter = require("./routes/tours");
const rolesRouter = require("./routes/roles");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/exhibits", exhibitsRouter);
app.use("/api/users", usersRouter);
app.use("/api/tours", toursRouter);
app.use("/api/roles", rolesRouter);

app.use((error, req, res, next) => {
  console.log("ERROR: ", error);
  res.status(500).json(error);
});

app.listen(process.env.PORT, async () => {
  await mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  initDbData.initDbData();

  console.log(`Server is runing on ${process.env.PORT} port!`);
});
