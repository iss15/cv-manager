import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';

function CVTable({ cvs, onView, onEdit, onDelete }) {
  return (
    <Box width="100%" maxW="800px" bg="white" p={4} borderRadius="md" shadow="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Firstname</Th>
            <Th>Age</Th>
            <Th>Job</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {cvs.map((cv) => (
            <Tr key={cv.id}>
              <Td>{cv.name}</Td>
              <Td>{cv.firstname}</Td>
              <Td>{cv.age}</Td>
              <Td>{cv.job}</Td>
              <Td>
                <Button colorScheme="blue" size="sm" mr={2} onClick={() => onView(cv)}>
                  View
                </Button>
                <Button colorScheme="yellow" size="sm" mr={2} onClick={() => onEdit(cv)}>
                  Edit
                </Button>
                <Button colorScheme="red" size="sm" onClick={() => onDelete(cv.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default CVTable;