const { execSync } = require('child_process');
const QRCode = require('qrcode');
const fs = require('fs');

const qrOutputPath = 'C:\\Users\\Gurudev\\.gemini\\antigravity\\brain\\76b6ff79-0d7f-41c9-9f15-d17f132cbeef\\download_qr.png';

try {
    console.log('Fetching latest EAS build data...');
    const buildJson = execSync('npx eas build:list --limit 1 --json', { encoding: 'utf8' });
    const buildData = JSON.parse(buildJson);
    const installUrl = buildData[0].artifacts.installUrl;
    
    console.log('Generating QR code for:', installUrl);
    QRCode.toFile(qrOutputPath, installUrl, { width: 512, margin: 2 }, function (err) {
        if (err) {
            console.error('Error generating QR code:', err);
            process.exit(1);
        }
        console.log('QR Code successfully generated at:', qrOutputPath);
    });
} catch (err) {
    console.error('Unified QR generation failed:', err.message);
    process.exit(1);
}
