import express from "express";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get('/login/success', (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: req.user,
      });
    } else {
      res.status(403).json({ success: false, message: "Not authenticated" });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Login Failure",
    });
});

router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "/auth/login/failed" }),
    (req, res) => {
        try {
            res.redirect(process.env.CLIENT_URL); // Redirect to the frontend on success
        } catch (error) {
            console.error("Google Authentication failed:", error); // Log the error
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    }
);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
          return next(err);  // Handle any errors that occur during logout
        }
         // Redirect or send a response after successful logout
        res.redirect(process.env.CLIENT_URL); 
    });
});

export default router; // Use export default instead of module.exports
