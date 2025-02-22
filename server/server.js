import express from 'express';
import session from 'express-session';
import passport from 'passport'
import authRoutes from './routes/googleAuth.js';  // Assuming your auth routes are defined here
import userAuth  from './routes/userAuth.js'
import transcation from './routes/transcationRoute.js'
import cors from 'cors'
const app = express();
import './passport.js'
// Middleware for sessions
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
app.use("/api/users", userAuth)
app.use("/api/transcation", transcation)

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));

