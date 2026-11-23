/* Titik masuk: render data → pasang interaksi. */
(function () {
  var RW = window.RW;
  function start() {
    RW.renderAll();
    RW.gallery_ui.init();
    RW.estimator.init();
    RW.forms.init();
    RW.bindWhatsApp(document);
    RW.ui.init();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
