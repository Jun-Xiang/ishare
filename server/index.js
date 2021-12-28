require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();
const http = require("http").Server(app);
const PORT = process.env.PORT || 4000;

const setupSocketIo = require("./socket");

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(helmet());
// app.use(morgan("dev"));
app.use(express.static("public"));

// Endpoints
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/conversations", require("./routes/conversations"));
app.use("/messages", require("./routes/messages"));
app.use("/comments", require("./routes/comments"));
app.use("/posts", require("./routes/posts"));

// Socket IO
setupSocketIo(http);

mongoose.connect(
	process.env.DB_URI,
	{
		useUnifiedTopology: true,
		useNewUrlParser: true,
	},
	_ => console.log("Connected to mongodb 🎉")
);

http.listen(PORT, _ => console.log(`Server listening at port ${PORT} 🚀`));
