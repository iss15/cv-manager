import React, { useState } from 'react';
import {
  Flex,
  Heading,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra's Drawer control
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    age: '',
    cin: '',
    job: '',
    file: null, // For the CV image
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleDashboard = () => {
    navigate('/cvs'); // Redirect to the dashboard page
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear the user's session
    navigate('/signin'); // Redirect to the login page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');

      // Step 1: Create the CV
      const createCvResponse = await axios.post(
        'http://localhost:3030/v2/cv',
        {
          name: formData.name,
          firstname: formData.firstname,
          age: formData.age,
          cin: formData.cin,
          job: formData.job,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdCv = createCvResponse.data;

      // Step 2: Upload the image (if provided)
      if (formData.file) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.file);

        await axios.post(
          `http://localhost:3030/v2/cv/upload/${createdCv.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      toast({
        title: 'CV created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFormData({ name: '', firstname: '', age: '', cin: '', job: '', file: null }); // Reset form
      onClose(); // Close the drawer
      window.location.reload(); // Reload the page to see the new CV in the list
    } catch (err) {
      toast({
        title: 'Failed to create CV.',
        description: 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading as="h1" size="lg">
          Your CV Dashboard
        </Heading>
        <Flex gap={4}>
          <Button colorScheme="blue" onClick={handleDashboard}>
            Dashboard
          </Button>
          <Button colorScheme="green" onClick={onOpen}>
            New CV
          </Button>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Flex>

      {/* Drawer for New CV */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Create a New CV</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Firstname</FormLabel>
                <Input
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Enter firstname"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Age</FormLabel>
                <Input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>CIN</FormLabel>
                <Input
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  placeholder="Enter CIN"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Job</FormLabel>
                <Input
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  placeholder="Enter job title"
                />
              </FormControl>
              <FormControl >
                <FormLabel>CV Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FormControl>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Submitting"
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Header;