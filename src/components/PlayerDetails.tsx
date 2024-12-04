import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    attack: number;
    defense: number;
    speed: number;
    technique: number;
  };
}

const PlayerDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No player ID provided');
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/players/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch player details');
        }
        return response.json();
      })
      .then((data: Player) => {
        setPlayer(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching player details:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!player) return <div>Player not found</div>;

  return (
    <div className="container mt-5">
      <h1 className="title">{player.name}</h1>
      <p><strong>Position:</strong> {player.position}</p>
      <p><strong>Team:</strong> {player.team?.name || 'Unknown'}</p>
      <h2 className="subtitle">Stats</h2>
      <ul>
        <li>Attack: {player.stats.attack}</li>
        <li>Defense: {player.stats.defense}</li>
        <li>Speed: {player.stats.speed}</li>
        <li>Technique: {player.stats.technique}</li>
      </ul>
    </div>
  );
};

export default PlayerDetails;