const { BrowserWindow } = require('electron');
const path = require('path');

function createPrintWindow() {
  const printWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js'),
    },
  });

  // Load print template
  const printHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Print</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
          }

          @page {
            margin: 2cm;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }

          .print-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
          }

          .print-header h1 {
            font-size: 24pt;
            margin-bottom: 10px;
          }

          .print-header p {
            font-size: 11pt;
            color: #666;
          }

          .print-content {
            margin: 20px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }

          th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
          }

          th {
            background-color: #f9fafb;
            font-weight: 600;
          }

          .section-title {
            font-size: 16pt;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }

          .label {
            font-weight: 600;
            color: #666;
          }

          .value {
            color: #000;
          }

          .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }

          .signature-box {
            width: 45%;
            text-align: center;
          }

          .signature-line {
            border-top: 1px solid #000;
            margin-top: 60px;
            padding-top: 10px;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10pt;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div id="print-content"></div>
        <script>
          const { ipcRenderer } = require('electron');

          ipcRenderer.on('print-content', (event, content) => {
            document.getElementById('print-content').innerHTML = content.html;
            setTimeout(() => {
              ipcRenderer.send('print-ready');
            }, 100);
          });
        </script>
      </body>
    </html>
  `;

  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(printHtml)}`);

  return printWindow;
}

module.exports = { createPrintWindow };
