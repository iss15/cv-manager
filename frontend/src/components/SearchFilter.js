import React from 'react';
import { Flex, Input, Button } from '@chakra-ui/react';

function SearchFilter({ searchQuery, setSearchQuery, onSearch, onReset }) {
  return (
    <Flex mb={6} gap={4} align="center">
      <Input
        placeholder="Search by name, firstname or job..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button colorScheme="blue" onClick={onSearch}>
        Filter
      </Button>
      <Button onClick={onReset}>Reset</Button>
    </Flex>
  );
}

export default SearchFilter;