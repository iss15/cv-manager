import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function WelcomePage() {
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
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to the CV Manager App
      </Heading>
      <Text fontSize="lg" mb={6}>
        Manage your CVs and profiles with ease!
      </Text>
      <VStack spacing={4}>
        <Link to="/signin">
          <Button colorScheme="teal" size="lg">
            Sign In
          </Button>
        </Link>
        <Link to="/signup">
          <Button colorScheme="blue" size="lg">
            Sign Up
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}

export default WelcomePage;