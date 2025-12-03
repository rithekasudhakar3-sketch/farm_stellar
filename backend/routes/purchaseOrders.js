const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');
const authMiddleware = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminAuth');

// User routes
router.post('/', authMiddleware, purchaseOrderController.createPurchaseOrder);
router.get('/my-orders', authMiddleware, purchaseOrderController.getUserPurchaseOrders);
router.get('/:orderId', authMiddleware, purchaseOrderController.getPurchaseOrderById);
router.get('/:orderId/bill', authMiddleware, purchaseOrderController.getBill);

// Admin routes
router.get('/admin/pending', verifyAdmin, purchaseOrderController.getPendingOrders);
router.get('/admin/all', verifyAdmin, purchaseOrderController.getAllOrders);
router.post('/admin/:orderId/approve', verifyAdmin, purchaseOrderController.approvePurchaseOrder);
router.post('/admin/:orderId/reject', verifyAdmin, purchaseOrderController.rejectPurchaseOrder);
router.post('/admin/:orderId/deliver', verifyAdmin, purchaseOrderController.markAsDelivered);
router.get('/admin/:orderId/bill', verifyAdmin, purchaseOrderController.getBill);

module.exports = router;
