const express = require("express");

const app = express();

//req handler f(n)
app.use("/",(req, res) => {
  res.send("hello from the server");
});

app.listen(3000, () => {
  console.log("server is listning on port 3000");
});
