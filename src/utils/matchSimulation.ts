import { Team } from '../types/team';

interface MatchResult {
  homeScore: number;
  awayScore: number;
  winner: Team;
}

export const simulateMatch = (homeTeam: Team, awayTeam: Team): MatchResult => {
  // Calculate base scores from team stats
  const homeAttackStrength = homeTeam.stats.attack * 0.4 + homeTeam.stats.teamwork * 0.2;
  const homeDefenseStrength = homeTeam.stats.defense * 0.4;
  const awayAttackStrength = awayTeam.stats.attack * 0.4 + awayTeam.stats.teamwork * 0.2;
  const awayDefenseStrength = awayTeam.stats.defense * 0.4;

  // Add randomness factor (between 0.8 and 1.2)
  const randomFactor = () => 0.8 + Math.random() * 0.4;

  // Calculate scores
  let homeScore = Math.max(0, Math.floor((homeAttackStrength * randomFactor() - awayDefenseStrength * randomFactor()) / 15));
  let awayScore = Math.max(0, Math.floor((awayAttackStrength * randomFactor() - homeDefenseStrength * randomFactor()) / 15));

  // Ensure we have a winner in tournament matches (no draws)
  if (homeScore === awayScore) {
    if (Math.random() > 0.5) {
      homeScore += 1;
    } else {
      awayScore += 1;
    }
  }

  // Determine winner
  const winner = homeScore > awayScore ? homeTeam : awayTeam;

  return {
    homeScore,
    awayScore,
    winner
  };
}; 