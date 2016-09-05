/**
 * Autocomplete helper for JQM.
 *
 * Copyright © 2014-2016 Maciej Nux Jaros.
 * @license MIT
 *
 * @requires jQuery
 * @requires Logger
 * @provides AutocompleteHelper
 *
 * @todo (?) Option to add loader (add in init stage and just show/hide it). Maybe as a simple overlay (element positioned over ul listview).
 * @todo (?) Choosing item with keyboard (arrows)
 *
 * @param {jQuery} $ The jQuery object.
 * @param {jQuery} $ul Listview element; e.g.: $("#page-search .autocomplete")
 * @param {jQuery} $input Text input element; e.g.: $("#page-search [name=query]")
 * @param {jQuery} $clear Button that clears input value or any other that should hide autocomplete.
 *		So for type=search add a clear button e.g.: $("#page-search [name=query] + .ui-input-clear")
 *		You might also want to include search button here to clear autocomplete when search button is pressed.
 * @param {Function} deferredGet
 *		Function returning jQuery.Deferred (like `jQuery.ajax` does).
 *		It MUST get data based on first parameter (entered text).
 *		It MUST return data with `.resolve(list)` and the list MUST be a simple array with text values.
 */
function AutocompleteHelper($, $ul, $input, $clear, deferredGet)
{
	var _self = this;
	var LOG = new Logger('AutocompleteHelper');
	//LOG.enabled = false;

	// bind
	if (typeof($clear) != 'undefined') {
		$clear.click(function() {
			clear();
		});
	}
	/*
	$input.unbind().keyup(function() {
		onNewText.call(this);
	});
	*/
	$input.off('.AutocompleteHelper');
	$input.on('blur.AutocompleteHelper', function(){
		LOG.info('blur', this);
		$input.off('keyup.AutocompleteHelper');
	});
	$input.on('focus.AutocompleteHelper', function(){
		LOG.info('focus', this);
		$input.off('keyup.AutocompleteHelper').on('keyup.AutocompleteHelper', function() {
			onNewText.call(this);
		});
	});

	/**
	 * Min text length after which query is sent.
	 */
	this.minLength = 2;

	/**
	 * If set this function will be run on selected text before inserted into input.
	 */
	this.parseSelected = null;

	/**
	 * Turn on caching.
	 */
	this.caching = false;

	var cache = {};

	/**
	 * Clear cache if you change some options that might change autocomplete results.
	 */
	this.clearCache = function() {
		cache = {};
	};

	/**
	 * Clear list.
	 */
	function clear() {
		$ul.html( "" );
		$ul.listview( "refresh" );
	}
	// allow public access
	this.clearList = clear;

	/**
	 * Insert text of choosen item.
	 */
	function onSelect(event) {
		var text = $(this).text();
		if (_self.parseSelected) {
			text = _self.parseSelected(text);
		}
		LOG.info('select', text);
		$input.val(text);
		clear();
		event.preventDefault();
		event.stopPropagation();
	}

	var escapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;

	// previous text value in user input
	var prevValue = "";

	/**
	 * Make an AJAX call when new text is in the input.
	 *
	 * @note keypress is fired before the char is added, keyup seem to work better.
	 */
	function onNewText() {
		var value = this.value;
		// avoid running when e.g. shift/home were pressed (and nothing actully changed)
		if (prevValue === value) {
			return;
		}
		if (value.length < _self.minLength) {
			return;
		}
		prevValue = value;
		if (value in cache) {
			renderList(cache[value], value);
			return;
		}
		deferredGet(value)
		.done(function(list){
			LOG.info('list', list);
			cache[value] = list;
			renderList(list, value);
		});
	}
	
	/**
	 * Render list.
	 * @param {Array} list A simple array with text values.
	 * @param {String} text Searched text.
	 */
	function renderList(list, text) {
		var html = "";
		//var html = (list.length < 1 ? "" : "<li>" + list.join('</li><li>') + "</li>");
		if (list.length) {
			var parsedList = [];	// MUST copy so that the list remain unchanged
			var re = new RegExp("(" + htmlSpecialChars(text).replace(escapeRegExp, "\\$&") + ")", 'gi');
			for (var i=0; i<list.length; i++) {
				var value = htmlSpecialChars(list[i]);
				value = value.replace(re, '<b>$1</b>');
				parsedList.push(value);
			}
			html = "<li>" + parsedList.join('</li><li>') + "</li>";
		}
		$ul
			.html(html)
			.listview("refresh")
			.trigger("updatelayout")
		;
		$('li', $ul).unbind().click(onSelect);
	}
	/**
	 * Escape HTML special characters.
	 * @param {String} text Text to transform.
	 * @returns {String} Transformed text.
	 */
	function htmlSpecialChars(text) {
		if (text === null) {
			return "";
		}
		text = text.toString()
			.replace(/&/g, '&amp;')
			.replace(/>/g, '&gt;')
			.replace(/</g, '&lt;')
			.replace(/'/g, '&#039;')
			.replace(/"/g, '&quot;')
		;
		return text;
	};
}