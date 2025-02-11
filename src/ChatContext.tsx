import { createContext, useReducer } from 'react';

type Message = {
  content: string;
  isBot: boolean;
};

type ChatAction = {
  type: string;
  payload: { content: string; isBot: boolean };
};

const initialState = {
  messages: [] as Message[],
};

const chatReducer = (state = initialState, action: ChatAction) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};

const ChatContext = createContext(initialState);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export { ChatContext };
