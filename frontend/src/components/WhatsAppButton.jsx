import React from 'react';
import ChatBot from './ChatBot';

// Re-export ChatBot for backward compatibility
const WhatsAppButton = (props) => {
  return <ChatBot {...props} />;
};

export default WhatsAppButton;
