const PurchaseOrder = require('../models/PurchaseOrder');
const User = require('../models/User');

// Create a new purchase order (user initiates purchase)
exports.createPurchaseOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in purchase order' });
        }

        // Calculate total XP
        const totalXP = items.reduce((sum, item) => sum + (item.xpCost * (item.quantity || 1)), 0);

        // Check if user has enough XP
        const user = await User.findById(req.user.userId);
        if (user.xp < totalXP) {
            return res.status(400).json({ message: 'Insufficient XP balance' });
        }

        // Create purchase order
        const purchaseOrder = new PurchaseOrder({
            userId: req.user.userId,
            items,
            totalXP,
            deliveryAddress,
            notes,
            status: 'pending'
        });

        await purchaseOrder.save();

        // Reserve XP (deduct but don't add to purchasedRewards yet)
        user.xp -= totalXP;
        await user.save();

        res.status(201).json({
            message: 'Purchase order created successfully. Awaiting admin approval.',
            purchaseOrder,
            updatedXP: user.xp
        });
    } catch (error) {
        console.error('Create purchase order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user's purchase orders
exports.getUserPurchaseOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrder.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Get purchase orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single purchase order
exports.getPurchaseOrderById = async (req, res) => {
    try {
        const order = await PurchaseOrder.findOne({
            _id: req.params.orderId,
            userId: req.user.userId
        });

        if (!order) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error('Get purchase order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all pending purchase orders
exports.getPendingOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrder.find({ status: 'pending' })
            .populate('userId', 'name phone email city')
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Get pending orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all purchase orders
exports.getAllOrders = async (req, res) => {
    try {
        const { status, limit = 50, skip = 0 } = req.query;

        const query = {};
        if (status) query.status = status;

        const orders = await PurchaseOrder.find(query)
            .populate('userId', 'name phone email city')
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await PurchaseOrder.countDocuments(query);

        res.status(200).json({
            orders,
            total,
            hasMore: total > parseInt(skip) + orders.length
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Approve purchase order and generate bill
exports.approvePurchaseOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { adminNotes, trackingNumber } = req.body;

        const order = await PurchaseOrder.findById(orderId).populate('userId');

        if (!order) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order already processed' });
        }

        // Update order status
        order.status = 'approved';
        order.reviewedBy = req.adminId;
        order.reviewedAt = new Date();
        order.adminNotes = adminNotes;
        order.billGeneratedAt = new Date();
        order.trackingNumber = trackingNumber;

        await order.save();

        // Add items to user's purchased rewards
        const user = await User.findById(order.userId);
        const itemIds = order.items.map(item => item.itemId);
        user.purchasedRewards = [...new Set([...(user.purchasedRewards || []), ...itemIds])];
        await user.save();

        res.status(200).json({
            message: 'Purchase order approved and bill generated',
            order,
            billNumber: order.billNumber
        });
    } catch (error) {
        console.error('Approve purchase order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin: Reject purchase order and refund XP
exports.rejectPurchaseOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { adminNotes } = req.body;

        const order = await PurchaseOrder.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order already processed' });
        }

        // Refund XP to user
        const user = await User.findById(order.userId);
        user.xp += order.totalXP;
        await user.save();

        // Update order status
        order.status = 'rejected';
        order.reviewedBy = req.adminId;
        order.reviewedAt = new Date();
        order.adminNotes = adminNotes || 'Order rejected by admin';

        await order.save();

        res.status(200).json({
            message: 'Purchase order rejected and XP refunded',
            order,
            refundedXP: order.totalXP
        });
    } catch (error) {
        console.error('Reject purchase order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin: Mark order as delivered
exports.markAsDelivered = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await PurchaseOrder.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }

        if (order.status !== 'approved') {
            return res.status(400).json({ message: 'Order must be approved first' });
        }

        order.status = 'delivered';
        order.deliveredAt = new Date();
        order.deliveryStatus = 'Delivered';

        await order.save();

        res.status(200).json({
            message: 'Order marked as delivered',
            order
        });
    } catch (error) {
        console.error('Mark as delivered error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get bill HTML for a purchase order
exports.getBill = async (req, res) => {
    try {
        const { orderId } = req.params;
        const billService = require('../services/billService');

        // Check if user is admin or order owner
        const isAdmin = req.adminId !== undefined;
        const userId = isAdmin ? null : req.user.userId;

        const { billHTML, order } = await billService.getBillForOrder(orderId, userId);

        res.setHeader('Content-Type', 'text/html');
        res.send(billHTML);
    } catch (error) {
        console.error('Get bill error:', error);
        res.status(error.message.includes('not found') ? 404 : 400).json({
            message: error.message
        });
    }
};

module.exports = exports;
