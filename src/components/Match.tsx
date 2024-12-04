import React, { useState, useEffect } from 'react';
import styles from './Match.module.css';
import { baseUrl } from '../config';

interface Player {
  _id: string;
  name: string;
  position: string;
  attack: number;
  defense: number;
  teamwork: number;
}

interface Team {
  _id: string;
  name: string;
  formation: string;
  overallRating: number;
  attack: number;
  defense: number;
  teamwork: number;
  players: Player[];
}

interface MatchState {
  homeTeam: Team | null;
  awayTeam: Team | null;
  homeScore: number;
  awayScore: number;
  status: 'pre-match' | 'in-progress' | 'completed';
  events: string[];
}

interface TournamentMatch {
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  played: boolean;
}

interface TournamentStandings {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

const Match: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [match, setMatch] = useState<MatchState>({
    homeTeam: null,
    awayTeam: null,
    homeScore: 0,
    awayScore: 0,
    status: 'pre-match',
    events: []
  });
  const [currentMinute, setCurrentMinute] = useState(0);
  const [matchDuration, setMatchDuration] = useState(9);
  const [isTournamentMode, setIsTournamentMode] = useState(false);
  const [tournamentMatches, setTournamentMatches] = useState<TournamentMatch[]>([]);
  const [tournamentStandings, setTournamentStandings] = useState<TournamentStandings[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    fetch(`${baseUrl}/teams`)
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching teams:', error));
  };

  const selectTeam = (team: Team, isHome: boolean) => {
    setMatch(prev => ({
      ...prev,
      [isHome ? 'homeTeam' : 'awayTeam']: team
    }));
  };

  const getRandomPlayer = (team: Team): Player => {
    const attackers = team.players.filter(p => p.position === 'Forward' || p.position === 'Midfielder');
    return attackers[Math.floor(Math.random() * attackers.length)];
  };

