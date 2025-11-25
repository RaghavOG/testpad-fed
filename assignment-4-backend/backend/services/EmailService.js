const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async loadTemplate(templateName) {
    try {
      const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
      const templateContent = await fs.readFile(templatePath, 'utf8');
      return handlebars.compile(templateContent);
    } catch (error) {
      console.error(`Error loading email template ${templateName}:`, error);
      return null;
    }
  }

  async sendEmail(to, subject, templateName, templateData = {}) {
    try {
      const template = await this.loadTemplate(templateName);
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }

      const html = template(templateData);

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  // Order confirmation email
  async sendOrderConfirmation(user, order) {
    const subject = `Order Confirmation - ${order.orderNumber}`;
    const templateData = {
      customerName: `${user.firstName} ${user.lastName}`,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toLocaleDateString(),
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        total: (item.price * item.quantity).toFixed(2)
      })),
      subtotal: order.itemsPrice.toFixed(2),
      shipping: order.shippingPrice.toFixed(2),
      tax: order.taxPrice.toFixed(2),
      total: order.totalPrice.toFixed(2),
      shippingAddress: order.shippingAddress,
      estimatedDelivery: order.estimatedDelivery ? order.estimatedDelivery.toLocaleDateString() : 'TBD',
      trackingUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`,
      supportEmail: process.env.EMAIL_FROM
    };

    return await this.sendEmail(user.email, subject, 'order-confirmation', templateData);
  }

  // Order status update email
  async sendOrderStatusUpdate(user, order, previousStatus) {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      shipped: 'Great news! Your order has been shipped.',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.',
      returned: 'Your return request has been processed.'
    };

    const subject = `Order ${order.orderNumber} - ${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}`;
    const templateData = {
      customerName: `${user.firstName} ${user.lastName}`,
      orderNumber: order.orderNumber,
      currentStatus: order.orderStatus,
      statusMessage: statusMessages[order.orderStatus] || 'Your order status has been updated.',
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      estimatedDelivery: order.estimatedDelivery ? order.estimatedDelivery.toLocaleDateString() : null,
      trackingUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`,
      supportEmail: process.env.EMAIL_FROM
    };

    return await this.sendEmail(user.email, subject, 'order-status-update', templateData);
  }

  // Welcome email for new users
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to ShopHub!';
    const templateData = {
      customerName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      shopUrl: process.env.FRONTEND_URL,
      profileUrl: `${process.env.FRONTEND_URL}/profile`,
      supportEmail: process.env.EMAIL_FROM
    };

    return await this.sendEmail(user.email, subject, 'welcome', templateData);
  }

  // Password reset email
  async sendPasswordReset(user, resetToken) {
    const subject = 'Reset Your Password - ShopHub';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const templateData = {
      customerName: `${user.firstName} ${user.lastName}`,
      resetUrl,
      expiryTime: '1 hour',
      supportEmail: process.env.EMAIL_FROM
    };

    return await this.sendEmail(user.email, subject, 'password-reset', templateData);
  }

  // Low stock alert for admins
  async sendLowStockAlert(adminEmails, products) {
    const subject = 'Low Stock Alert - ShopHub';
    const templateData = {
      products: products.map(product => ({
        name: product.name,
        currentStock: product.stock,
        category: product.category,
        sku: product._id
      })),
      dashboardUrl: `${process.env.FRONTEND_URL}/admin/inventory`
    };

    const emailPromises = adminEmails.map(email => 
      this.sendEmail(email, subject, 'low-stock-alert', templateData)
    );

    return await Promise.all(emailPromises);
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();