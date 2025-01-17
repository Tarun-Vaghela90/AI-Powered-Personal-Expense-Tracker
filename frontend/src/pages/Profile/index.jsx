import styles from "./styles.module.css"


export default function Home(userDetails) {
    const user = userDetails.user;
    console.log("User:", user);

    const logout = ()=>{
            window.open(
                `${import.meta.env.VITE_REACT_APP_URL}/auth/google/logout`,
                "_self"
            );
    };
  return (
    <div className={styles.container}>
    <div className={styles.form_container}>
        <div className={styles.left}>
            <img className={styles.img} defaultValue={user.pictur} src="./image/profile.jpg" alt="login"  />
            </div>
        <div className={styles.right}>
            <h2 className={styles.from_heading}>Profile</h2>
            <img src={user.picture} className={styles.profile_img} alt=""  />
            <input type="text" defaultValue={user.name} className={styles.input} placeholder="name" id="" />
            <input type="text" defaultValue={user.email} className={styles.input} placeholder="email" id="" />
            <button className={styles.btn} onClick={logout}> Logout </button>
            
            </div>
        </div>        
    </div>
  )
}

