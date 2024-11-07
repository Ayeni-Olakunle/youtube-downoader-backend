const express = require("express"),
  port = process.env.PORT || 5000;

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE, PUT");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

const downloadRoutes = require("./router/router");
app.use("/youtube", downloadRoutes);

app.listen(5000, function () {
  console.log(`Server started on port ${port}`);
});