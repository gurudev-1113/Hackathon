const QRCode = require('qrcode');
const url = 'exp://10.142.250.165:8081';
const path = 'C:\\Users\\Gurudev\\.gemini\\antigravity\\brain\\76b6ff79-0d7f-41c9-9f15-d17f132cbeef\\expo_qr_code.png';

QRCode.toFile(path, url, {
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  width: 400
}, function (err) {
  if (err) throw err;
  console.log('done');
});
