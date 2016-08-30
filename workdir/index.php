<?php
	// configuration
	require './_packaging/config.php';

	// setup
	require_once './_packaging/inc/ProcessingHelper.php';
	$processor = new ProcessingHelper($buildPackages, $strBundleRoot);
	$processingMode = $processor->topSetup();

?>
<!DOCTYPE html>
<!--
	Main views of the application (pages and dialogs).
	Single view has attribute data-role="page" or data-role="dialog"

	mJappis Copyright:  ©2012-2014 Maciej "Nux" Jaros
	          License:  CC-BY or MIT
	            CC-BY: http://creativecommons.org/licenses/by/3.0/
	              MIT: http://www.opensource.org/licenses/mit-license 
	
	Libraries Copyright and License in the JS files.
	
	See also: #page-about
-->
<html>
<head>
	<!-- Note! Main view title is in i18n -->
	<title>App</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	
	<meta charset="UTF-8">

	<meta name="author" content="Maciej Jaros">
	
	<!-- app icons -->
	<link rel="shortcut icon" href="logo/logo.ico">
	<link rel="apple-touch-icon" href="logo/logo072.png" sizes="72x72">
	<link rel="apple-touch-icon" href="logo/logo080.png" sizes="80x80">
	<link rel="apple-touch-icon" href="logo/logo114.png" sizes="114x114">
	<link rel="apple-touch-icon" href="logo/logo128.png">

	<!-- CSS -->
	<?=$processor->css('css', 'common')?>
	<?=$processor->css('css', 'calc', 'data-PolyCalc="1"')?>

	<!-- jQuery and other libs -->
	<?=$processor->js('libs', 'common')?>
	<?=$processor->js('libs', 'index')?>
	
	<!-- this app -->
	<?=$processor->js('mJappis')?>
	<?=$processor->js('app', 'common')?>
	<?=$processor->js('app', 'index')?>

	<script type="text/javascript">
		mJappisApplication.setup.full();
	</script>
	
	<!-- jQuery mobile (must be here for mobile...options to work) -->
	<?=$processor->js('jqm')?>

	<!-- PHONEGAP:START -->
	<?php if ($processingMode == 'pgb-bundle') { ?>
		<!-- phonegap.js = cordova.js (file is injected automatically) -->
		<script src="phonegap.js"></script>
	<?php } ?>
	<!-- PHONEGAP:END -->
</head>
<body lang="pl">
<?php
	foreach(glob('app/views/*') as $view) {
		include $view;
		echo "\n\n";
	}
?>
</body>
</html>
<?php $processor->bottomFinalization('index') ?>