const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public")); // Static() tells the app to make all the files inside the public folder static so that they can be used for frontend work.

app.listen(3000);
