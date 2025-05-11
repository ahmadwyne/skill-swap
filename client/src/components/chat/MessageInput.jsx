// src/components/chat/MessageInput.jsx
import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { AiOutlineLink } from 'react-icons/ai';
import { FiX } from 'react-icons/fi'; // Red cross icon

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = React.createRef(); // Reference to file input

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const filePreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(filePreviewUrl); // Create the preview URL
    }
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleAttachLink = () => {
    setShowLinkInput(true);  // Show the link input field
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null); // Remove file preview
    fileInputRef.current.value = ''; // Clear the file input field
  };

  const handleSendMessage = () => {
    if (message.trim() === '' && !file && !link) {
      console.log('No message, file, or link to send');
      return;  // Exit early if no message, file, or link
    }

    // Format the link by ensuring it starts with "http://" or "https://"
    let finalMessage = message;

    if (link) {
      // If the link does not start with "http://" or "https://", add "http://"
      const formattedLink = !link.startsWith('http://') && !link.startsWith('https://')
        ? `http://${link}`
        : link;

      // Convert the entered link to a clickable hyperlink
      finalMessage += ` <a href="${formattedLink}" target="_blank" rel="noopener noreferrer">${formattedLink}</a>`;

      // Update the link state after formatting
      setLink(formattedLink);
    }

    // Send both the message and the link separately
    sendMessage(finalMessage, file, link);

    // Clear inputs after sending
    setMessage('');
    setLink('');
    setFile(null);
    setPreviewUrl(null);
    setShowLinkInput(false);
    fileInputRef.current.value = ''; // Clear the file input field
  };

  return (
    <div className="message-input flex flex-wrap gap-2 items-center p-4 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-300 rounded-lg shadow-md w-full">

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 min-w-[150px] p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
      />

      <input
        ref={fileInputRef} // Attach reference here
        type="file"
        accept="image/*,video/*,audio/*"
        onChange={handleFileChange}
        className="p-2 border-2 border-gray-300 rounded-lg cursor-pointer max-w-[160px] text-sm"
      />

      {previewUrl && (
        <div className="preview mt-2 flex items-center">
          <div className="file-preview-container flex items-center mr-2">
            {file && file.type.startsWith('image') && <img src={previewUrl} alt="Preview" className="max-w-xs rounded-lg shadow-md" />}
            {file && file.type.startsWith('video') && <video src={previewUrl} controls className="max-w-xs rounded-lg shadow-md" />}
            {file && file.type.startsWith('audio') && <audio src={previewUrl} controls className="max-w-xs rounded-lg shadow-md" />}
          </div>
          <button
            onClick={handleRemoveFile}
            className="ml-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition duration-300 ease-in-out"
          >
            <FiX className="text-white text-xl" />
          </button>
        </div>
      )}

      <button
        onClick={handleAttachLink}
        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        <AiOutlineLink className="text-white text-xl" />
      </button>
      {showLinkInput && (
        <input
          type="text"
          value={link}
          onChange={handleLinkChange}
          placeholder="Enter a URL"
          className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
        />
      )}

      <button
        onClick={handleSendMessage}
        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        <FaPaperPlane className="text-white text-xl" />
      </button>

    </div>
  );
};

export default MessageInput;
