import React, { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3030/auth/login', {
        username,
        password,
      });

      // Save the access token (optional, for future API requests)
      localStorage.setItem('accessToken', response.data.accessToken);

      // Redirect to the CV list page
      navigate('/cvs');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign-in failed. Please try again.');
      console.error('Sign In Error:', err);
    }
  };

  return (
    <Box
      textAlign="center"
      bg="gray.100"
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Heading as="h1" size="xl" mb={6}>
        Sign In
      </Heading>
      <Box as="form" onSubmit={handleSignIn} width="100%" maxW="400px">
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" size="lg" width="100%">
            Sign In
          </Button>
        </VStack>
        {error && (
          <Text color="red.500" mt={4}>
            {error}
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default SignInPage;