import puppeteer from 'puppeteer';
import path from 'path';

const defaultOptions = {
  inputPath: 'catalog.html',
  outputPath: 'pdf/catalog.pdf',
  format: 'Ledger',
};

const convertHtmlToPdf = async (options) => {
  const { inputPath, outputPath, format } = { ...defaultOptions, ...options };

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //const timeoutInMiliseconds = 120000;
    //page.setDefaultNavigationTimeout(timeoutInMiliseconds)

    // Set the local URL for the HTML file
    const localPath = path.join('file:///Users/nathanbarr/Coding/Build a HTML Catalog from Products CSV and Images/', inputPath);
    await page.goto(localPath, {
        waitUntil: 'load',
        timeout: 0,
    });

    const pdfOptions = {
      path: outputPath,
      format: format,
      height: '1220px',
      width: '1885px',
      landscape: false,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      printBackground: true,
      scale: 0.85,
      timeout: 0,
    };

    await page.pdf(pdfOptions);

    console.log('PDF generated successfully.');
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export { convertHtmlToPdf };
