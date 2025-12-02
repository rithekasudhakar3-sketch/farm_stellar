const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// User routes
router.post('/', authMiddleware, purchaseOrderController.createPurchaseOrder);
router.get('/my-orders', authMiddleware, purchaseOrderController.getUserPurchaseOrders);
router.get('/:orderId', authMiddleware, purchaseOrderController.getPurchaseOrderById);
router.get('/:orderId/bill', authMiddleware, purchaseOrderController.getBill);

// Admin routes
router.get('/admin/pending', adminMiddleware, purchaseOrderController.getPendingOrders);
router.get('/admin/all', adminMiddleware, purchaseOrderController.getAllOrders);
router.post('/admin/:orderId/approve', adminMiddleware, purchaseOrderController.approvePurchaseOrder);
router.post('/admin/:orderId/reject', adminMiddleware, purchaseOrderController.rejectPurchaseOrder);
router.post('/admin/:orderId/deliver', adminMiddleware, purchaseOrderController.markAsDelivered);
router.get('/admin/:orderId/bill', adminMiddleware, purchaseOrderController.getBill);

module.exports = router;
