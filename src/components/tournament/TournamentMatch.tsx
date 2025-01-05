import React, { useState } from 'react';
import { useTournament } from '../../contexts/TournamentContext';
import { TournamentMatch as TournamentMatchType } from '../../types/tournament';
import { simulateMatch } from '../../utils/matchSimulation';
import styles from './TournamentMatch.module.css';

interface Props {
  match: TournamentMatchType;
}

const TournamentMatch: React.FC<Props> = ({ match }) => {
  const { dispatch, state } = useTournament();
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateMatch = () => {
    if (!match.homeTeam || !match.awayTeam) return;
    
    console.log('Starting match simulation:', {
      matchId: match.id,
      round: match.round,
      position: match.position,
      homeTeam: match.homeTeam?.name,
      awayTeam: match.awayTeam?.name,
      currentMatches: state.matches.map(m => ({
        id: m.id,
        round: m.round,
        homeTeam: m.homeTeam?.name,
        awayTeam: m.awayTeam?.name
      }))
    });

    setIsSimulating(true);
    const result = simulateMatch(match.homeTeam, match.awayTeam);

    console.log('Match simulation result:', {
      homeTeam: match.homeTeam?.name,
      homeScore: result.homeScore,
      awayTeam: match.awayTeam?.name,
      awayScore: result.awayScore,
      winner: result.winner?.name
    });

    const updatedMatch: TournamentMatchType = {
      ...match,
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      winner: result.winner,
      played: true
    };

    console.log('Updating current match:', {
      id: updatedMatch.id,
      round: updatedMatch.round,
      position: updatedMatch.position,
      homeTeam: updatedMatch.homeTeam?.name,
      awayTeam: updatedMatch.awayTeam?.name,
      winner: updatedMatch.winner?.name,
      played: updatedMatch.played
    });

    setTimeout(() => {
      dispatch({ type: 'UPDATE_MATCH', payload: updatedMatch });
      
      console.log('State after match update:', {
        matches: state.matches.map(m => ({
          id: m.id,
          round: m.round,
          homeTeam: m.homeTeam?.name,
          awayTeam: m.awayTeam?.name,
          played: m.played,
          winner: m.winner?.name
        }))
      });

      setIsSimulating(false);
      
      if (updatedMatch.winner) {
        updateNextRoundMatch(updatedMatch);
      }
    }, 1000);
  };

  const updateNextRoundMatch = (currentMatch: TournamentMatchType) => {
    if (!currentMatch.winner) return;

    const nextRound = currentMatch.round + 1;
    const nextPosition = Math.ceil(currentMatch.position / 2);
    const isHome = currentMatch.position % 2 !== 0;
    const nextMatchId = `${nextRound}-${nextPosition}`;

    console.log('Creating next round match:', {
        fromMatch: currentMatch.id,
        toMatch: nextMatchId,
        winner: currentMatch.winner.name,
        isHome
    });

    // Create new match
    const nextMatchPayload: TournamentMatchType = {
        id: nextMatchId,
        round: nextRound,
        position: nextPosition,
        homeTeam: isHome ? currentMatch.winner : null,
        awayTeam: !isHome ? currentMatch.winner : null,
        homeScore: 0,
        awayScore: 0,
        winner: undefined,
        played: false
    };

    // Add new match to tournament
    dispatch({
        type: 'ADD_MATCH',  // New action type
        payload: nextMatchPayload
    });
  };

  if (!match.homeTeam || !match.awayTeam) {
    return null;
  }

  return (
    <div className={styles.matchContainer}>
      <div className={styles.teams}>
        <div className={`${styles.team} ${match.winner?._id === match.homeTeam._id ? styles.winner : ''}`}>
          <span>{match.homeTeam.name}</span>
          {match.played && <span className={styles.score}>{match.homeScore}</span>}
        </div>
        <div className={styles.versus}>VS</div>
        <div className={`${styles.team} ${match.winner?._id === match.awayTeam._id ? styles.winner : ''}`}>
          <span>{match.awayTeam.name}</span>
          {match.played && <span className={styles.score}>{match.awayScore}</span>}
        </div>
      </div>
      
      {!match.played && (
        <button 
          className={styles.simulateButton}
          onClick={handleSimulateMatch}
          disabled={isSimulating}
        >
          {isSimulating ? 'Simulating...' : 'Play Match'}
        </button>
      )}
    </div>
  );
};

export default TournamentMatch;