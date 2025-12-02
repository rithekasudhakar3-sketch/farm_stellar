const PurchaseOrder = require('../models/PurchaseOrder');

/**
 * Generate HTML bill for a purchase order
 */
exports.generateBillHTML = (order, user) => {
    const billDate = order.billGeneratedAt || new Date();
    const formattedDate = billDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const itemsHTML = order.items.map((item, index) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${index + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 24px;">${item.icon || '📦'}</span>
          <div>
            <div style="font-weight: 600;">${item.name}</div>
            <div style="font-size: 12px; color: #6b7280;">${item.category}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity || 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.xpCost} XP</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${(item.xpCost * (item.quantity || 1))} XP</td>
    </tr>
  `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bill - ${order.billNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f3f4f6; padding: 20px; }
    .bill-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 32px; font-weight: 800; color: #10b981; margin-bottom: 8px; }
    .tagline { color: #6b7280; font-size: 14px; }
    .bill-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .info-section h3 { font-size: 14px; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-section p { margin-bottom: 4px; color: #111827; }
    .bill-number { font-size: 20px; font-weight: 700; color: #10b981; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    th { background: #f9fafb; padding: 12px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e7eb; }
    .total-section { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-row.grand { font-size: 20px; font-weight: 700; color: #10b981; border-top: 2px solid #10b981; padding-top: 12px; margin-top: 8px; }
    .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-approved { background: #d1fae5; color: #065f46; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
    .notes { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .notes h4 { color: #92400e; margin-bottom: 8px; font-size: 14px; }
    .notes p { color: #78350f; font-size: 13px; line-height: 1.6; }
    @media print {
      body { background: white; padding: 0; }
      .bill-container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="bill-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">🌱 FarmStellar</div>
      <div class="tagline">Gamified Sustainable Farming Platform</div>
    </div>

    <!-- Bill Information -->
    <div class="bill-info">
      <div class="info-section">
        <h3>Bill To</h3>
        <p style="font-weight: 600; font-size: 16px;">${user.name}</p>
        <p>${order.deliveryAddress?.phone || user.phone || 'N/A'}</p>
        <p>${order.deliveryAddress?.address || 'N/A'}</p>
        <p>${order.deliveryAddress?.city || user.city || ''}, ${order.deliveryAddress?.state || ''}</p>
        <p>${order.deliveryAddress?.pincode || ''}</p>
      </div>
      <div class="info-section" style="text-align: right;">
        <div class="bill-number">Bill #${order.billNumber}</div>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></p>
        ${order.trackingNumber ? `<p><strong>Tracking:</strong> ${order.trackingNumber}</p>` : ''}
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th style="width: 50px;">#</th>
          <th>Item</th>
          <th style="width: 80px; text-align: center;">Qty</th>
          <th style="width: 100px; text-align: right;">Unit Cost</th>
          <th style="width: 100px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <!-- Total Section -->
    <div class="total-section">
      <div class="total-row">
        <span>Subtotal</span>
        <span>${order.totalXP} XP</span>
      </div>
      <div class="total-row">
        <span>Discount</span>
        <span>0 XP</span>
      </div>
      <div class="total-row grand">
        <span>GRAND TOTAL</span>
        <span>${order.totalXP} XP</span>
      </div>
    </div>

    ${order.adminNotes ? `
    <div class="notes">
      <h4>📝 Admin Notes</h4>
      <p>${order.adminNotes}</p>
    </div>
    ` : ''}

    ${order.notes ? `
    <div class="notes" style="background: #eff6ff; border-left-color: #3b82f6;">
      <h4>💬 Customer Notes</h4>
      <p>${order.notes}</p>
    </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <p><strong>Thank you for being part of the FarmStellar community!</strong></p>
      <p style="margin-top: 8px;">This is a computer-generated bill and does not require a signature.</p>
      <p style="margin-top: 16px;">For support, contact: support@farmstellar.com | +91-XXXX-XXXXXX</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Get bill HTML for a purchase order
 */
exports.getBillForOrder = async (orderId, userId = null) => {
    try {
        const query = { _id: orderId };
        if (userId) query.userId = userId;

        const order = await PurchaseOrder.findOne(query).populate('userId');

        if (!order) {
            throw new Error('Purchase order not found');
        }

        if (order.status !== 'approved' && order.status !== 'delivered') {
            throw new Error('Bill not available. Order must be approved first.');
        }

        const billHTML = this.generateBillHTML(order, order.userId);
        return { billHTML, order };
    } catch (error) {
        throw error;
    }
};

module.exports = exports;
