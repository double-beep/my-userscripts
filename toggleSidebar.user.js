// ==UserScript==
// @name         Toggle the right sidebar
// @version      0.5.2
// @author       double-beep
// @contributor  Scratte
// @description  Add the ability to toggle the right sidebar
// @include      /^https://(?:[^/]+\.)?(?:(?:stackoverflow|serverfault|superuser|stackexchange|askubuntu|stackapps)\.com|mathoverflow\.net)/*
// @exclude      https://*.*/review*
// @updateURL    https://github.com/double-beep/my-userscripts/raw/master/toggleSidebar.user.js
// @downloadURL  https://github.com/double-beep/my-userscripts/raw/master/toggleSidebar.user.js
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    const buttonWrapper = document.createElement('li');

    const toggleButton = document.createElement('a');
    toggleButton.id = 'hide-sidebar';
    toggleButton.title = 'Toggle visibility of right sidebar';
    toggleButton.innerHTML = '&#10095;';
    toggleButton.classList.add('s-topbar--item');

    buttonWrapper.appendChild(toggleButton);

    document.querySelector('.s-topbar--content').appendChild(buttonWrapper);

    const sidebar = $(document.querySelector('#sidebar, .sidebar'));
    const mainbar = document.querySelector('#mainbar, .mainbar');

    document.querySelector('#hide-sidebar').addEventListener('click', ({ target }) => {
        if (sidebar.is(':visible')) {
            sidebar.hide(200);
            $(mainbar).animate({ width: '100%' }, 200);
            target.innerHTML = '&#10094;';
        } else {
            sidebar.show(200);
            mainbar.style.width = 'calc(-324px + 100%)';
            target.innerHTML = '&#10095;';
        }
    });
})();
