
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