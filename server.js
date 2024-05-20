// Import the express module to create our web server
const express = require("express");
const cookieParser = require("cookie-parser");

// Import the path module to provide utilities for working with file and directory paths
const path = require("path");
// Import the logger middleware for logging request details
const { logger } = require("./middleware/logger.js");
// Import the errorHandler middleware for handling errors
const errorHandler = require("./middleware/errorHandler.js");
// Load environment variables from the .env file
require("dotenv").config();
// Import the cors module to enable CORS with various options
const cors = require("cors");
// Import the corsOptions configuration
const corsOptions = require("./config/corsOptions.js");
// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;
// Import the mongoose module for connecting to MongoDB
const mongoose = require("mongoose");
// Import the connectDB function to connect to the database
const connectDB = require("./config/db.js");
// Import the bodyParser module to parse incoming request bodies
const bodyParser = require("body-parser");
// Establish a connection to the database
connectDB();
// Initialize an instance of express
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

// Parse incoming JSON payloads
app.use(bodyParser.json());
// Parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));
// Use the logger middleware
app.use(logger);
// Apply CORS with the configured options
app.use(cors(corsOptions));

// Define the root route and associate it with the root router
app.use("/", require("./routes/root"));
// Define the users route and associate it with the usersRoute router
app.use("/users", require("./routes/usersRoute"));
// Define the notes route and associate it with the notesRoute router
app.use("/notes", require("./routes/notesRoute"));
// Define the auth routes
app.use("/auth", require("./routes/authRoutes"));
// Define a catch-all route handler for any requests that don't match the above routes
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Use the errorHandler middleware for any errors that occur in the routing
app.use(errorHandler);

// Start the server and log the port it's running on
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

// const express = require("express");
// const path = require("path");
// const { logger } = require("./middleware/logger.js");
// const errorHandler = require("./middleware/errorHandler.js");
// require("dotenv").config();
// const cors = require("cors");
// const corsOptions = require("./config/corsOptions.js");
// const PORT = process.env.PORT || 3000;
// const mongoose = require("mongoose");
// const connectDB = require("./config/db.js");
// const bodyParser = require("body-parser");
// connectDB();
// const app = express();

// app.use(express.static(path.join(__dirname, "/public")));
// // parse application/json
// app.use(bodyParser.json());
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(logger);
// app.use(cors(corsOptions));

// app.use("/", require("./routes/root"));
// app.use("/users", require("./routes/usersRoute"));

// app.all("*", (req, res) => {
//   res.status(404);
//   if (req.accepts("html")) {
//     res.sendFile(path.join(__dirname, "views/404.html"));
//   } else if (req.accepts("json")) {
//     res.json({ message: "404 Not Found" });
//   } else {
//     res.type("txt").send("404 Not Found");
//   }
// });

// app.use(errorHandler);

// app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
