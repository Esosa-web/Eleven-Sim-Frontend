import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { baseUrl } from '../config';

interface Team {
  _id: string;
  name: string;
  formation: string;
  overallRating: number;
  stats: {
    attack: number;
    defense: number;
    teamwork: number;
  };
  players: {
    _id: string;
    name: string;
    position: string;
  }[];
}

const TeamDetails: React.FC = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetch(`${baseUrl}/teams/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch team details');
        }
        return response.json();
      })
      .then(data => {
        setTeam(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container mt-5"><p className="has-text-centered">Loading...</p></div>;
  if (error) return <div className="container mt-5"><p className="has-text-centered has-text-danger">Error: {error}</p></div>;
  if (!team) return <div className="container mt-5"><p className="has-text-centered">Team not found</p></div>;

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">{team.name}</h1>
        <div className="card">
          <div className="card-content">
            <p><strong>Formation:</strong> {team.formation}</p>
            <p><strong>Overall Rating:</strong> {team.overallRating}</p>
            <p><strong>Attack:</strong> {team.stats.attack}</p>
            <p><strong>Defense:</strong> {team.stats.defense}</p>
            <p><strong>Teamwork:</strong> {team.stats.teamwork}</p>
            
            <h2 className="subtitle mt-4">Players</h2>
            <ul>
              {team.players.map(player => (
                <li key={player._id}>{player.name} - {player.position}</li>
              ))}
            </ul>
          </div>
        </div>
        <Link to="/teams" className="button is-primary mt-4">Back to Teams</Link>
      </div>
    </section>
  );
};

export default TeamDetails;