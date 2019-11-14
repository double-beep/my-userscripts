// ==UserScript==
// @name         Remove the Products button
// @version      v1.2.0
// @description  Remove the annoying Products button Stack Overflow added in a horrible attempt to earn $$$, which probably ain't gonna do much aside piss off core users
// @author       double-beep
// @include      *://stackoverflow.com/*
// ==/UserScript==

(function removeProductsButton() {
    $("ol").remove[0](".list-reset, .grid, .gs4")
})();
