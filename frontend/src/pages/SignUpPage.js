import React, { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, Text } from '@chakra-ui/react';
import axios from 'axios';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3030/auth/register', {
        username,
        email,
        password,
      });
      setSuccess('Sign-up successful! You can now log in.');
      console.log('Sign Up Successful:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Sign-up failed. Please try again.');
      console.error('Sign Up Error:', err);
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
        Sign Up
      </Heading>
      <Box as="form" onSubmit={handleSignUp} width="100%" maxW="400px">
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
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" size="lg" width="100%">
            Sign Up
          </Button>
        </VStack>
        {error && (
          <Text color="red.500" mt={4}>
            {error}
          </Text>
        )}
        {success && (
          <Text color="green.500" mt={4}>
            {success}
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default SignUpPage;