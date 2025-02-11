import { createRoot } from 'react-dom/client';
import { ChatProvider } from './ChatContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './ChatPage';
import AboutPage from './AboutPage';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ChatProvider>
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  </ChatProvider>
);
