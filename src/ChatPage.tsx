import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from './ChatContext';
import { auth, db, collection, onSnapshot } from './firebase';
import { saveChatHistory } from '../backend/src/firebase';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useContext(ChatContext);
  const navigate = useNavigate();

  useEffect(() => {
    const chatRef = collection(db, 'chatHistory');
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      dispatch({ type: 'SET_MESSAGES', payload: messages });
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      dispatch({ type: 'ADD_MESSAGE', payload: { content: data.response, isBot: true } });
      
      // Save to Firebase
      if (auth.currentUser?.uid) {
        await saveChatHistory(auth.currentUser.uid, message, data.response);
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
