import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePdf = async (userName, courseName, date, code) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
            });

            // Path to save the PDF
            const certificatesDir = path.join(__dirname, '..', 'public', 'certificates');
            if (!fs.existsSync(certificatesDir)) {
                fs.mkdirSync(certificatesDir, { recursive: true });
            }
            const fileName = `${code}.pdf`;
            const filePath = path.join(certificatesDir, fileName);

            // Pipe its output somewhere, like to a file or HTTP response
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Draw border
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#4f46e5');

            // Add text
            doc.fontSize(40).fillColor('#1e293b').text('CERTIFICATE OF COMPLETION', { align: 'center' });
            doc.moveDown(1);
            doc.fontSize(20).text('This is to certify that', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(30).fillColor('#4f46e5').text(userName, { align: 'center', underline: true });
            doc.moveDown(0.5);
            doc.fontSize(20).fillColor('#1e293b').text('has successfully completed the course', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(25).fillColor('#0f172a').text(courseName, { align: 'center' });
            
            doc.moveDown(2);
            doc.fontSize(15).text(`Date: ${new Date(date).toLocaleDateString()}`, 100, doc.y);
            doc.text(`Verification Code: ${code}`, 100, doc.y + 20);

            // Finalize PDF file
            doc.end();

            stream.on('finish', () => {
                // Return the public URL path
                const fileUrl = `/certificates/${fileName}`;
                resolve(fileUrl);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};