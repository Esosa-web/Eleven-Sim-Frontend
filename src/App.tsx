import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { TournamentProvider } from './contexts/TournamentContext';
import Home from './components/Home';
import Teams from './components/Teams';
import TeamDetails from './components/TeamDetails';
import Players from './components/Players';
import PlayerDetails from './components/PlayerDetails';
import Match from './components/Match';
import TournamentCreator from './components/tournament/TournamentCreator';
import TournamentBracket from './components/tournament/TournamentBracket';
import 'bulma/css/bulma.min.css';
import './styles/custom.css';
import './styles/App.css';

const Navbar = () => (
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <Link to="/" className="navbar-item">
        <strong>ElevenSim</strong>
      </Link>
    </div>
    <div className="navbar-menu">
      <div className="navbar-start">
        <Link to="/" className="navbar-item">Home</Link>
        <Link to="/teams" className="navbar-item">Teams</Link>
        <Link to="/players" className="navbar-item">Players</Link>
        <Link to="/match" className="navbar-item">Match</Link>
        <Link to="/tournament" className="navbar-item">Tournament</Link>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <TournamentProvider>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetails />} />
              <Route path="/players" element={<Players />} />
              <Route path="/players/:id" element={<PlayerDetails />} />
              <Route path="/match" element={<Match />} />
              <Route path="/tournament" element={<TournamentCreator />} />
              <Route path="/tournament/bracket" element={<TournamentBracket />} />
            </Routes>
          </main>
        </div>
      </TournamentProvider>
    </Router>
  );
}

export default App;