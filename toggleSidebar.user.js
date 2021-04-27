// ==UserScript==
// @name         Toggle the right sidebar
// @version      0.5.0
// @author       double-beep
// @include      /^https://(?:[^/]+\.)?(?:(?:stackoverflow|serverfault|superuser|stackexchange|askubuntu|stackapps)\.com|mathoverflow\.net)/questions/\d+/
// @updateURL    https://github.com/double-beep/my-userscripts/raw/master/toggleSidebar.user.js
// @downloadURL  https://github.com/double-beep/my-userscripts/raw/master/toggleSidebar.user.js
// @grant        none
// ==/UserScript==

(function() {
  const buttonWrapper = document.createElement('li');
  buttonWrapper.classList.add('-item');
  const toggleButton = document.createElement('a');
  toggleButton.classList.add('-link');
  toggleButton.id = 'hide-sidebar';
  toggleButton.title = 'Toggle visibility of right sidebar';
  toggleButton.innerHTML = '&#10095;';
  buttonWrapper.appendChild(toggleButton);
  document.querySelector('.-secondary').appendChild(buttonWrapper);

  const sidebar = $(document.querySelector('#sidebar, .sidebar')), mainbar = document.querySelector('#mainbar, .mainbar');
  document.querySelector('#hide-sidebar').addEventListener('click', event => {
    const toggleButton = event.target;
    if (sidebar.is(':visible')) {
      sidebar.hide(200);
      $(mainbar).animate({ width: '100%' }, 200);
      toggleButton.innerHTML = '&#10094;';
    } else {
      sidebar.show(200);
      mainbar.style.width = 'calc(-324px + 100%)';
      toggleButton.innerHTML = '&#10095;';
    }
  });
})();
