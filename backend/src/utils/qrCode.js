const QRCode = require('qrcode');

/**
 * Generate QR code as data URL
 * @param {string} text - Text to encode in QR code
 * @returns {Promise<string>} Data URL of QR code
 */
const generateQRCode = async (text) => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 200,
            margin: 1,
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('QR Code generation error:', error);
        throw error;
    }
};

module.exports = { generateQRCode };
