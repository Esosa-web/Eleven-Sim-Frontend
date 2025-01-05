import React from 'react';
import { useTournament } from '../../contexts/TournamentContext';
import styles from './TournamentBracket.module.css';

const TournamentBracket: React.FC = () => {
  const { state, dispatch } = useTournament();
  const { matches } = state;

  const quarterFinals = matches.filter(match => match.round === 1);
  const semiFinals = matches.filter(match => match.round === 2);
  const final = matches.find(match => match.round === 3);

  const simulateMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || match.played || !match.homeTeam || !match.awayTeam) return;

    // Random score generation (0-5 goals each)
    const homeScore = Math.floor(Math.random() * 6);
    const awayScore = Math.floor(Math.random() * 6);
    
    // If scores are equal, home team wins (just to keep it simple)
    const winner = homeScore >= awayScore ? match.homeTeam : match.awayTeam;

    // Update current match
    const updatedMatch = {
      ...match,
      homeScore,
      awayScore,
      winner,
      played: true
    };

    // Find the next match where this winner should go
    const nextRoundMatch = matches.find(m => {
      if (m.round !== match.round + 1) return false;
      // For first round matches
      if (match.round === 1) {
        return Math.ceil(match.position / 2) === m.position;
      }
      // For semi-finals
      return match.round === 2;
    });

    // Update next match if found
    let nextMatch;
    if (nextRoundMatch) {
      nextMatch = {
        ...nextRoundMatch,
        // If it's an odd-numbered position, it's a home team
        homeTeam: match.position % 2 === 1 ? winner : nextRoundMatch.homeTeam,
        // If it's an even-numbered position, it's an away team
        awayTeam: match.position % 2 === 0 ? winner : nextRoundMatch.awayTeam,
      };
    }

    // Dispatch updates
    if (nextMatch) {
      // Update current match
      dispatch({ 
        type: 'UPDATE_MATCH',
        payload: updatedMatch
      });
      // Update next match
      dispatch({ 
        type: 'UPDATE_MATCH',
        payload: nextMatch
      });
    } else {
      // Just update current match
      dispatch({ 
        type: 'UPDATE_MATCH',
        payload: updatedMatch
      });
    }
  };

  return (
    <div className={styles.bracketContainer}>
      <div className={styles.round}>
        <h2>Quarter Finals</h2>
        <div className={styles.matches}>
          {quarterFinals.map(match => (
            <div key={match.id} className={styles.matchCard}>
              <div className={styles.team}>
                {match.homeTeam?.name || 'TBD'}
                {match.played && <span className={styles.score}>{match.homeScore}</span>}
              </div>
              <div className={styles.team}>
                {match.awayTeam?.name || 'TBD'}
                {match.played && <span className={styles.score}>{match.awayScore}</span>}
              </div>
              {!match.played && match.homeTeam && match.awayTeam && (
                <button 
                  className={styles.simulateButton}
                  onClick={() => simulateMatch(match.id)}
                >
                  Simulate Match
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.round}>
        <h2>Semi Finals</h2>
        <div className={styles.matches}>
          {semiFinals.map(match => (
            <div key={match.id} className={styles.matchCard}>
              <div className={styles.team}>
                {match.homeTeam?.name || 'TBD'}
                {match.played && <span className={styles.score}>{match.homeScore}</span>}
              </div>
              <div className={styles.team}>
                {match.awayTeam?.name || 'TBD'}
                {match.played && <span className={styles.score}>{match.awayScore}</span>}
              </div>
              {!match.played && match.homeTeam && match.awayTeam && (
                <button 
                  className={styles.simulateButton}
                  onClick={() => simulateMatch(match.id)}
                >
                  Simulate Match
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.round}>
        <h2>Final</h2>
        <div className={styles.matches}>
          {final && (
            <div className={styles.matchCard}>
              <div className={styles.team}>
                {final.homeTeam?.name || 'TBD'}
                {final.played && <span className={styles.score}>{final.homeScore}</span>}
              </div>
              <div className={styles.team}>
                {final.awayTeam?.name || 'TBD'}
                {final.played && <span className={styles.score}>{final.awayScore}</span>}
              </div>
              {!final.played && final.homeTeam && final.awayTeam && (
                <button 
                  className={styles.simulateButton}
                  onClick={() => simulateMatch(final.id)}
                >
                  Simulate Match
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;