// ==UserScript==
// @name         Toggle the right sidebar
// @version      0.1
// @author       double-beep
// @include      /^https://(?:[^/]+\.)?(?:(?:stackoverflow|serverfault|superuser|stackexchange|askubuntu|stackapps)\.com|mathoverflow\.net)/questions/\d+/
// @updateURL    https://github.com/double-beep/my-userscripts/raw/master/toggleSidebar.user.js
// @grant        none
// ==/UserScript==

(function($) {
  $('#question-header').append('<a id="hide-sidebar" style="left: calc(-123px + 100%); top: 61px; position: absolute;">Hide sidebar >></a>');
  const sidebar = $('#sidebar'), mainbar = $('#mainbar');
  $('#hide-sidebar').click(function() {
    if (sidebar.is(':visible')) {
      sidebar.hide(200);
      mainbar.animate({'width': '100%'}, 200);
      $(this).html('<< Show sidebar');
    } else {
      sidebar.show(200);
      mainbar.css('width', 'calc(-324px + 100%)');
      $(this).html('Hide sidebar >>');
    }
  });
})(jQuery);
