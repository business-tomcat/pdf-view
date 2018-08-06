const pdfjsLib = require('pdfjs-dist');
const pdfFile = require('../static/pdf-sample.pdf');

export class Pdf {

  heading: string = 'PDF View';

  constructor() {
  }

  attached() {
    this.loadPdf();
  }

  private loadPdf() {
    // Setting worker path to worker bundle
    //pdfjsLib.GlobalWorkerOptions.workerSrc = '../dist123/pdf.bundle.js';

    // Loading a document.
    var loadingTask = pdfjsLib.getDocument(pdfFile);
    loadingTask.promise.then(function(pdfDocument) {
      // Request a first page
      return pdfDocument.getPage(1).then(function(pdfPage) {

        // Prepare canvas using PDF page dimensions.
        var containerColumn = document.getElementById('pdf-container');
        var canvas = document.getElementById('the-canvas') as HTMLCanvasElement;
        var context = canvas.getContext('2d');
        canvas.height = containerColumn.clientHeight;
        canvas.width = containerColumn.clientWidth;

        var unscaledViewport = pdfPage.getViewport(1);
        //var scale = Math.min((canvas.height / unscaledViewport.height), (canvas.width / unscaledViewport.width));
        var scale = canvas.width / unscaledViewport.width;
        var viewport = pdfPage.getViewport(scale);

        // Render PDF page into canvas context.
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        var renderTask = pdfPage.render(renderContext);

        return renderTask.promise;
      });
    }).catch(function(reason) {
      console.error('Error: ' + reason);
    });
  }

  private refresh() {

    console.log('refresh');

    let canvas = document.getElementById('the-canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.loadPdf();
  }

}
