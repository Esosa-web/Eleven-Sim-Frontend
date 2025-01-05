import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team } from '../../types/team';
import { TournamentMatch } from '../../types/tournament';
import { useTournament } from '../../contexts/TournamentContext';
import TournamentSetup from './TournamentSetup';
import TournamentPairings from './TournamentPairings';
import styles from './TournamentCreator.module.css';

const TournamentCreator: React.FC = () => {
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'selection' | 'pairing'>('selection');
  const navigate = useNavigate();
  const { dispatch } = useTournament();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const teams = await response.json();
      setAvailableTeams(teams);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setIsLoading(false);
    }
  };

  const handleTeamsSelected = (teams: Team[]) => {
    setSelectedTeams(teams);
    setCurrentStep('pairing');
    console.log('Selected teams:', teams);
  };

  if (isLoading) {
    return <div>Loading teams...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Tournament</h1>
      {currentStep === 'selection' ? (
        <TournamentSetup
          availableTeams={availableTeams}
          onTeamsSelected={handleTeamsSelected}
        />
      ) : (
        <TournamentPairings
          selectedTeams={selectedTeams}
          onPairingsComplete={(matches) => {
            console.log('Pairings complete:', matches);
            
            const tournamentMatches: TournamentMatch[] = [
              ...matches.map((match, index) => ({
                id: `1-${index + 1}`,
                round: 1,
                position: index + 1,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                homeScore: 0,
                awayScore: 0,
                played: false
              })),
              {
                id: '2-1',
                round: 2,
                position: 1,
                homeTeam: null,
                awayTeam: null,
                homeScore: 0,
                awayScore: 0,
                played: false
              },
              {
                id: '2-2',
                round: 2,
                position: 2,
                homeTeam: null,
                awayTeam: null,
                homeScore: 0,
                awayScore: 0,
                played: false
              },
              {
                id: '3-1',
                round: 3,
                position: 1,
                homeTeam: null,
                awayTeam: null,
                homeScore: 0,
                awayScore: 0,
                played: false
              }
            ];

            dispatch({ type: 'SET_MATCHES', payload: tournamentMatches });
            
            navigate('/tournament/bracket');
          }}
        />
      )}
    </div>
  );
};

export default TournamentCreator;