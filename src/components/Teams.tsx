import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Teams.module.css';
import { baseUrl } from '../config';

interface Team {
  _id: string;
  name: string;
  formation: string;
  overallRating: number;
  attack: number;
  defense: number;
  teamwork: number;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch(`${baseUrl}/teams`)
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching teams:', error));
  }, []);

  return (
    <div className={styles.teamsContainer}>
      <h1 className={styles.title}>Inazuma Eleven Teams</h1>
      <div className={styles.teamGrid}>
        {teams.map(team => (
          <Link to={`/teams/${team._id}`} key={team._id} className={styles.teamCard}>
            <div className={styles.teamLogo}>{team.name[0]}</div>
            <h2 className={styles.teamName}>{team.name}</h2>
            <div className={styles.teamStats}>
              <span>Rating: {team.overallRating}</span>
              <span>Formation: {team.formation}</span>
            </div>
            <div className={styles.teamAttributes}>
              <div className={styles.attribute}>
                <span>Attack</span>
                <div className={styles.attributeBar}>
                  <div className={styles.attributeFill} style={{width: `${team.attack}%`}}></div>
                </div>
              </div>
              <div className={styles.attribute}>
                <span>Defense</span>
                <div className={styles.attributeBar}>
                  <div className={styles.attributeFill} style={{width: `${team.defense}%`}}></div>
                </div>
              </div>
              <div className={styles.attribute}>
                <span>Teamwork</span>
                <div className={styles.attributeBar}>
                  <div className={styles.attributeFill} style={{width: `${team.teamwork}%`}}></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Teams;