import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

// Create reusable transporter object using SMTP configuration
export const createTransporter = () => {
  const { host, port, secure, user, pass } = config.smtp;

  if (!user || !pass) {
    console.warn('⚠️ SMTP credentials not fully configured. Email service disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for 587
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false // avoids self-signed / local proxy cert issues
    }
  });
};

let transporter = createTransporter();

// Verify SMTP connection
export const verifySmtpConnection = async () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  if (!transporter) {
    return false;
  }
  try {
    await transporter.verify();
    console.log(`📧 SMTP Email Server connected successfully (${config.smtp.user})`);
    return true;
  } catch (error) {
    console.error(`⚠️ SMTP Connection Error:`, error.message);
    return false;
  }
};

/**
 * Generate beautifully styled HTML template for Order Confirmation
 */
export const generateOrderEmailHtml = (order) => {
  const { orderRef, customer, items, subtotal, deliveryFee, total, createdAt } = order;
  const customerName = customer?.fullName || 'Valued Customer';
  const customerPhone = customer?.mobileNumber || customer?.phone || 'N/A';
  const customerAddress = customer?.address || '';
  const customerDistrict = customer?.district || '';
  const customerState = customer?.state || 'Tamil Nadu';
  const customerPin = customer?.pincode ? ` - ${customer.pincode}` : '';
  const fullAddress = `${customerAddress}, ${customerDistrict}, ${customerState}${customerPin}`;

  const formattedDate = new Date(createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsRows = (items || []).map((item, idx) => {
    const itemTotal = item.itemTotal || (item.price * item.quantity);
    return `
      <tr style="border-bottom: 1px solid #E5E7EB; font-size: 13px;">
        <td style="padding: 10px 8px; color: #111827; font-weight: 600;">
          ${idx + 1}. ${item.name}
        </td>
        <td style="padding: 10px 8px; text-align: center; color: #4B5563;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 8px; text-align: right; color: #4B5563;">
          ₹${item.price}
        </td>
        <td style="padding: 10px 8px; text-align: right; color: #0D5C3A; font-weight: 700;">
          ₹${itemTotal}
        </td>
      </tr>
    `;
  }).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Sri Natchiyar Crackers</title>
  </head>
  <body style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F3F4F6; margin: 0; padding: 20px; color: #1F2937;">
    <div style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
      
      <!-- Brand Header -->
      <div style="background: linear-gradient(135deg, #073822 0%, #0D5C3A 50%, #15803D 100%); padding: 24px; text-align: center; color: #FFFFFF;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.5px;">
          SRI NATCHIYAR CRACKERS
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #FEF08A; font-weight: bold;">
          ஸ்ரீ நாச்சியார் பட்டாசு கடை • சிவகாசி நேரடி விற்பனை
        </p>
        <div style="display: inline-block; background-color: #25D366; color: #FFFFFF; padding: 5px 14px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-top: 12px; letter-spacing: 0.5px;">
          ✓ Order Confirmation • ஆணை உறுதி செய்யப்பட்டது
        </div>
      </div>

      <!-- Main Body -->
      <div style="padding: 24px;">
        <p style="font-size: 15px; line-height: 1.5; margin-top: 0; color: #374151;">
          Dear <strong>${customerName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">
          Thank you for ordering with <strong>Sri Natchiyar Crackers</strong>! Your Diwali festival order has been successfully registered directly with our Sivakasi headquarters. Our dispatch desk is preparing your licensed explosives parcel booking.
        </p>

        <!-- Order Summary Card -->
        <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 14px 18px; margin: 18px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #166534; font-weight: bold;">Order Reference:</td>
              <td style="text-align: right; font-weight: 800; color: #0D5C3A; font-family: monospace; font-size: 15px;">
                ${orderRef}
              </td>
            </tr>
            <tr>
              <td style="color: #4B5563; padding-top: 6px;">Booking Date:</td>
              <td style="text-align: right; color: #4B5563; padding-top: 6px;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="color: #4B5563; padding-top: 6px;">Dispatch Status:</td>
              <td style="text-align: right; color: #0D5C3A; font-weight: bold; padding-top: 6px;">Awaiting Transport Confirmation</td>
            </tr>
          </table>
        </div>

        <!-- Customer & Delivery Destination Details -->
        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px 18px; margin: 18px 0; font-size: 13px;">
          <h3 style="margin: 0 0 10px 0; font-size: 13px; color: #0D5C3A; text-transform: uppercase; letter-spacing: 0.5px;">
            📍 Delivery &amp; Contact Details
          </h3>
          <p style="margin: 3px 0; color: #111827;"><strong>Name:</strong> ${customerName}</p>
          <p style="margin: 3px 0; color: #111827;"><strong>Phone / WhatsApp:</strong> ${customerPhone}</p>
          <p style="margin: 3px 0; color: #111827;"><strong>Destination Address:</strong> ${fullAddress}</p>
        </div>

        <!-- Items Table -->
        <h3 style="margin: 22px 0 8px 0; font-size: 14px; color: #111827; text-transform: uppercase; letter-spacing: 0.5px;">
          🎆 Ordered Fireworks Items (${(items || []).length})
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr style="background-color: #0D5C3A; color: #FFFFFF; font-size: 12px; text-transform: uppercase;">
              <th style="padding: 8px; text-align: left; border-top-left-radius: 6px;">Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
              <th style="padding: 8px; text-align: right; border-top-right-radius: 6px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <!-- Totals Calculation -->
        <div style="background-color: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #6B7280; padding: 3px 0;">Items Subtotal:</td>
              <td style="text-align: right; font-weight: 600; color: #374151;">₹${subtotal}</td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 3px 0;">Transport / Hub Delivery Fee:</td>
              <td style="text-align: right; font-weight: 600; color: #374151;">
                ${deliveryFee > 0 ? `₹${deliveryFee}` : '<span style="color: #15803D; font-weight: bold;">FREE</span>'}
              </td>
            </tr>
            <tr style="border-top: 1px solid #D8B4FE; font-size: 16px;">
              <td style="padding-top: 8px; font-weight: bold; color: #0D5C3A;">Total Order Value:</td>
              <td style="text-align: right; font-weight: 900; color: #0D5C3A; padding-top: 8px;">₹${total}</td>
            </tr>
          </table>
        </div>

        <!-- Next Steps Banner -->
        <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 6px 0; color: #92400E; font-size: 13px;">📋 Next Steps &amp; Transport Dispatch:</h4>
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #78350F;">
            Our Sivakasi logistics desk will contact you via WhatsApp/Phone to confirm your authorized nearest transport parcel hub, dispatch LR (Lorry Receipt) waybill number, and delivery schedule.
          </p>
        </div>

        <!-- Sivakasi Direct Contact -->
        <div style="text-align: center; padding-top: 8px;">
          <p style="font-size: 13px; color: #4B5563; margin-bottom: 12px;">Need immediate dispatch assistance or status update?</p>
          <a href="https://wa.me/919994100905?text=Hi%20Sri%20Natchiyar%20Crackers%2C%20checking%20status%20for%20order%20ref%3A%20${orderRef}"
             style="display: inline-block; background-color: #25D366; color: #FFFFFF; text-decoration: none; font-weight: bold; font-size: 13px; padding: 10px 22px; border-radius: 8px; margin: 4px;">
            💬 WhatsApp: +91 99941 00905
          </a>
          <a href="tel:9994100905"
             style="display: inline-block; background-color: #0D5C3A; color: #FFFFFF; text-decoration: none; font-weight: bold; font-size: 13px; padding: 10px 22px; border-radius: 8px; margin: 4px;">
            📞 Call: 99941 00905 / 94427 01264
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #111827; color: #9CA3AF; padding: 18px 24px; text-align: center; font-size: 11px; line-height: 1.6;">
        <p style="margin: 0 0 4px 0; color: #FFFFFF; font-weight: bold;">
          SRI NATCHIYAR CRACKERS • சிவகாசி நேரடி விற்பனை
        </p>
        <p style="margin: 0;">
          Sivakasi Main Road, Virudhunagar District, Tamil Nadu – 626123
        </p>
        <p style="margin: 6px 0 0 0; color: #6EE7B7;">
          ✓ 100% PESO Green Crackers Compliant • Licensed Explosives Transport Dispatch
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Send Order Confirmation Email to Customer and Admin
 */
export const sendOrderConfirmationEmail = async (order) => {
  if (!transporter) {
    transporter = createTransporter();
  }
  if (!transporter) {
    console.warn('⚠️ SMTP Transporter unavailable. Skipping email delivery.');
    return { success: false, reason: 'SMTP not configured' };
  }

  const { fromName, fromAddress, user } = config.smtp;
  const adminEmail = user || 'hellosuman29@gmail.com';
  const customerEmail = order.customer?.email?.trim();
  const htmlContent = generateOrderEmailHtml(order);

  // Determine recipients
  const recipients = [];
  if (customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    recipients.push(customerEmail);
  }
  // Always include admin
  if (!recipients.includes(adminEmail)) {
    recipients.push(adminEmail);
  }

  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to: recipients.join(', '),
    subject: `🎆 Order Confirmed [${order.orderRef}] - Sri Natchiyar Crackers Sivakasi`,
    html: htmlContent,
    text: `Your order ${order.orderRef} has been confirmed by Sri Natchiyar Crackers! Total: ₹${order.total}. Customer: ${order.customer?.fullName} (${order.customer?.mobileNumber || order.customer?.phone}). Destination: ${order.customer?.address}, ${order.customer?.district}. For queries call: +91 9994100905.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent successfully for ${order.orderRef} to: ${recipients.join(', ')} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId, recipients };
  } catch (error) {
    console.error(`❌ Failed to send order confirmation email for ${order.orderRef}:`, error.message);
    return { success: false, error: error.message };
  }
};

export default {
  createTransporter,
  verifySmtpConnection,
  generateOrderEmailHtml,
  sendOrderConfirmationEmail
};
