const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { name: "Emmy Code" });
});

const downloadRoutes = require("./router/router");
app.use("/youtube", downloadRoutes);

app.listen(5000, function () {
  console.log(`Server started on port ${port}`);
});
