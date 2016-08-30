
// codeScanner.js, line#0
/**
 * Simple mock-class for the BarcodeScanner PhoneGap Plugin.
 *
 * Docs:
 * <li> Plugins Basics: https://build.phonegap.com/docs/plugins-using
 * <li> BarcodeScanner usage: https://github.com/wildabeast/BarcodeScanner/blob/master/README.md
 * <li> BarcodeScanner types and functions: https://github.com/phonegap/phonegap-plugins/tree/master/iOS/BarcodeScanner
 *
 * @note You will need to add script call to your index.html. Plugin/phonegap.js files are injected automatically by PGB.
 * 	<!-- plugin(s) -->
 * 	<!-- phonegap.js = cordova.js (file is injected automatically) -->
 * 	<script src="phonegap.js"></script>
 * 	<script src="barcodescanner.js"></script>
 *
 * Author: Maciej Jaros
 * Web: http://enux.pl/
 *
 * Licensed under (at ones choosing)
 *   <li>MIT License: http://www.opensource.org/licenses/mit-license
 *   <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 *
 * @class {CodeScanner}
 */
function CodeScanner()
{
// EOC
	this.mockingEnabled = false;
// EOC
	this.scannerAvailable = false;
// EOC
	var scanner = null;
// EOC
	this.init = function()
	{
		// various versions just in case...
		if ('plugins' in window && 'barcodeScanner' in window.plugins) {
			scanner = window.plugins.barcodeScanner;
		}
		else if ('barcodeScanner' in window) {
			scanner = window.barcodeScanner;
		}
		else if ('cordova' in window) {
			// barcodeScanner 1.0
			if ('plugins' in cordova && 'barcodeScanner' in cordova.plugins) {
				scanner = cordova.plugins.barcodeScanner;
			// barcodeScanner 0.7
			} else {
				scanner = cordova.require("cordova/plugin/BarcodeScanner");
			}
		}

		// ready?
		if (scanner != null) {
			this.scannerAvailable = true;
			this.mockingEnabled = false;
		}

 		// mock
		if (this.mockingEnabled) {
			this.scannerAvailable = true;
		}
		return this.scannerAvailable;
	};
// EOC
	this.scan = function(onSuccess, onError)
	{
		// make sure init was run
		if (!this.scannerAvailable) {
			this.init();
			if (!this.scannerAvailable) {
				return false;
			}
		}

		// mock
		if (this.mockingEnabled) {
			onSuccess(new CodeScannerResult());
			return;
		}

		// std. scan
		scanner.scan(
// EOC
			function(result)
			{
				onSuccess(result);
			}
			,
// EOC
			function(error)
			{
				if (typeof (onError) == "function") {
					onError(error);
				}
			}
		);
	};
}
window.codeScanner = new CodeScanner();
// EOC
function CodeScannerResult()
{
// EOC
	this.text = '12345-mock';
// EOC
	this.format = 'MOCK';
// EOC
	this.cancelled = false;
}
// codeScanner.js, EOF
// GeoCalc.js, line#0
/**
 * Geo calculation.
 *
 * Original scripts and formulas explanation: http://www.movable-type.co.uk/scripts/latlong.html
 *
 * Note: lat/lon format should be passed to functions in degrees as a float (positive or negative).
 * latitude: N+/S- (pl: szerokość geograficzna)
 * longitude: E+/W- (pl: długość geograficzna)
 * e.g 15.123S, 50.123E -> -15.123, 50.123
 *
 * @author Chris Veness 2002-2012
 * @author Maciej Nux Jaros 2013-2014
 *
 * Licensed under (at ones choosing)
 *   <li>MIT License: http://www.opensource.org/licenses/mit-license
 *   <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 */
