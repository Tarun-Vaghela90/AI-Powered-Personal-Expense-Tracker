const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");  // Ensure express-session is used
const authRoutes = require("./routes/auth");
require('./passport')
const app = express();

// Use express-session for session management
app.use(
    session({
        secret: "ranger", // Your session secret key
        resave: false, // Prevents resaving session if unmodified
        saveUninitialized: false, // Prevents saving uninitialized sessions
        cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24-hour session
    })
);

app.use(passport.initialize());
app.use(passport.session()); // This is needed to support login sessions

app.use(
    cors({
        origin: "http://localhost:5173", // Frontend URL
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    })
);

app.use("/auth", authRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
