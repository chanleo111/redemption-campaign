'use client'; 
import React, { useState} from 'react';
import axios from 'axios';

function AIChatBot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const result = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }],
      },
      {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
          'Content-Type': 'application/json',
        },
      }
    );
    setResponse(result.data.choices[0].message.content);
  };

  return (
    <div class="chatBox">
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit}>發送</button>
      <p>AI 回覆: {response}</p>
    </div>
  );
}

export default AIChatBot;