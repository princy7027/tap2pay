import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../Controller/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/getProducts', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export const productRoutes = router