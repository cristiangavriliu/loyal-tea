import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Modal, Form } from 'react-bootstrap';
import { Button} from '@mui/material';
import { allergenOptions, categories } from '../Settings';

const AddItemForm = ({ addItemToList, open, handleClose }) => {
  const [item, setItem] = useState({
    price: '',
    allergens: [],
    name: '',
    imageFile: null,
    imageLink: '',
    category: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submit button state

  // generic change handler (if only I had known earlier)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Validate file type
    if (file && /\.(jpg|jpeg|png)$/i.test(file.name)) {
      setItem((prevItem) => ({
        ...prevItem,
        imageFile: file
      }));
    } else {
      alert('Please select a valid image file (jpg, jpeg, png).');
    }
  };

  // handle allergen change
  const handleAllergenChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setItem((prevItem) => ({
      ...prevItem,
      allergens: selectedValues
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true); // Set submitting state to true

    // Handle image upload
    const formData = new FormData();
    formData.append('image', item.imageFile);
    formData.append('price', item.price);
    item.allergens.forEach(allergen => {
      formData.append('allergens', allergen);
    });
    formData.append('name', item.name);
    formData.append('category', item.category);

    try {
      const response = await axios.post('/items/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const newItem = response.data;
      addItemToList(newItem);
      setItem({
        price: '',
        allergens: [],
        name: '',
        imageFile: null,
        imageLink: '',
        category: ''
      });
      if (response.status === 201) {
        handleClose();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new Item to the Menu</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="e.g. Mate, Espresso, Helles"
                  name="name"
                  value={item.name}
                  onChange={handleChange}
                  required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                  type="number"
                  min="0"
                  placeholder="Enter price"
                  name="price"
                  value={item.price}
                  onChange={handleChange}
                  step="0.01"
                  required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Allergens</Form.Label>
              <Select
                  isMulti
                  options={allergenOptions}
                  classNamePrefix="select"
                  onChange={handleAllergenChange}
                  value={allergenOptions.filter(
                      option => item.allergens.includes(option.value)
                  )}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                  as="select"
                  name="category"
                  value={item.category}
                  onChange={handleChange}
                  required
              >
                <option value="" disabled>Select category</option>
                {categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                  required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color="ColorDelete" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" disableElevation={true} color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
  );
};

export default AddItemForm;