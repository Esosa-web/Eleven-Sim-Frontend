export interface Team {
    _id: string;
    name: string;
    formation: string;
    overallRating: number;
    stats: {
      attack: number;
      defense: number;
      teamwork: number;
    };
    players: string[];
  }