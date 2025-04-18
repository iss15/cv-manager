import React, { useEffect, useState } from 'react';
import { Box, Spinner, Text, Button, Input, Flex } from '@chakra-ui/react';
import axios from 'axios';
import Header from '../components/Header';
import SearchFilter from '../components/SearchFilter';
import CVTable from '../components/CVTable';
import CVModal from '../components/CVModal';
import EditCVModal from '../components/EditCVModal';

function CVListPage() {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCv, setSelectedCv] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ageFilter, setAgeFilter] = useState(''); // New state for age filter
  const [filteredCvs, setFilteredCvs] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1); // Current page
  const [limit] = useState(6); // Items per page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  useEffect(() => {
    const fetchCVs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:3030/v2/cv', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
          },
        });

        setCvs(response.data.items || []); // Use `items` from the response
        setFilteredCvs(response.data.items || []);
        setTotalPages(Math.ceil(response.data.total / limit)); // Calculate total pages
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CVs:', err);
        setError('Failed to fetch CVs. Please try again.');
        setLoading(false);
      }
    };

    fetchCVs();
  }, [page, limit]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3030/v2/cv', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: searchQuery, // Pass the search query to the backend
          age: ageFilter, // Pass the age filter to the backend
          page,
          limit,
        },
      });

      setFilteredCvs(response.data.items || []); // Update the filtered CVs with the backend response
      setTotalPages(Math.ceil(response.data.total / limit)); // Update the total pages
      setPage(1); // Reset to the first page after filtering
    } catch (err) {
      console.error('Error fetching filtered CVs:', err);
      setError('Failed to fetch filtered CVs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3030/v2/cv', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
        },
      });

      setSearchQuery(''); // Clear the search query
      setAgeFilter(''); // Clear the age filter
      setCvs(response.data.items || []); // Update the full list of CVs
      setFilteredCvs(response.data.items || []); // Reset the filtered CVs
      setTotalPages(Math.ceil(response.data.total / limit)); // Update the total pages
      setPage(1); // Reset to the first page
    } catch (err) {
      console.error('Error resetting CVs:', err);
      setError('Failed to reset CVs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (cv) => {
    setSelectedCv(cv);
    setIsModalOpen(true);
  };

  const handleEdit = (cv) => {
    setSelectedCv(cv);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedCv) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch(`http://localhost:3030/v2/cv/${selectedCv.id}`, updatedCv, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCvs(cvs.map((cv) => (cv.id === selectedCv.id ? response.data : cv)));
      setFilteredCvs(filteredCvs.map((cv) => (cv.id === selectedCv.id ? response.data : cv)));
    } catch (err) {
      console.error('Failed to update CV:', err);
    }
  };

  const handleDelete = async (cvId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3030/v2/cv/${cvId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCvs(cvs.filter((cv) => cv.id !== cvId));
      setFilteredCvs(filteredCvs.filter((cv) => cv.id !== cvId));
    } catch (err) {
      console.error('Failed to delete CV:', err);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" p={8}>
      {/* Header Section */}
      <Header />

      {/* Search and Filter Section */}
      <Flex mb={4} gap={4}>
        <Input
          placeholder="Search by name, job, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          flex="1" // Full width for the search input
        />
        <Input
          placeholder="Age"
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          type="number"
          w="100px" // Set a fixed width for the age filter input
        />
        <Button onClick={handleSearch} colorScheme="blue">
          Filter
        </Button>
        <Button onClick={handleReset} colorScheme="gray">
          Reset
        </Button>
      </Flex>

      {/* Table Section */}
      {filteredCvs.length > 0 ? (
        <CVTable cvs={filteredCvs} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <Text textAlign="center" color="gray.500">
          No CVs found
        </Text>
      )}

      {/* Pagination Controls */}
      <Box mt={4} textAlign="center">
        <Button onClick={handlePreviousPage} isDisabled={page === 1} mr={2}>
          Previous
        </Button>
        <Button onClick={handleNextPage} isDisabled={page === totalPages}>
          Next
        </Button>
        <Text mt={2}>
          Page {page} of {totalPages}
        </Text>
      </Box>

      {/* View Modal */}
      {selectedCv && (
        <CVModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cv={selectedCv}
        />
      )}

      {/* Edit Modal */}
      {selectedCv && (
        <EditCVModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          cv={selectedCv}
          onSave={handleSave}
        />
      )}
    </Box>
  );
}

export default CVListPage;