
const { Router } = require("express");

const CertificateRouter = Router();

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs")

CertificateRouter.post('/generate-pdf', async (req, res) => {

    const certificateInfo = req.body;

    try {
        // Renderiza o template EJS
        console.log(__dirname)
        const renderedHtml = await ejs.renderFile(__dirname + "/../utils/templates/certificate.ejs", { certificateInfo });

        // Inicia o browser Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Define o conteúdo da página como o HTML renderizado
        await page.setContent(renderedHtml);

        // Gera o PDF
        const pdfBuffer = await page.pdf({ format: 'A4', landscape: true });

        // Fecha o browser Puppeteer
        await browser.close();
        
        // Define o caminho onde o PDF será salvo
        const pdfPath = path.join(__dirname, '..', 'certificates', 'certificado_' + certificateInfo.student_name.split(" ")[0].toLowerCase() + '_' + certificateInfo.course_name.replace(/\s/g, '_').toLowerCase() + '.pdf');

        // Escreve o conteúdo do PDF em um arquivo
        fs.writeFileSync(pdfPath, pdfBuffer);

        console.log('Certificate saved at:', pdfPath);

        res.send('Certificate generated and saved successfully');

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = CertificateRouter;
