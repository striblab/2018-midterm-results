/**
 * Wrapper around GA/Tag manager
 */

function initializeGa() {
  window.dataLayer = window.dataLayer || [];
  window.gaId = 'UA-114906116-1';

  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', window.gaId);
  return window.gtag;
}

module.exports = initializeGa;
