// src/components/chat/MessageInput.jsx
import React, { useState } from 'react';

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const filePreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(filePreviewUrl);
    }
  };

  const handleSendMessage = () => {
    console.log('Message to send:', message);
    console.log('File to send:', file);
  
    if (message.trim() === '' && !file) {
      console.log('No message or file to send');
      return;  // Exit early if no message or file
    }
  
    // Send data to parent component
    sendMessage(message, file);  // Pass message and file separately, not as an object
  
    // Clear the input fields after sending the message
    setMessage('');
    setFile(null);
    setPreviewUrl(null);
  };  

  return (
    <div className="message-input flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="file"
        accept="image/*,video/*,audio/*"
        onChange={handleFileChange}
        className="ml-2 p-2 border-2 border-gray-300 rounded-lg"
      />
      {previewUrl && (
        <div className="preview mt-2">
          {file.type.startsWith('image') && <img src={previewUrl} alt="Preview" className="max-w-xs" />}
          {file.type.startsWith('video') && <video src={previewUrl} controls className="max-w-xs" />}
          {file.type.startsWith('audio') && <audio src={previewUrl} controls />}
        </div>
      )}
      <button onClick={handleSendMessage} className="ml-2 bg-blue-600 text-white p-3 rounded-lg">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
