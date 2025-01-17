import { Link } from "react-router-dom";
import styles from "./styles.module.css"


export default function Login() {
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
            <img className={styles.img} src="./images/6144340.jpg" alt="login"  />
            </div>
        <div className={styles.right}>
    <h1 className={styles.heading}>Log In </h1>
            <h2 className={styles.from_heading}>Members Log In</h2>
            <input type="text" className={styles.input} placeholder="Email" id="" />
            <input type="password" className={styles.input} placeholder="password" id="" />
            <button className={styles.btn}> Log In </button>
            <p className={styles.text}>or</p>
            <button className={styles.google_btn} onClick={googleAuth}>
                <img src="./images/google.png" alt="gooogleicon"  />
                <span>Sign In with Google</span>
            </button>
            <p className={styles.text}>
                New Here ? <Link to="/signup">Sing Up</Link>
            </p>
            </div>
        </div>        
    </div>
  )
}

