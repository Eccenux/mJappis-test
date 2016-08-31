
// settings.js, line#0

// EOC
// EOC
(function($, $mJ)
{
	//var LOG = new Logger('controller.settings');
// EOC
	$mJ.controller.settings = function(parameters)
	{
		var $thisForm = $('#settings-form');

		//


		var tmpFormData = $mJ.form.init('settings');


		var formData = formCreator (
		[
			$mJ.form.getElementOptions('language')
			,
			$mJ.form.startSet()
				,
				$mJ.form.startGroup('mainNavi', {collapsed:true})
					,
					$mJ.form.getElementOptions('mainNaviFormat')
					,
					$mJ.form.getElementOptions('mainNaviPosition')
				,
				$mJ.form.endGroup()
				,
				$mJ.form.startGroup('advanced', {collapsed:true})
					,
					$mJ.form.getElementOptions('pageTransitions')
				,
				$mJ.form.endGroup()
			,
			$mJ.form.endSet()
			,
			{
				type      : 'submit'
				,name     : 'settings-submit'
				,lbl      : $mJ.i18n.get("submit")
			}
		]);
		$mJ.form.close();


		$thisForm.html(formData);


		$thisForm.trigger( "create" );


		$('#settings-submit-btn')
			.unbind()
			.click(function()
			{
				$thisForm.submit();
				return false;
			})
		;


		$thisForm.validate({meta: "validation"});

		//

		$thisForm
			.unbind()
			.submit(function(event)
			{

				if (!$mJ.form.valid(this))
				{
					return false;
				}


				$mJ.storage.set('settings', tmpFormData);


				location.href = 'index.html';

				event.preventDefault();
				return false;
			})
		;
	};

})(jQuery, window.mJappisApplication);
// settings.js, EOF
// start.js, line#0

// EOC
// EOC
(function($, $mJ)
{

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
// EOC
	function loadHintsMock (text) {
		var deferredExec = new jQuery.Deferred ();

		var data = [
			'Test',
			'Data test',
			'More testing',
			'Test',
			'Data test',
			'More testing'
		];
		deferredExec.resolve(data);

		return deferredExec.promise();
	}
})(jQuery, window.mJappisApplication);
// start.js, EOF