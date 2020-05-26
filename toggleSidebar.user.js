// ==UserScript==
// @name         Toggle the right sidebar
// @version      0.3
// @author       double-beep
// @include      /^https://(?:[^/]+\.)?(?:(?:stackoverflow|serverfault|superuser|stackexchange|askubuntu|stackapps)\.com|mathoverflow\.net)/(questions/\d+/|review/*)
// @exclude      /^https://*.*/review/(suggested-edits|reopen)/*
// @updateURL    https://github.com/double-beep/my-userscripts/raw/master/toggleSidebar.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function($) {
  $('.-secondary').append('<li class="-item"><a class="-link" id="hide-sidebar" title="Toggle visibility of right sidebar">&#10095;</a></li>');

  function defineOnClick() {
    const sidebar = $('#sidebar, .sidebar'), mainbar = $('#mainbar, .mainbar');
    $(document).on('click', '#hide-sidebar', function() {
      if (sidebar.is(':visible')) {
        sidebar.hide(200);
        mainbar.animate({'width': '100%'}, 200);
        $(this).html('&#10094;');
      } else {
        sidebar.show(200);
        mainbar.css('width', 'calc(-324px + 100%)');
        $(this).html('&#10095;');
      }
    });
  }
  if (window.location.pathname.match(/\/questions\/\d+/)) defineOnClick();

  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', () => {
      if (this.responseURL.match(/\/review\/(next-task|task-reviewed)/)) defineOnClick();
    });
    origOpen.apply(this, arguments);
  };
})(jQuery);