function GeoCalc() {
}
(function(){
// EOC
	GeoCalc.toRad = function(degrees) {
		return degrees * Math.PI / 180;
	};
// EOC
	GeoCalc.toDeg = function(radians) {
		return radians * 180 / Math.PI;
	};
// EOC
	GeoCalc.distanceWithHaversine = function(lat1, lon1, lat2, lon2) {
		var R = 6371; // km
		var dLat = GeoCalc.toRad(lat2-lat1);
		var dLon = GeoCalc.toRad(lon2-lon1);
		lat1 = GeoCalc.toRad(lat1);
		lat2 = GeoCalc.toRad(lat2);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
				+ Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	};
// EOC
	GeoCalc.bearing = function(lat1, lon1, lat2, lon2) {
		var dLon = GeoCalc.toRad(lon2-lon1);
		lat1 = GeoCalc.toRad(lat1);
		lat2 = GeoCalc.toRad(lat2);

		var y = Math.sin(dLon) * Math.cos(lat2);
		var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
		return GeoCalc.toDeg(Math.atan2(y, x));
	};

})();

// GeoCalc.js, EOF
// CompassInBrowser.js, line#0
/**
 * In-browser compass initalization class.
 *
 * @author Maciej Nux Jaros 2013-2014
 *
 * @example Calibrate and rotate
 * <pre>
		function runCompass(compassImage, infoElement) {
			this.compass = new CompassInBrowser();
			if (!this.compass.available) {
				infoElement.innerHTML = "Sorry, compass is not available in your browser.";
				return;
			}

			this.compass.start();
			if (this.compass.inCalibration) {
				infoElement.innerHTML = "Please rotate your device clockwise.";
			}
			this.compass.onCalibrationFinalization = function(){
				infoElement.innerHTML = "Now we're cookin'";
			};
			this.compass.onAngleChange = function(alpha){
				// This works for any image when using: http://code.google.com/p/jqueryrotate/
				$(compassImage).rotate(-alpha);
				infoElement.innerHTML = alpha.toLocaleString();
			};
		}
 * </pre>
 *
 *
 * @warning In-browser compass is complicated due to browser differnces and needs calibration!
 *	Please instruct user to rotate his/her phone clockwise.
 *	More inromation: http://enux.pl/article/en/2014-01-15/html-compass-madness
 *
 * Licensed under (at ones choosing)
 *   <li>MIT License: http://www.opensource.org/licenses/mit-license
 *   <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 *
 * @returns {CompassInBrowser}
 */
