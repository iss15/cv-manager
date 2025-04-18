import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';

function CVModal({ isOpen, onClose, cv }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!cv || !cv.id || !isOpen) return; // Only fetch if modal is open

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
        const response = await axios.get(`http://localhost:3030/v2/cv/image/${cv.id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          responseType: 'blob', // Ensure the response is treated as a binary blob
        });

        const imageUrl = URL.createObjectURL(response.data); // Create a URL for the blob
        setImageSrc(imageUrl); // Set the image source
      } catch (err) {
        console.error('Error fetching the image:', err);
        setError('Failed to load image');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [cv, isOpen]); // Refetch the image when `cv` or `isOpen` changes

  const handleClose = () => {
    setImageSrc(null); // Reset the image source
    onClose(); // Call the parent onClose function
  };

  const handleDownload = () => {
    if (!imageSrc) return;

    const link = document.createElement('a');
    link.href = imageSrc; // Use the blob URL
    link.download = `${cv.name}_${cv.firstname}_CV.jpg`; // Suggested filename
    link.click();
    URL.revokeObjectURL(link.href); // Clean up the URL object
  };

  const handleOpenInNewTab = () => {
    if (!imageSrc) return;

    window.open(imageSrc, '_blank'); // Open the image in a new browser tab
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{cv.name} {cv.firstname}'s CV</ModalHeader>
        <ModalBody>
          <Text><strong>Age:</strong> {cv.age}</Text>
          <Text><strong>CIN:</strong> {cv.cin}</Text>
          <Text><strong>Job:</strong> {cv.job}</Text>
          <Box mt={4}>
            {loading && <Spinner />}
            {error && <Text color="red.500">{error}</Text>}
            {imageSrc && (
              <img
                src={imageSrc}
                alt={`${cv.name}'s CV`}
                style={{ borderRadius: '8px', maxHeight: '300px', objectFit: 'cover' }}
              />
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose} mr={2}>
            Close
          </Button>
          <Button colorScheme="green" onClick={handleDownload} mr={2}>
            Download
          </Button>
          <Button colorScheme="teal" onClick={handleOpenInNewTab}>
            Open in New Tab
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CVModal;