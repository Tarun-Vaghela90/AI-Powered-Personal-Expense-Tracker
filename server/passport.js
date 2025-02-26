import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from './model/User.js'; // Make sure to import your User model
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ["profile", "email"],
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists in DB
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // If user doesn't exist, create a new user
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos[0].value,
      });
    }
    return done(null, user); // Return the user object after creating or finding
  } catch (error) {
    console.error("Error during Google OAuth:", error);
    return done(error, null); // Handle error
  }
}
));


// Serialize user to the session
passport.serializeUser((user, done) => {
  done(null, user.id);  // Store the user's ID in the session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