  const startTournament = () => {
    if (teams.length < 2) {
      alert("Not enough teams to start a tournament");
      return;
    }

    const matches: TournamentMatch[] = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          homeTeam: teams[i],
          awayTeam: teams[j],
          homeScore: 0,
          awayScore: 0,
          played: false
        });
      }
    }
    setTournamentMatches(matches);

    const initialStandings: TournamentStandings[] = teams.map(team => ({
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    }));
    setTournamentStandings(initialStandings);

    playNextTournamentMatch();
  };

  const playNextTournamentMatch = () => {
    const nextMatch = tournamentMatches.find(match => !match.played);
    if (!nextMatch) {
      alert("Tournament completed!");
      return;
    }

    setMatch({
      homeTeam: nextMatch.homeTeam,
      awayTeam: nextMatch.awayTeam,
      homeScore: 0,
      awayScore: 0,
      status: 'pre-match',
      events: []
    });
  };

  const updateTournamentStandings = (homeTeam: Team, awayTeam: Team, homeScore: number, awayScore: number) => {
    setTournamentStandings(prevStandings => {
      const newStandings = [...prevStandings];
      const homeStanding = newStandings.find(s => s.team._id === homeTeam._id)!;
      const awayStanding = newStandings.find(s => s.team._id === awayTeam._id)!;

      homeStanding.played++;
      awayStanding.played++;
      homeStanding.goalsFor += homeScore;
      homeStanding.goalsAgainst += awayScore;
      awayStanding.goalsFor += awayScore;
      awayStanding.goalsAgainst += homeScore;

      if (homeScore > awayScore) {
        homeStanding.won++;
        homeStanding.points += 3;
        awayStanding.lost++;
      } else if (homeScore < awayScore) {
        awayStanding.won++;
        awayStanding.points += 3;
        homeStanding.lost++;
      } else {
        homeStanding.drawn++;
        awayStanding.drawn++;
        homeStanding.points++;
        awayStanding.points++;
      }

      return newStandings.sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
    });

    setTournamentMatches(prevMatches => {
      return prevMatches.map(match => {
        if (match.homeTeam._id === homeTeam._id && match.awayTeam._id === awayTeam._id) {
          return { ...match, homeScore, awayScore, played: true };
        }
        return match;
      });
    });
  };

  const simulateMatch = () => {
    if (!match.homeTeam || !match.awayTeam) return;

    setMatch(prev => ({ ...prev, status: 'in-progress', events: [], homeScore: 0, awayScore: 0 }));
    setCurrentMinute(0);

    const intervalTime = (matchDuration * 1000) / 90;

    for (let minute = 1; minute <= 90; minute++) {
      setTimeout(() => {
        setCurrentMinute(minute);
        setMatch(prev => {
          const newEvents = [...prev.events];
          let homeScore = prev.homeScore;
          let awayScore = prev.awayScore;

          if (Math.random() < 0.05) {
            const homeAdvantage = prev.homeTeam!.overallRating - prev.awayTeam!.overallRating + 5;
            const scorer = Math.random() * 100 < (50 + homeAdvantage / 2) ? 'home' : 'away';
            
            if (scorer === 'home') {
              homeScore++;
              const scoringPlayer = getRandomPlayer(prev.homeTeam!);
              newEvents.push(`${minute}' - GOAL! ${scoringPlayer.name} scores for ${prev.homeTeam!.name}!`);
            } else {
              awayScore++;
              const scoringPlayer = getRandomPlayer(prev.awayTeam!);
              newEvents.push(`${minute}' - GOAL! ${scoringPlayer.name} scores for ${prev.awayTeam!.name}!`);
            }
          }

          if (minute === 90) {
            const result = homeScore > awayScore 
              ? `${prev.homeTeam!.name} wins!` 
              : homeScore < awayScore 
                ? `${prev.awayTeam!.name} wins!` 
                : "It's a draw!";
            newEvents.push(`Full Time: ${result}`);
          }

          return {
            ...prev,
            homeScore,
            awayScore,
            events: newEvents,
            status: minute === 90 ? 'completed' : 'in-progress'
          };
        });

        if (minute === 90 && isTournamentMode) {
          setTimeout(() => {
            updateTournamentStandings(match.homeTeam!, match.awayTeam!, match.homeScore, match.awayScore);
            playNextTournamentMatch();
          }, 2000);
        }
      }, minute * intervalTime);
    }
  };

  const resetMatch = () => {
    setMatch({
      homeTeam: null,
      awayTeam: null,
      homeScore: 0,
      awayScore: 0,
      status: 'pre-match',
      events: []
    });
    setCurrentMinute(0);
  };

  const toggleMode = () => {
    setIsTournamentMode(!isTournamentMode);
    resetMatch();
    setTournamentMatches([]);
    setTournamentStandings([]);
  };

  return (
    <div className={styles.matchContainer}>
      <h1 className={styles.matchTitle}>Inazuma Eleven Match Simulation</h1>
      
      <button onClick={toggleMode} className={styles.modeToggle}>
        {isTournamentMode ? "Switch to Normal Mode" : "Switch to Tournament Mode"}
      </button>

      {!isTournamentMode ? (
        <>
          <div className={styles.teamSelection}>
            <select onChange={(e) => selectTeam(teams.find(t => t._id === e.target.value)!, true)}>
              <option value="">Select Home Team</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
            <select onChange={(e) => selectTeam(teams.find(t => t._id === e.target.value)!, false)}>
              <option value="">Select Away Team</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.matchSettings}>
            <label>
              Match Duration:
              <select value={matchDuration} onChange={(e) => setMatchDuration(Number(e.target.value))}>
                <option value="9">9 seconds</option>
                <option value="20">20 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
              </select>
            </label>
          </div>
          {match.homeTeam && match.awayTeam && match.status === 'pre-match' && (
            <button onClick={simulateMatch} className={styles.simulateButton}>Start Match</button>
          )}
        </>
      ) : (
        <div className={styles.tournamentMode}>
          <h2>Tournament Mode</h2>
          {tournamentMatches.length === 0 ? (
            <button onClick={startTournament} className={styles.simulateButton}>Start Tournament</button>
          ) : (
            <>
              <button onClick={simulateMatch} className={styles.simulateButton}>Play Next Match</button>
              
              <h3>Standings</h3>
              <table className={styles.standingsTable}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {tournamentStandings.map(standing => (
                    <tr key={standing.team._id}>
                      <td>{standing.team.name}</td>
                      <td>{standing.played}</td>
                      <td>{standing.won}</td>
                      <td>{standing.drawn}</td>
                      <td>{standing.lost}</td>
                      <td>{standing.goalsFor}</td>
                      <td>{standing.goalsAgainst}</td>
                      <td>{standing.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {match.status !== 'pre-match' && (
        <div className={styles.matchDisplay}>
          <div className={styles.matchInfo}>
            <div className={styles.team}>
              <h2>{match.homeTeam?.name}</h2>
              <p>Rating: {match.homeTeam?.overallRating}</p>
            </div>
            <div className={styles.scoreAndTimer}>
              <div className={styles.score}>
                <span>{match.homeScore}</span>
                <span> - </span>
                <span>{match.awayScore}</span>
              </div>
              <div className={styles.matchTimer}>
                {currentMinute}'
              </div>
            </div>
            <div className={styles.team}>
              <h2>{match.awayTeam?.name}</h2>
              <p>Rating: {match.awayTeam?.overallRating}</p>
            </div>
          </div>

          <div className={styles.matchStatus}>
            Status: {match.status}
          </div>

          <div className={styles.eventLog}>
            {match.events.map((event, index) => (
              <p key={index}>{event}</p>
            ))}
          </div>
        </div>
      )}

      {match.status === 'completed' && !isTournamentMode && (
        <button onClick={resetMatch} className={styles.simulateButton}>Simulate New Match</button>
      )}
    </div>
  );
};

export default Match;