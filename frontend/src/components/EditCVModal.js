import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';

function EditCVModal({ isOpen, onClose, cv, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    age: '',
    cin: '',
    job: '',
  });

  // Initialize form data when the modal opens
  useEffect(() => {
    if (cv && isOpen) {
      setFormData({
        name: cv.name || '',
        firstname: cv.firstname || '',
        age: cv.age || '',
        cin: cv.cin || '',
        job: cv.job || '',
      });
    }
  }, [cv, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData); // Pass the updated data to the parent component
    onClose(); // Close the modal
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit CV</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Firstname</FormLabel>
              <Input
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Age</FormLabel>
              <Input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>CIN</FormLabel>
              <Input
                name="cin"
                value={formData.cin}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Job</FormLabel>
              <Input
                name="job"
                value={formData.job}
                onChange={handleChange}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave} mr={3}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditCVModal;