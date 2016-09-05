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
	this._LOG = LOG;
	//LOG.enabled = false;

	// bind
	if (typeof($clear) != 'undefined') {
		$clear.click(function() {
			clear();
		});
	}
	$input.off('.AutocompleteHelper');
	$input.on('blur.AutocompleteHelper', function(){
		LOG.info('blur', this);
		$input.off('keyup.AutocompleteHelper');
	});
	$input.on('focus.AutocompleteHelper', function(){
		LOG.info('focus', this);
		$input.off('keyup.AutocompleteHelper').on('keyup.AutocompleteHelper', function() {
			_self._onNewText(this);
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

	// mappping some params
	this._$ = $;
	this._$ul = $ul;
	this._$input = $input;
	this._deferredGet = deferredGet;
}

AutocompleteHelper.prototype._cache  = {};

/**
 * Clear cache if you change some options that might change autocomplete results.
 */
AutocompleteHelper.prototype.clearCache = function() {
	this._cache = {};
};

/**
 * Clear list.
 */
AutocompleteHelper.prototype._clear = function() {
	this._$ul.html( "" );
	this._$ul.listview( "refresh" );
};
// allow public access
AutocompleteHelper.prototype.clearList = AutocompleteHelper.prototype._clear;

/**
 * Insert text of choosen item.
 */
AutocompleteHelper.prototype._onSelect = function(event, listElement) {
	var text = this._$(listElement).text();
	if (this.parseSelected) {
		text = this.parseSelected(text);
	}
	this._LOG.info('select', text);
	this._$input.val(text);
	this._clear();
	event.preventDefault();
	event.stopPropagation();
};

AutocompleteHelper.prototype._escapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;

// previous text value in user input
AutocompleteHelper.prototype._prevValue = "";

/**
 * Make an AJAX call when new text is in the input.
 *
 * @note keypress is fired before the char is added, keyup seem to work better.
 */
AutocompleteHelper.prototype._onNewText = function (input) {
	var value = input.value;
	var _self = this;
	// avoid running when e.g. shift/home were pressed (and nothing actully changed)
	if (_self._prevValue === value) {
		return;
	}
	if (value.length < _self.minLength) {
		return;
	}
	_self._prevValue = value;
	if (value in _self._cache) {
		_self._renderList(_self._cache[value], value);
		return;
	}
	_self._deferredGet(value)
		.done(function(list){
			_self._LOG.info('list', list);
			_self._cache[value] = list;
			_self._renderList(list, value);
		})
	;
};
	
/**
 * Render list.
 * @param {Array} list A simple array with text values.
 * @param {String} text Searched text.
 */
AutocompleteHelper.prototype._renderList = function (list, text) {
	var _self = this;
	var html = "";
	//var html = (list.length < 1 ? "" : "<li>" + list.join('</li><li>') + "</li>");
	if (list.length) {
		var parsedList = [];	// MUST copy so that the list remain unchanged
		var re = new RegExp("(" + _self._htmlSpecialChars(text).replace(_self._escapeRegExp, "\\$&") + ")", 'gi');
		for (var i=0; i<list.length; i++) {
			var value = _self._htmlSpecialChars(list[i]);
			value = value.replace(re, '<b>$1</b>');
			parsedList.push(value);
		}
		html = "<li>" + parsedList.join('</li><li>') + "</li>";
	}
	_self._$ul
		.html(html)
		.listview("refresh")
		.trigger("updatelayout")
	;
	this._$('li', _self._$ul).unbind().click(function(event) {
		_self._onSelect(event, this);
	});
};
/**
 * Escape HTML special characters.
 * @param {String} text Text to transform.
 * @returns {String} Transformed text.
 */
AutocompleteHelper.prototype._htmlSpecialChars = function (text) {
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

/**
 * Add listview as a blacklist element for toolbar show/hide.
 * 
 * @param {jQuery} $ The jQuery object.
 */
(function( $ ) {
	$(document).bind("mobileinit", function()
	{
		$.widget( "mobile.toolbar", $.mobile.toolbar, {
			_create: function() {
				this.options.tapToggleBlacklist += ', .ui-listview';
				this._super();
			}
		});
	});
})( jQuery );
