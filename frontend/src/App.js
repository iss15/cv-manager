import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CVListPage from './pages/CVListPage';
import WelcomePage from './pages/WelcomePage';
import SmolAgentChat from './components/SmolAgentChat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/cvs" element={<CVListPage />} />
        <Route path="/smolagent" element={<SmolAgentChat />} />
      </Routes>
    </Router>
  );
}

export default App;