const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        itemId: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        xpCost: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        icon: { type: String }
    }],
    totalXP: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'delivered'],
        default: 'pending'
    },
    deliveryAddress: {
        name: { type: String },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String }
    },
    notes: { type: String },

    // Admin actions
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    reviewedAt: { type: Date },
    adminNotes: { type: String },

    // Bill details
    billNumber: { type: String, unique: true, sparse: true },
    billGeneratedAt: { type: Date },
    billUrl: { type: String },

    // Delivery tracking
    deliveryStatus: { type: String },
    deliveredAt: { type: Date },
    trackingNumber: { type: String }
}, { timestamps: true });

// Generate bill number before saving
PurchaseOrderSchema.pre('save', async function (next) {
    if (this.isNew || (this.status === 'approved' && !this.billNumber)) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const count = await this.constructor.countDocuments({
            createdAt: { $gte: new Date(year, date.getMonth(), 1) }
        });
        this.billNumber = `FS-${year}${month}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