function CompassInBrowser() {
// EOC
	this.available = true == ('addEventListener' in window && 'ondeviceorientation' in window);
// EOC
	this.falsePositiveDetected = false;
// EOC
	this.onFalsePositiveDetected = function(){};
// EOC
	this.inCalibration = true;
// EOC
	this.started = false;
// EOC
	this.lastAlpha = 0;
// EOC
	this.onCalibrationFinalization = function() {};
// EOC
	this.onAngleChange = function(alpha) {};
// EOC
	this.onCalibration = function(alpha) {};
}
(function(){
	// function for translating what is read from the browser to 0-360
	var directionTranslation = function(browserDirection)
	{
		return browserDirection;
	};
	// in basic calibration?
	var inBasicCalibration = true;
	// final angle after basicCalibration
	var initCalibrationAngle = 0;

	var LOG = new Logger('CompassInBrowser');
// EOC
	CompassInBrowser.prototype.resetCalibration = function() {
		directionTranslation = function(browserDirection)
		{
			return browserDirection;
		};
		inBasicCalibration = true;
		initCalibrationAngle = 0;
		this.inCalibration = true;
	};
// EOC
	CompassInBrowser.prototype.start = function(){
		if (!this.started) {
			this.started = true;
			window.addEventListener('deviceorientation', this, false);

			// make sure the device supports compass...
			var _self = this;
			setTimeout(function(){
				if (_self.started && _self.lastAlpha == 0) {
					LOG.info('still on 0 - assuming false positive ', _self);
					_self.falsePositiveDetected = true;
					_self.available = false;
					_self.onFalsePositiveDetected();
				}
			}, 1000);
		}
		return this;
	};
// EOC
	CompassInBrowser.prototype.stop = function(){
		window.removeEventListener('deviceorientation', this, false);
		this.started = false;
		// reset calibration if calibration was not finished to avoid confusion
		if (this.inCalibration) {
			this.resetCalibration();
		}
		return this;
	};
// EOC
	function basicCalibration(alpha) {
		// Nokia browser style (N9 tested): -180 to 180 where 180/-180 is North
		if (alpha < 0)
		{
			directionTranslation = function(browserDirection)
			{
				return Math.abs(browserDirection - 180);
			};
			initCalibrationAngle = Math.round(directionTranslation(alpha));
			return false;
		}
		// Android HTC HD, Fox+Opera; 0 to 360 where 0/360 is North
		else if (alpha > 180)
		{
			initCalibrationAngle = Math.round(directionTranslation(alpha));
			return false;
		}
		return true;
	}
// EOC
	function sidesCalibration(alpha) {
		// a is normalized to 0-360 integer
		var a = Math.round(directionTranslation(alpha));
		// normalize to 0-360 as if initCalibrationAngle where at 0
		a = (360 + a - initCalibrationAngle) % 360;
		// if user is between 60 and 120 deg. in the rotated space
		// this means we already have clock-wise compass (yupi!)
		if (60 < a && a < 120)
		{
			return false;
		}
		// if user is between 300 and 240 deg. in the rotated space
		// this means we need make it a clock-wise compass...
		else if (240 < a && a < 300)
		{
			var prevDirectionTranslation = directionTranslation;
			directionTranslation = function(browserDirection)
			{
				return Math.abs(360 - prevDirectionTranslation(browserDirection));
			};

			return false;
		}
		return true;
	}
// EOC
	CompassInBrowser.prototype.handleEvent = function(event)
	{
		if (this.inCalibration)
		{
			// Figure out if range is -180; 180 or 0; 360.
			if (inBasicCalibration)
			{
				inBasicCalibration = basicCalibration(event.alpha);	// sets `inBasicCalibration` to false when done
			}
			// Figure out if East is 90 or 270.
			else
			{
				this.inCalibration = sidesCalibration(event.alpha);
				if (!this.inCalibration) {
					this.onCalibrationFinalization();
				}
			}
		}

		// send info. to user
		var alpha = directionTranslation(event.alpha);
		this.lastAlpha = alpha;
		if (this.inCalibration)
		{
			this.onCalibration(alpha);
		}
		else
		{
			this.onAngleChange(alpha);
		}
	};
})();

// CompassInBrowser.js, EOF
// CompassMock.js, line#0
/**
 * Compass mocking.
 *
 * @author Maciej Nux Jaros 2014
 *
 * @note Naming conventions for functions taken from Apache Cordova (PhoneGap).
 *
 * Licensed under (at ones choosing)
 *   <li>MIT License: http://www.opensource.org/licenses/mit-license
 *   <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 *
 * @returns {CompassMock}
 */
function CompassMock() {
// EOC
	this.changeFrequency = 200;
// EOC
	this.angleChange = 0.4;

	var changeID = null;
	var watchID = null;
	var currentAngle = 0;
// EOC
	this.start = function() {
		var _self = this;
		changeID = setInterval(function() {
			currentAngle += _self.angleChange;
			if (currentAngle < 0) {
				currentAngle = 360 + currentAngle;
			}
			else if (currentAngle > 360) {
				currentAngle = currentAngle - 360;
			}
		}, _self.changeFrequency);
		return this;
	};
// EOC
	this.stop = function() {
		clearInterval(changeID);
		return this;
	};
// EOC
	this.watchHeading = function(onSuccess, onError, options) {
		this.start();

		// frequency support
		var frequency = 150;
		try {
			frequency = options.frequency;
		} catch(e) {}

		// watch at given frequency
		watchID = setInterval(function() {
			onSuccess({magneticHeading:currentAngle});
		}, frequency);

		return watchID;
	};
// EOC
	this.clearWatch = function(watchID) {
		clearInterval(watchID);
	};
// EOC
	this.getCurrentHeading = function(onSuccess) {
		onSuccess({magneticHeading:currentAngle});
	};
}

