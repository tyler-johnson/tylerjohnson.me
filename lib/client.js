var _ = require("underscore");
var $ = require("jquery");
require("./vendor/transit");

$(document).ready(function() {
	function setContTop() {
		var cont = $(".container");
		if (!cont.length) return;

		var top = (-1 * Math.round(cont.height() / 2)) + "px";
		cont.css("margin-top", top);
	}

	if (document.readyState === "complete") setContTop();
	else $(window).one("load", setContTop);

	$("div.alt").each(function(i, el) {
		var left = (-1 * Math.round($(el).outerWidth() / 2)) + "px";
		$(el).css("margin-left", left);
	});

	$(".links a").mouseenter(function(e) {
		var alt = $(this).siblings("div.alt");
		alt.transition({ "margin-top": 5, opacity: 0.8 }, 200, "snap");
	});

	$(".links a").mouseleave(function(e) {
		var alt = $(this).siblings("div.alt");
		alt.transition({ "margin-top": -5, opacity: 0 }, 200, "snap");
	});
});
