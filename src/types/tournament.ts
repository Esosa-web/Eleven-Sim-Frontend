import { Team } from '../types/team';

export interface TournamentMatch {
  id: string;
  round: number;
  position: number;
  homeTeam: Team | null;
  awayTeam: Team | null;
  homeScore?: number;
  awayScore?: number;
  winner?: Team;
  played: boolean;
}