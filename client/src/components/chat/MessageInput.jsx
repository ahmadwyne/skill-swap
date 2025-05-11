// src/components/chat/MessageInput.jsx
import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { AiOutlineLink } from 'react-icons/ai';

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const filePreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(filePreviewUrl);
    }
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleAttachLink = () => {
    setShowLinkInput(true);  // Show the link input field
  };

  const handleSendMessage = () => {
    if (message.trim() === '' && !file && !link) {
      console.log('No message, file, or link to send');
      return;  // Exit early if no message, file, or link
    }

    // Send both the message and the link separately
    sendMessage(message, file, link);

    // Clear inputs after sending
    setMessage('');
    setLink('');
    setFile(null);
    setPreviewUrl(null);
    setShowLinkInput(false);
  };

  return (
    <div className="message-input flex items-center p-4 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-300 rounded-lg shadow-md">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
      />
      <input
        type="file"
        accept="image/*,video/*,audio/*"
        onChange={handleFileChange}
        className="ml-2 p-2 border-2 border-gray-300 rounded-lg cursor-pointer"
      />
      <button
        onClick={handleAttachLink}
        className="ml-2 bg-blue-600 text-white p-2 placeholder-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
      >
       <AiOutlineLink className="text-white text-xl" />
      </button>

      {showLinkInput && (
        <input
          type="text"
          value={link}
          onChange={handleLinkChange}
          placeholder="Enter a URL"
          className="ml-2 p-2 border-2 placeholder-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {previewUrl && (
        <div className="preview mt-2">
          {file && file.type.startsWith('image') && <img src={previewUrl} alt="Preview" className="max-w-xs rounded-lg shadow-md" />}
          {file && file.type.startsWith('video') && <video src={previewUrl} controls className="max-w-xs rounded-lg shadow-md" />}
          {file && file.type.startsWith('audio') && <audio src={previewUrl} controls className="max-w-xs rounded-lg shadow-md" />}
        </div>
      )}

      <button
        onClick={handleSendMessage}
        className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
      >
       <FaPaperPlane className="text-white text-xl" />
      </button>
    </div>
  );
};

export default MessageInput;
