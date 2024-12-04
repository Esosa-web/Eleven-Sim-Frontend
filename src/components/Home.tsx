import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Master the <span className={styles.highlight}>Inazuma Eleven</span> Universe
          </h1>
          <p className={styles.heroSubtitle}>
            Unleash special moves, manage teams, and become the ultimate football strategist
          </p>
          <Link to="/match" className={styles.ctaButton}>Start Simulation</Link>
        </div>
        <div className={styles.heroGraphic}>
          {/* We'll create this with CSS */}
        </div>
      </section>
      
      <section className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🏆</div>
          <h2>Team Management</h2>
          <p>Build and customize your dream Inazuma teams</p>
          <Link to="/teams" className={styles.featureButton}>Manage Teams</Link>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>⚽</div>
          <h2>Match Simulation</h2>
          <p>Experience thrilling football matches with special techniques</p>
          <Link to="/match" className={styles.featureButton}>Simulate Match</Link>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📊</div>
          <h2>Player Analysis</h2>
          <p>Dive deep into player stats and special moves</p>
          <Link to="/players" className={styles.featureButton}>Analyze Players</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;