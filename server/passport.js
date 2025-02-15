import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

// Configure Passport to use the Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"], // This needs to match your route
  },
  (accessToken, refreshToken, profile, done) => {
    // Find or create a user in your database
    return done(null, profile); // `profile` contains the Google profile information
  }
));

// Serialize user to the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});


