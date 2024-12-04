import React from 'react';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>About Inazuma Eleven Simulator</h1>
      
      <section className={styles.aboutSection}>
        <h2>What is this madness?</h2>
        <p>
          Welcome to the Inazuma Eleven Simulator, where soccer meets anime, 
          and reality takes a backseat to pure, unadulterated fun! This isn't 
          your grandpa's soccer game - unless your grandpa can shoot fireballs 
          from his feet, in which case, can we meet him?
        </p>
      </section>

      <section className={styles.aboutSection}>
        <h2>Features that'll make you go "Huh?"</h2>
        <ul>
          <li>Gravity-defying kicks that would make Newton weep</li>
          <li>Teams powered by the spirit of friendship (and a bit of magic)</li>
          <li>Matches where the laws of physics are more like "suggestions"</li>
          <li>A tournament mode that's more unpredictable than a soap opera plot</li>
        </ul>
      </section>

      <section className={styles.aboutSection}>
        <h2>Who's responsible for this?</h2>
        <p>
          This simulator was created by a team of sleep-deprived developers who 
          watched too much anime and played too many video games. No soccer balls 
          were harmed in the making of this application, but several keyboards 
          gave their lives for the cause.
        </p>
      </section>

      <section className={styles.aboutSection}>
        <h2>Legal Mumbo-Jumbo</h2>
        <p>
          Inazuma Eleven is a trademark of Level-5 Inc. This simulator is a fan-made 
          project and is not affiliated with or endorsed by Level-5. Any resemblance 
          to real soccer is purely coincidental and frankly, a bit surprising.
        </p>
      </section>

      <div className={styles.disclaimer}>
        Warning: Excessive use of this simulator may result in an irresistible urge 
        to shout attack names before kicking balls. We are not responsible for any 
        strange looks you may receive at your local park.
      </div>
    </div>
  );
};

export default About;