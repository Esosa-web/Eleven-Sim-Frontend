import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { TournamentMatch } from 'frontend/src/types/tournament';
import { Team } from 'frontend/src/types/team';

interface TournamentState {
  teams: Team[];
  selectedTeams: Team[];
  matches: TournamentMatch[];
  currentRound: number;
  status: 'setup' | 'in-progress' | 'completed';
}

type TournamentAction =
  | { type: 'SELECT_TEAM'; payload: Team }
  | { type: 'DESELECT_TEAM'; payload: Team }
  | { type: 'SET_MATCHES'; payload: TournamentMatch[] }
  | { type: 'UPDATE_MATCH'; payload: TournamentMatch }
  | { type: 'ADD_MATCH'; payload: TournamentMatch }
  | { type: 'ADVANCE_ROUND' }
  | { type: 'RESET_TOURNAMENT' };

const initialState: TournamentState = {
  teams: [],
  selectedTeams: [],
  matches: [],
  currentRound: 0,
  status: 'setup'
};

function tournamentReducer(state: TournamentState, action: TournamentAction): TournamentState {
  switch (action.type) {
    case 'SELECT_TEAM':
      return {
        ...state,
        selectedTeams: [...state.selectedTeams, action.payload]
      };
    case 'DESELECT_TEAM':
      return {
        ...state,
        selectedTeams: state.selectedTeams.filter(team => team._id !== action.payload._id)
      };
    case 'SET_MATCHES':
      return {
        ...state,
        matches: action.payload,
        status: 'in-progress'
      };
    case 'UPDATE_MATCH':
      console.log('Reducer received UPDATE_MATCH:', {
        payload: action.payload,
        existingMatches: state.matches.map(m => m.id)
      });
      const existingMatch = state.matches.find(match => match.id === action.payload.id);
      return {
        ...state,
        matches: existingMatch 
          ? state.matches.map(match => match.id === action.payload.id ? action.payload : match)
          : [...state.matches, action.payload]
      };
    case 'ADD_MATCH':
      return {
        ...state,
        matches: [...state.matches, action.payload]
      };
    case 'ADVANCE_ROUND':
      return {
        ...state,
        currentRound: state.currentRound + 1
      };
    case 'RESET_TOURNAMENT':
      return initialState;
    default:
      return state;
  }
}

const TournamentContext = createContext<{
  state: TournamentState;
  dispatch: React.Dispatch<TournamentAction>;
} | undefined>(undefined);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tournamentReducer, initialState);

  return (
    <TournamentContext.Provider value={{ state, dispatch }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}