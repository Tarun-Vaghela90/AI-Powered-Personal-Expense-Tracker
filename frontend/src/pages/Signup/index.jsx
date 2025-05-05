import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.css";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Input validation
        if (name.trim().length < 3) {
            toast.error("Name must be at least 3 characters long.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/api/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            console.log("Signup response:", data);

            if (!response.ok) {
                // Safe fallback error message
                const errorMsg =
                    data?.errors?.[0]?.msg || // validation array
                    data?.message || // single message
                    data?.error || // API error message
                    "Signup failed. Please check your input.";
                toast.error(errorMsg); // Display error notification
                return;
            }
            // Successful signup
            toast.success("Signup successful! Redirecting to dashboard...");
            localStorage.setItem("authToken", data.authToken);
            setTimeout(() => {
                navigate("/dashboard/home");
            }, 1500); // Delay navigation to allow toast to display
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again."); // Display error notification
        }
    };
    
    // const googleAuth = () => {
    //     window.open(`${import.meta.env.VITE_REACT_APP_URL}/auth/google/callback`, "_self");
    // };

    return (
        <div className={styles.container}>
            <ToastContainer /> {/* Add this line */}
            <div className={styles.form_container}>
                <div className={styles.left}>
                    <img className={styles.img} src="./images/undraw_personal-goals_f9bb.svg" alt="signup" />
                </div>
                <div className={styles.right}>
                    <h1 className={styles.heading}>Sign Up Form</h1>
                    <h2 className={styles.from_heading}>Create Account</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className={styles.btn}>Sign Up</button>
                    </form>
                    <p className={styles.text}>or</p>
                    {/* <button className={styles.google_btn} onClick={googleAuth}>
                        <img src="./images/google.png" alt="googleicon" />
                        <span>Sign Up with Google</span>
                    </button> */}
                    <p className={styles.text}>
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
