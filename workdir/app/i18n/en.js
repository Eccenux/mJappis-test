/**
 *	@file mJappisApplication i18n (language) file
 *
 *    Copyright:  ©2012-2014 Maciej "Nux" Jaros
 *	  License:  CC-BY or MIT
 *	            CC-BY: http://creativecommons.org/licenses/by/3.0/
 *	            MIT: http://www.opensource.org/licenses/mit-license 
 *
 * i18n labels, titles, messages and such
 *
 * @note
 *		Building i18n labels for data objects:
 *		\li label-[objectFieldName]...-[objectFieldName]
 *		\li label-[objectFieldName]...-[objectFieldName]-[optionName]
 *		@see mJappisApplication.storage.js
 *
 * @note
 *		<p>This object will be replaced upon setup of the i18n class and stored internally</p>
 *		<p>You should use "get" method like in the example below</p>
 *		<ol>
 *		<li>var yesText = $mJ.i18n.get("_Yes");</li>
 *		<li>var hiText = $mJ.i18n.get("_Hi_username", {username:"Maciej"});</li>
 *		</ol>
 *		<p>Note that the message "_Hi_username" must contain "{$username}" placeholder for the replacement to work.</p>
 */
window.mJappisApplication.i18n.en = {"":""
	// app basic
	,"title-application" : "App"
	// errors
	,"unexpected error" : "Unexpected error!"
	// page (or icon) titles
	,"add - title" : "Add"
	,"edit - title" : "Edit"
	,"delete - title" : "Delete"
	// settings
	,"label-settings-language"         : "Language"
	,"label-settings-language-pl"      : "Polski"
	,"label-settings-language-en"      : "English"
	,"group-settings-mainNavi" : "Navigation buttons"
	,"label-settings-mainNaviFormat"            : "Format"
	,"label-settings-mainNaviFormat-icons&text" : "Icons & text"
	,"label-settings-mainNaviFormat-icons-only" : "Icons only"
	,"label-settings-mainNaviFormat-text-only"  : "Text only"
	,"label-settings-mainNaviPosition"               : "Position"
	,"label-settings-mainNaviPosition-bottom-fixed"  : "Fixed to the bottom"
	,"label-settings-mainNaviPosition-below-content" : "Below content"
	,"label-settings-mainNaviPosition-below-header"  : "Below header"
	,"group-settings-advanced" : "Advanced"
	,"label-settings-pageTransitions"           : "Animation type for transitions"
	,"label-settings-pageTransitions-none"      : "None (best performance)"
	,"label-settings-pageTransitions-slide"     : "Slide"
	,"label-settings-pageTransitions-slideup"   : "Slide up"
	,"label-settings-pageTransitions-slidedown" : "Slide down"
	,"label-settings-pageTransitions-pop"       : "Pop"
	,"label-settings-pageTransitions-fade"      : "Fade"
	,"label-settings-pageTransitions-flip"      : "Flip"
	,"label-settings-pageTransitions-turn"      : "Turn"
	,"label-settings-pageTransitions-flow"      : "Flow"
	,"label-settings-pageTransitions-slidefade" : "Slide-fade"
	// forms basics
	,"form-invalid" : "Please correct the form"
	,"submit"       : "Save"
	// Translated default messages for the jQuery validation plugin.
	,"validator-messages" :
	{
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		accept: "Please enter a value with a valid extension.",
		maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
		minlength: jQuery.validator.format("Please enter at least {0} characters."),
		rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
		range: jQuery.validator.format("Please enter a value between {0} and {1}."),
		max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
		min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
	}
};