import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Players.module.css';
import { baseUrl } from '../config';

interface Player {
  _id: string;
  name: string;
  position: string;
  team: {
    _id: string;
    name: string;
  };
  stats: {
    attack?: number;
    defense?: number;
    speed?: number;
    technique?: number;
  };
}

const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${baseUrl}/players`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        return response.json();
      })
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching players:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.playersContainer}>
      <h1 className={styles.title}>Inazuma Eleven Players</h1>
      <div className={styles.playerGrid}>
        {players.map(player => (
          <Link to={`/players/${player._id}`} key={player._id} className={styles.playerCard}>
            <h2 className={styles.playerName}>{player.name}</h2>
            <p className={styles.playerInfo}>Position: {player.position}</p>
            <p className={styles.playerInfo}>Team: {player.team?.name || 'Unknown'}</p>
            <div className={styles.playerStats}>
              {Object.entries(player.stats).map(([stat, value]) => (
                <div key={stat} className={styles.statBar}>
                  <span className={styles.statLabel}>{stat}</span>
                  <div className={styles.statBarFill} style={{width: `${value}%`}}></div>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Players;