import React, { useState } from 'react';
import { Box, Input, Button, Text, VStack, HStack } from '@chakra-ui/react';
import axios from 'axios';

function SmolAgentChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // State to store the message history

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    // Add the user's message to the history
    const updatedMessages = [...messages, { sender: 'user', text: message }];
    setMessages(updatedMessages);

    try {
      const res = await axios.post('http://localhost:3030/smolagent/interact', {
        conversation: updatedMessages, // Send the full conversation history
      }); 
      const botResponse = res.data;

      // Add SmolAgent's response to the history
      setMessages((prevMessages) => [...prevMessages, { sender: 'smolagent', text: botResponse }]);
    } catch (err) {
      console.error('Error interacting with SmolAgent:', err);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'smolagent', text: 'Failed to get a response from SmolAgent.' },
      ]);
    } finally {
      setMessage(''); // Clear the input field
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" maxW="400px" mx="auto">
      <VStack spacing={4}>
        {/* Message History */}
        <Box w="100%" maxH="300px" overflowY="auto" p={2} borderWidth="1px" borderRadius="md">
          {messages.map((msg, index) => (
            <HStack
              key={index}
              justify={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
              mb={2}
            >
              <Text
                p={2}
                bg={msg.sender === 'user' ? 'blue.100' : 'gray.100'}
                borderRadius="md"
                maxW="70%"
              >
                {msg.text}
              </Text>
            </HStack>
          ))}
        </Box>

        {/* Input and Send Button */}
        <Input
          placeholder="Ask SmolAgent something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSendMessage} colorScheme="blue">
          Send
        </Button>
      </VStack>
    </Box>
  );
}

export default SmolAgentChat;