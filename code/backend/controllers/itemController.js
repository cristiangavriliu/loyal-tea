import express from "express";
import { Item } from "../models/itemModel.js";
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage: storage });

// Routes
router.post("/create", upload.single('image'), createItem);
router.get("/getAll", getAllItems);
router.get("/get/:id", getByID);
router.put("/update/:id", upload.single('image'), updateItem);
router.delete("/delete/:id", deleteItem);
router.post('/getMultiple', getMultipleItems);

// Methods

// Create a new item
async function createItem(req, res) {
  console.log('Creating Item')
  try {
    const { price, allergens, name, category } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    const newItem = new Item({
      price,
      category,
      allergens,
      name,
      imageLink: imageUrl

    });

    const result = await newItem.save();
    console.log('finished creating Item')

    return res.status(201).send(result);
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: 'Error creating item', error });
  }
}

// Get all items
async function getAllItems(req, res) {
  try {
    const items = await Item.find();
    return res.status(200).send(items);
  } catch (error) {
    return res.status(500).send({ message: 'Error fetching items', error });
  }
}

// Get an item by ID
async function getByID(req, res) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    return res.status(200).send(item);
  } catch (error) {
    return res.status(500).send({ message: 'Error fetching item', error });
  }
}

// Update an item
async function updateItem(req, res) {
  try {
    const { price, allergens, name } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    const updatedData = { price, allergens, name };
    if (imageUrl) {
      updatedData.imageLink = imageUrl;
    }

    const item = await Item.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    return res.status(200).send(item);
  } catch (error) {
    return res.status(500).send({ message: 'Error updating item', error });
  }
}

// Delete an item
async function deleteItem(req, res) {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    return res.status(200).send(item);
  } catch (error) {
    return res.status(500).send({ message: 'Error deleting item', error });
  }
}

// Fetch multiple items by their IDs
async function getMultipleItems(req, res) {
  try {
    const { ids } = req.body;
    const items = await Item.find({ _id: { $in: ids } });
    return res.status(200).send(items);
  } catch (error) {
    return res.status(500).send({ message: 'Error fetching items', error });
  }
}

export default router;