// CompassMock.js, EOF
// CompassHelper.js, line#0
/**
 * Compass helper class.
 *
 * @author Maciej Nux Jaros 2014
 *
 * @note Naming conventions for some functions taken from Apache Cordova (PhoneGap). Especially: getCurrentHeading, watchHeading, clearWatch.
 *
 * Licensed under (at ones choosing)
 *   <li>MIT License: http://www.opensource.org/licenses/mit-license
 *   <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 *
 * @requires Logger
 * @optional CompassInBrowser
 * @optional CompassMock
 *
 * @param {Boolean} mockingEnabled If true then mocking mode will be available as a fallback.
 * @returns {CompassHelper}
 */
function CompassHelper(mockingEnabled) {
// EOC
	this.availability = {
		'native' : false,
		'browser': false,
		'mock': typeof(mockingEnabled)=='undefined' ? false : mockingEnabled
	};
// EOC
	this.available = false;
// EOC
	this.frequency = 100;
// EOC
	this.nativeCompass;
// EOC
	this.browserCompass;
// EOC
	this.onCalibrationFinalization = function() {};
}

(function(){
	var LOG = new Logger('CompassHelper');
// EOC
	var compassType = 'native|browser';
// EOC
	CompassHelper.prototype.Error = function(cordovaError) {
		this.code = this.codes.INTERNAL_ERROR;

		// custom/own error
		if (typeof(cordovaError)=='string') {
			this.code = cordovaError;
			return;
		}

		// check object
		if (typeof(cordovaError)=='undefined'
				|| !('COMPASS_NOT_SUPPORTED' in cordovaError)
				|| !('code' in cordovaError)
		) {
			LOG.error('mapping error object:', cordovaError);
			return;
		}

		// map
		if (cordovaError.code == cordovaError.COMPASS_NOT_SUPPORTED) {
			this.code = this.codes.NOT_SUPPORTED;
		}
	};
// EOC
	CompassHelper.prototype.Error.prototype.codes = {
		INTERNAL_ERROR : 'internal',
		NOT_SUPPORTED : 'not supported',
// EOC
		NEEDS_CALIBRATION : 'calibrating'
	};

	// alias
	var errorCodes = CompassHelper.prototype.Error.prototype.codes;
// EOC
	function watchIdMapping(watchID) {
		return watchID;
	}
// EOC
	CompassHelper.prototype.disableBrowserCompass = function(){
		var _self = this;
		// make sure it's off and re-init
		_self.browserCompass.stop();
		_self.browserCompass.onAngleChange = function(){};
		_self.availability.browser = false;
		_self.available = false;
		_self.init();
		// rewrite current watches
		if (_self.available) {
			var watchIDMap = [];
			for (var i=0; i<browserWatches.length; i++) {
				if (browserWatches[i].enabled) {
					var newID = _self.watchHeading(browserWatches[i].onSuccess, browserWatches[i].onError);
					watchIDMap[i] = newID;
				}
			}
			// add mapping
			watchIdMapping = function (watchID) {
				if (watchID in watchIDMap) {
					return watchIDMap[watchID];
				};
				return watchID;
			};
			browserWatches = [];
			browserWatchesActivityCount = 0;
		}
	};
// EOC
	CompassHelper.prototype.init = function()
	{
		var _self = this;

		// check availability
		if ('navigator' in window && 'compass' in window.navigator) {
			this.nativeCompass = window.navigator.compass;
			this.availability['native'] = true;
			this.available = true;
		}
		if ('CompassInBrowser' in window) {
			if (typeof(this.browserCompass) != 'object') {
				this.browserCompass = new CompassInBrowser();
			}
			if (this.browserCompass.available) {
				this.availability.browser = true;
				this.available = true;
				// make sure browser compass is supported
				this.browserCompass.onFalsePositiveDetected = function(){
					LOG.warn("browserCompass not available!");
					_self.disableBrowserCompass();
				};
			}
		}
		if ('CompassMock' in window && this.availability.mock) {
			if (typeof(this.nativeCompass) != 'object') {
				this.nativeCompass = new CompassMock();
			}
			this.available = true;
		}

		// choose compass
		if (this.availability['native']) {
			compassType = 'native';
		}
		else if (this.availability.browser) {
			compassType = 'browser';
		}
		else if (this.availability.mock) {
			compassType = 'native';
		}

		return this;
	};
// EOC
	function onErrorProxy(compassHelper, onError, cordovaError) {
		// error mapping
		var error = new compassHelper.Error(cordovaError);

		// call user function
		if (typeof (onError) == "function") {
			onError(error);
		}
		// default
		else {
			LOG.error('error code:'+error.code);
		}
	}

	var browserWatchesActivityCount = 0;
	var browserWatches = [];
// EOC
	function cordovaHeadingToHeading(cordovaHeading) {
		return cordovaHeading.magneticHeading;
	}
// EOC
	CompassHelper.prototype.watchHeading = function(onSuccess, onError) {
		var _self = this;

		// check if antyhing is available...
		if (!this.available) {
			onErrorProxy(_self, onError, errorCodes.NOT_SUPPORTED);
			return -1;
		}

		var watchID;
		LOG.info('watchHeading, watchID: ', watchID);

		// run native (or mock)
		if (compassType == 'native') {
			_self.onCalibrationFinalization();	// call to avoid behaviour differences
			watchID = this.nativeCompass.watchHeading(function(cordovaHeading) {
				onSuccess(cordovaHeadingToHeading(cordovaHeading));
			}, function(cordovaError) {
				onErrorProxy(_self, onError, cordovaError);
			}, {
				frequency : _self.frequency
			});
		// browser
		} else {
			var watchID = browserWatches.length;
// EOC
			var compass = this.browserCompass;
			if (!compass.started) {
				LOG.info('starting');
				compass.start();
			}
			if (!compass.inCalibration) {
				LOG.info('calibration already done');
				_self.onCalibrationFinalization();
			} else {
				LOG.info('calibration');
				compass.onCalibrationFinalization = function(){
					LOG.info('calibration done');
					_self.onCalibrationFinalization();
				};
			}
			browserWatchesActivityCount++;
			browserWatches[watchID] = {
				enabled : true,
				onSuccess : onSuccess,
				onError : onError
			};
			compass.onAngleChange = function(alpha){
				for (var i=0; i<browserWatches.length; i++) {
					if (browserWatches[i].enabled) {
						browserWatches[i].onSuccess(alpha);
					}
				}
			};
		}

		return watchID;
	};
// EOC
	CompassHelper.prototype.clearWatch = function(watchID) {
		// check if antyhing is available...
		if (!this.available) {
			LOG.error('error code:'+errorCodes.NOT_SUPPORTED);
			return;
		}

		// run native (or mock)
		if (compassType == 'native') {
			this.nativeCompass.clearWatch(watchIdMapping(watchID));
		// browser
		} else {
			if (watchID in browserWatches && browserWatches[watchID].enabled) {
				browserWatches[watchID].enabled = false;
				browserWatchesActivityCount--;
				if (browserWatchesActivityCount <= 0) {
					browserWatchesActivityCount = 0;
					this.browserCompass.stop();
				}
			}
		}
	};
// EOC
	CompassHelper.prototype.getCurrentHeading = function(onSuccess, onError) {
		var _self = this;

		// check if antyhing is available...
		if (!this.available) {
			onErrorProxy(_self, onError, errorCodes.NOT_SUPPORTED);
			return;
		}

		// run native (or mock)
		if (compassType == 'native') {
			this.nativeCompass.getCurrentHeading(function(cordovaHeading) {
				onSuccess(cordovaHeadingToHeading(cordovaHeading));
			}, function(cordovaError) {
				onErrorProxy(_self, onError, cordovaError);
			});
		// browser
		} else {
// EOC
			var compass = this.browserCompass;
			if (compass.inCalibration) {
				onErrorProxy(_self, onError, errorCodes.NEEDS_CALIBRATION);
			}
			else {
				if (!compass.started) {
					compass.start().onAngleChange = function(alpha){
						onSuccess(alpha);
						compass.stop();
					};
				} else {
					onSuccess(compass.lastAlpha);
				}
			}
		}
	};
})();

