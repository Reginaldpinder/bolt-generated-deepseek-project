import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function saveChatHistory(userId: string, message: string, response: string) {
  try {
    const db = getFirestore();
    const chatRef = collection(db, 'chatHistory');
    const chatId = uuidv4();
    
    await setDoc(doc(chatRef, chatId), {
      userId,
      userMessage: message,
      botResponse: response,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Firebase Error:', error);
  }
}
