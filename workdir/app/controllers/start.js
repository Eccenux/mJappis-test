/**
	@file Search/start page prepartion.

	Copyright:  ©2016 Maciej "Nux" Jaros
	  License:  CC-BY or MIT
	            CC-BY: http://creativecommons.org/licenses/by/3.0/
	            MIT: http://www.opensource.org/licenses/mit-license
*/

/**
 * @param {jQuery} $ jQuery object
 * @param {mJappisApplication} $mJ Main object of this application
 */
(function($, $mJ)
{
	// using standard jQuery Mobile rutine to span over more pages
	$(document).on("pageinit", "#page-search,#page-start", function() {
		var helper = new AutocompleteHelper($,
			$(".autocomplete", this),
			$("[name=query]", this),
			$("[name=query]+.ui-input-clear,[name=search]", this),
			deferredGet
		);
		helper.parseSelected = function(text) {
			return '"' + text + '"';
		};
		function deferredGet(text)
		{
			return loadHintsMock(text);
		}
		$(".autocomplete", this).addClass('has-helper').data('helper', helper);
	});

	/**
	 * Emulate server request.
	 *
	 * @param {String} text Text to search.
	 * @returns {jQuery.Promise} promise object.
	 */
	function loadHintsMock (text) {
		var deferredExec = new jQuery.Deferred ();

		var data = [
			'Test',
			'Data test',
			'More testing'
		];
		deferredExec.resolve(data);

		return deferredExec.promise();
	}
})(jQuery, window.mJappisApplication);