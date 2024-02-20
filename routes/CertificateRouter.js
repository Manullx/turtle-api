
const { Router } = require("express");

const CertificateRouter = Router();

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const StudentsModel = require("../database/StudentsModel");
const RegistersModel = require("../database/RegistersModel");
const CoursesModel = require("../database/CoursesModel");
const ModulesModel = require("../database/ModulesModel");

CertificateRouter.post('/generate-pdf.pdf', async (req, res) => {

    const {
        document,
        course_id
    } = req.body;

    try {

        const student = await StudentsModel.findOne({ 
            where: {
                student_document: document
            }
        })

        const course = await CoursesModel.findOne({
            where: {
                course_id: course_id
            }
        })

        const modules = await ModulesModel.findAll({
            where: {
                course_id: course_id
            }
        })

        const certificateInfo = {
            student_name: student.student_name,
            document: student.student_document,
            course_name: course.course_title,
            modules: modules,
            rule: course.course_rule

        }

        // Renderiza o template EJS
        console.log(course)
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

        const pdfFilename = 'certificado_' + certificateInfo.student_name.split(" ")[0].toLowerCase() + '_' + certificateInfo.course_name.replace(/\s/g, '_').toLowerCase() + '.pdf';

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdfFilename}"`);

        // Envia o arquivo PDF como resposta
        
        // Define o caminho onde o PDF será salvo
        const pdfPath = path.join(__dirname, '..', 'certificates',document, 'certificado_' + certificateInfo.student_name.split(" ")[0].toLowerCase() + '_' + certificateInfo.course_name.replace(/\s/g, '_').toLowerCase() + '.pdf');

        // Escreve o conteúdo do PDF em um arquivo
        fs.writeFileSync(pdfPath, pdfBuffer);

        res.sendFile(pdfPath, (err) => {
            if (err) {
                console.error('Error sending PDF file:', err);
                res.status(500).send('Error sending PDF file');
            } else {
                console.log('PDF file sent successfully');
            }
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});


module.exports = CertificateRouter;
