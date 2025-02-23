import { Router } from 'express';
import { addProduct, orderItem, getAllDashboardItems } from './service.js';

const router = Router();

router.post("/save", addProduct);
router.get('/dashboard', getAllDashboardItems)
router.post('/order', orderItem);

export default router;