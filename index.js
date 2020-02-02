const express = require("express");
const app = express();
const server = require("http").createServer(app);

// Serve static pages
app.use(express.static(__dirname + "/public"));

// Generate a new bucket and open the page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Start the server on the given port
server.listen(process.env.PORT || 8080);
