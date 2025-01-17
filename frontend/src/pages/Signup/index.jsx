import { Link } from "react-router-dom";
import styles from "./styles.module.css"


export default function Signup() {
    const googleAuth = ()=>{
            window.open(
                `${import.meta.env.VITE_REACT_APP_URL}/auth/google/callback`,
                "_self"
            );
    };
  return (
    <div className={styles.container}>
    <div className={styles.form_container}>
        <div className={styles.left}>
            <img className={styles.img} src="./images/undraw_personal-goals_f9bb.svg" alt="singup"  />
            </div>
        <div className={styles.right}>
    <h1 className={styles.heading}>Sign Up Form</h1>
            <h2 className={styles.from_heading}>Create Account</h2>
            <input type="text" className={styles.input} placeholder="username" id="" />
            <input type="text" className={styles.input} placeholder="Email" id="" />
            <input type="password" className={styles.input} placeholder="password" id="" />
            <button className={styles.btn}> Sign Up </button>
            <p className={styles.text}>or</p>
            <button className={styles.google_btn} onClick={googleAuth}>
                <img src="./images/google.png" alt="gooogleicon"  />
                <span>Sign Up with Google</span>
            </button>
            <p className={styles.text}>
                already have Account ? <Link to="/login">Log In</Link>
            </p>
            </div>
        </div>        
    </div>
  )
}

