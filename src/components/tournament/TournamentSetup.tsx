import React, { useState } from 'react';
import { Team } from '../../types/team';
import styles from './TournamentSetup.module.css';

interface Props {
  availableTeams: Team[];
  onTeamsSelected: (teams: Team[]) => void;
}

const TournamentSetup: React.FC<Props> = ({ availableTeams, onTeamsSelected }) => {
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

  const handleTeamClick = (team: Team) => {
    if (selectedTeams.find(t => t._id === team._id)) {
      // If team is already selected, remove it
      setSelectedTeams(selectedTeams.filter(t => t._id !== team._id));
    } else if (selectedTeams.length < 8) {
      // If team is not selected and we have less than 8 teams, add it
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Select 8 Teams for the Tournament</h2>
      <p>Selected: {selectedTeams.length}/8</p>
      
      <div className={styles.teamsGrid}>
        {availableTeams.map(team => (
          <div
            key={team._id}
            className={`${styles.teamCard} ${
              selectedTeams.find(t => t._id === team._id) ? styles.selected : ''
            }`}
            onClick={() => handleTeamClick(team)}
          >
            <span className={styles.teamName}>{team.name}</span>
          </div>
        ))}
      </div>

      <button
        className={styles.nextButton}
        disabled={selectedTeams.length !== 8}
        onClick={() => onTeamsSelected(selectedTeams)}
      >
        Next
      </button>
    </div>
  );
};

export default TournamentSetup; 