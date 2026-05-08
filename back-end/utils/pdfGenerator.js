export const generateCertificatePdf = async (userName, courseName, date, code) => {
    // Возвращает буфер или ссылку на файл
    return `https://storage.example.com/certs/${code}.pdf`;
};