// CompassHelper.js, EOF
// jQueryRotateCompressed.js, line#0
// VERSION: 2.3 LAST UPDATE: 11.07.2013
/*
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://code.google.com/p/jqueryrotate/
 */
(function(k){for(var d,f,l=document.getElementsByTagName("head")[0].style,h=["transformProperty","WebkitTransform","OTransform","msTransform","MozTransform"],g=0;g<h.length;g++)void 0!==l[h[g]]&&(d=h[g]);d&&(f=d.replace(/[tT]ransform/,"TransformOrigin"),"T"==f[0]&&(f[0]="t"));eval('IE = "v"=="\v"');jQuery.fn.extend({rotate:function(a){if(0!==this.length&&"undefined"!=typeof a){"number"==typeof a&&(a={angle:a});for(var b=[],c=0,d=this.length;c<d;c++){var e=this.get(c);if(e.Wilq32&&e.Wilq32.PhotoEffect)e.Wilq32.PhotoEffect._handleRotation(a);
else{var f=k.extend(!0,{},a),e=(new Wilq32.PhotoEffect(e,f))._rootObj;b.push(k(e))}}return b}},getRotateAngle:function(){for(var a=[],b=0,c=this.length;b<c;b++){var d=this.get(b);d.Wilq32&&d.Wilq32.PhotoEffect&&(a[b]=d.Wilq32.PhotoEffect._angle)}return a},stopRotate:function(){for(var a=0,b=this.length;a<b;a++){var c=this.get(a);c.Wilq32&&c.Wilq32.PhotoEffect&&clearTimeout(c.Wilq32.PhotoEffect._timer)}}});Wilq32=window.Wilq32||{};Wilq32.PhotoEffect=function(){return d?function(a,b){a.Wilq32={PhotoEffect:this};
this._img=this._rootObj=this._eventObj=a;this._handleRotation(b)}:function(a,b){this._img=a;this._onLoadDelegate=[b];this._rootObj=document.createElement("span");this._rootObj.style.display="inline-block";this._rootObj.Wilq32={PhotoEffect:this};a.parentNode.insertBefore(this._rootObj,a);if(a.complete)this._Loader();else{var c=this;jQuery(this._img).bind("load",function(){c._Loader()})}}}();Wilq32.PhotoEffect.prototype={_setupParameters:function(a){this._parameters=this._parameters||{};"number"!==
typeof this._angle&&(this._angle=0);"number"===typeof a.angle&&(this._angle=a.angle);this._parameters.animateTo="number"===typeof a.animateTo?a.animateTo:this._angle;this._parameters.step=a.step||this._parameters.step||null;this._parameters.easing=a.easing||this._parameters.easing||this._defaultEasing;this._parameters.duration=a.duration||this._parameters.duration||1E3;this._parameters.callback=a.callback||this._parameters.callback||this._emptyFunction;this._parameters.center=a.center||this._parameters.center||
["50%","50%"];this._rotationCenterX="string"==typeof this._parameters.center[0]?parseInt(this._parameters.center[0],10)/100*this._imgWidth*this._aspectW:this._parameters.center[0];this._rotationCenterY="string"==typeof this._parameters.center[1]?parseInt(this._parameters.center[1],10)/100*this._imgHeight*this._aspectH:this._parameters.center[1];a.bind&&a.bind!=this._parameters.bind&&this._BindEvents(a.bind)},_emptyFunction:function(){},_defaultEasing:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-
1)+c},_handleRotation:function(a,b){d||this._img.complete||b?(this._setupParameters(a),this._angle==this._parameters.animateTo?this._rotate(this._angle):this._animateStart()):this._onLoadDelegate.push(a)},_BindEvents:function(a){if(a&&this._eventObj){if(this._parameters.bind){var b=this._parameters.bind,c;for(c in b)b.hasOwnProperty(c)&&jQuery(this._eventObj).unbind(c,b[c])}this._parameters.bind=a;for(c in a)a.hasOwnProperty(c)&&jQuery(this._eventObj).bind(c,a[c])}},_Loader:function(){return IE?function(){var a=
this._img.width,b=this._img.height;this._imgWidth=a;this._imgHeight=b;this._img.parentNode.removeChild(this._img);this._vimage=this.createVMLNode("image");this._vimage.src=this._img.src;this._vimage.style.height=b+"px";this._vimage.style.width=a+"px";this._vimage.style.position="absolute";this._vimage.style.top="0px";this._vimage.style.left="0px";this._aspectW=this._aspectH=1;this._container=this.createVMLNode("group");this._container.style.width=a;this._container.style.height=b;this._container.style.position=
"absolute";this._container.style.top="0px";this._container.style.left="0px";this._container.setAttribute("coordsize",a-1+","+(b-1));this._container.appendChild(this._vimage);this._rootObj.appendChild(this._container);this._rootObj.style.position="relative";this._rootObj.style.width=a+"px";this._rootObj.style.height=b+"px";this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;for(this._eventObj=this._rootObj;a=this._onLoadDelegate.shift();)this._handleRotation(a,
!0)}:function(){this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._imgWidth=this._img.naturalWidth;this._imgHeight=this._img.naturalHeight;var a=Math.sqrt(this._imgHeight*this._imgHeight+this._imgWidth*this._imgWidth);this._width=3*a;this._height=3*a;this._aspectW=this._img.offsetWidth/this._img.naturalWidth;this._aspectH=this._img.offsetHeight/this._img.naturalHeight;this._img.parentNode.removeChild(this._img);this._canvas=document.createElement("canvas");
this._canvas.setAttribute("width",this._width);this._canvas.style.position="relative";this._canvas.style.left=-this._img.height*this._aspectW+"px";this._canvas.style.top=-this._img.width*this._aspectH+"px";this._canvas.Wilq32=this._rootObj.Wilq32;this._rootObj.appendChild(this._canvas);this._rootObj.style.width=this._img.width*this._aspectW+"px";this._rootObj.style.height=this._img.height*this._aspectH+"px";this._eventObj=this._canvas;for(this._cnv=this._canvas.getContext("2d");a=this._onLoadDelegate.shift();)this._handleRotation(a,
!0)}}(),_animateStart:function(){this._timer&&clearTimeout(this._timer);this._animateStartTime=+new Date;this._animateStartAngle=this._angle;this._animate()},_animate:function(){var a=+new Date,b=a-this._animateStartTime>this._parameters.duration;if(b&&!this._parameters.animatedGif)clearTimeout(this._timer);else{if(this._canvas||this._vimage||this._img)a=this._parameters.easing(0,a-this._animateStartTime,this._animateStartAngle,this._parameters.animateTo-this._animateStartAngle,this._parameters.duration),
this._rotate(~~(10*a)/10);this._parameters.step&&this._parameters.step(this._angle);var c=this;this._timer=setTimeout(function(){c._animate.call(c)},10)}this._parameters.callback&&b&&(this._angle=this._parameters.animateTo,this._rotate(this._angle),this._parameters.callback.call(this._rootObj))},_rotate:function(){var a=Math.PI/180;return IE?function(a){this._angle=a;this._container.style.rotation=a%360+"deg";this._vimage.style.top=-(this._rotationCenterY-this._imgHeight/2)+"px";this._vimage.style.left=
-(this._rotationCenterX-this._imgWidth/2)+"px";this._container.style.top=this._rotationCenterY-this._imgHeight/2+"px";this._container.style.left=this._rotationCenterX-this._imgWidth/2+"px"}:d?function(a){this._angle=a;this._img.style[d]="rotate("+a%360+"deg)";this._img.style[f]=this._parameters.center.join(" ")}:function(b){this._angle=b;b=b%360*a;this._canvas.width=this._width;this._canvas.height=this._height;this._cnv.translate(this._imgWidth*this._aspectW,this._imgHeight*this._aspectH);this._cnv.translate(this._rotationCenterX,
this._rotationCenterY);this._cnv.rotate(b);this._cnv.translate(-this._rotationCenterX,-this._rotationCenterY);this._cnv.scale(this._aspectW,this._aspectH);this._cnv.drawImage(this._img,0,0)}}()};IE&&(Wilq32.PhotoEffect.prototype.createVMLNode=function(){document.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{return!document.namespaces.rvml&&document.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),function(a){return document.createElement("<rvml:"+a+' class="rvml">')}}catch(a){return function(a){return document.createElement("<"+
a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}}())})(jQuery);

// jQueryRotateCompressed.js, EOF