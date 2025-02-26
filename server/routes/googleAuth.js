import express from "express";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Success route after successful Google login
router.get('/login/success', (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: req.user, // Returning the user data from session
      });
    } else {
      res.status(403).json({ success: false, message: "Not authenticated" });
    }
});

// Failure route if login fails
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Login Failure",
    });
});

// Google OAuth callback route
router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "/auth/login/failed" }),
    (req, res) => {
        try {
            // Redirecting to the client URL after successful authentication
            res.redirect(process.env.CLIENT_URL); 
        } catch (error) {
            console.error("Google Authentication failed:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    }
);

// Google login route to initiate OAuth flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google logout route
router.get("/google/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
          return next(err);  // Handle any errors that occur during logout
        }
        // Successfully logged out, redirect to the client URL
        res.redirect(process.env.CLIENT_URL); 
    });
});

export default router;
