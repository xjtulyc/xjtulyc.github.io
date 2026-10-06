/* Academic math typography, loaded only by articles that contain TeX. */
(() => {
  'use strict';
  if (typeof window.renderMathInElement !== 'function') return;
  document.querySelectorAll('.blog-article').forEach(article => {
    window.renderMathInElement(article, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false,
      trust: false,
      strict: 'warn',
      output: 'htmlAndMathml',
      errorCallback: (message, error) => console.error('Article math could not be rendered:', message, error)
    });
  });
})();
