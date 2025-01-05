import React, { useState } from 'react';
import { Team } from '../../types/team';
import styles from './TournamentPairings.module.css';

interface Props {
  selectedTeams: Team[];
  onPairingsComplete: (matches: Array<{ homeTeam: Team; awayTeam: Team }>) => void;
}

const TournamentPairings: React.FC<Props> = ({ selectedTeams, onPairingsComplete }) => {
  const [matchPairings, setMatchPairings] = useState<Array<{ homeTeam?: Team; awayTeam?: Team }>>([
    {}, {}, {}, {}
  ]);

  const getAvailableTeams = (currentMatchIndex: number) => {
    const usedTeams = matchPairings.flatMap((match, idx) => 
      idx !== currentMatchIndex ? [match.homeTeam, match.awayTeam] : []
    ).filter((team): team is Team => team !== undefined);

    return selectedTeams.filter(team => 
      !usedTeams.some(usedTeam => usedTeam._id === team._id)
    );
  };

  const handleTeamSelect = (matchIndex: number, position: 'home' | 'away', teamId: string) => {
    const team = selectedTeams.find(t => t._id === teamId);
    if (!team) return;

    const newPairings = [...matchPairings];
    newPairings[matchIndex] = {
      ...newPairings[matchIndex],
      [position === 'home' ? 'homeTeam' : 'awayTeam']: team
    };
    setMatchPairings(newPairings);
  };

  return (
    <div className={styles.container}>
      <h2>Create Tournament Matches</h2>
      
      <div className={styles.matchesSection}>
        <h3>Quarter Final Matches</h3>
        {matchPairings.map((match, index) => (
          <div key={index} className={styles.matchSlot}>
            <div className={styles.teamSelect}>
              <select
                value={match.homeTeam?._id || ''}
                onChange={(e) => handleTeamSelect(index, 'home', e.target.value)}
                className={styles.selectTeam}
              >
                <option value="">Select Home Team</option>
                {getAvailableTeams(index).map(team => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.vs}>VS</div>

            <div className={styles.teamSelect}>
              <select
                value={match.awayTeam?._id || ''}
                onChange={(e) => handleTeamSelect(index, 'away', e.target.value)}
                className={styles.selectTeam}
              >
                <option value="">Select Away Team</option>
                {getAvailableTeams(index).map(team => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        className={styles.createButton}
        onClick={() => onPairingsComplete(matchPairings as Array<{ homeTeam: Team; awayTeam: Team }>)}
        disabled={!matchPairings.every(match => match.homeTeam && match.awayTeam)}
      >
        Create Tournament
      </button>
    </div>
  );
};

export default TournamentPairings; 