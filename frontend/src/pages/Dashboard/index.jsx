import { Link, Outlet } from 'react-router-dom';
import styles from './styles.module.css';

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h1 className={styles.heading}>Dashboard</h1>
        
        <nav>
          <Link to="home" className={styles.Link_dash}>Home</Link>
          <Link to="Budget" className={styles.Link_dash}>Budget</Link>
          <Link to="expense" className={styles.Link_dash}>Expense</Link>
          <Link to="reports" className={styles.Link_dash}>Reports</Link>
        </nav>
      </div>
      
      <div className={styles.main_content}>
       
        
        {/* Define nested routes for dashboard */}
        <Outlet />
      </div>
    </div>
  );
}
