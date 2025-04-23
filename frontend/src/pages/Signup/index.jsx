import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/users/register`, {
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
                    "Signup failed. Please check your input.";
                setError(errorMsg);
                return;
            }
    
            localStorage.setItem("authToken", data.authToken);
            navigate("/dashboard/home");
    
        } catch (error) {
            console.error("Error:", error);
            setError("Something went wrong. Please try again.");
        }
    };
    
    const googleAuth = () => {
        window.open(`${import.meta.env.VITE_REACT_APP_URL}/auth/google/callback`, "_self");
    };

    return (
        <div className={styles.container}>
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
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.btn}>Sign Up</button>
                    </form>
                    <p className={styles.text}>or</p>
                    <button className={styles.google_btn} onClick={googleAuth}>
                        <img src="./images/google.png" alt="googleicon" />
                        <span>Sign Up with Google</span>
                    </button>
                    <p className={styles.text}>
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
