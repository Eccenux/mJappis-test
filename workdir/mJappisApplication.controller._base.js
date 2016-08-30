/**
	@file mJappisApplication JS controllers - common base

    Copyright:  ©2013-2014 Maciej "Nux" Jaros
	  License:  CC-BY-SA
	            http://creativecommons.org/licenses/by-sa/3.0/
*/

/**
 * @param {jQuery} $ jQuery object
 * @param {mJappisApplication} $mJ Main object of this application
 */
(function($, $mJ)
{
	$mJ.controller = new Object();

	/**
	 * Pagination Helper
	 *
	 * @param {String} paginationName [optional] name of the pagination. Used to create unique ID for options.
	 * @returns {$mJ.controller.PaginationHelper}
	 */
	$mJ.controller.PaginationHelper = function (paginationName) {
		var _self = this;

		/**
		 * Change if many paginations reside on a single page.
		 */
		this.uniquePrefix = 'paginationHelper';
		if (paginationName) {
			this.uniquePrefix += paginationName;
		}

		var tpl = {
			pageIndexName: function () {
				return _self.uniquePrefix;
			},
			renderOptions: function () {
				var html = '';
				for (var i = 0; i < _self.pagesNo; i++) {
					var selected = "";
					if (_self.currentPageIndex == i) {
						selected = "selected='selected'";
					}
					html += '<option '+selected+' value="'+i+'">'+$mJ.i18n.get('Page')+' '+(i+1)+'</option>';
				}
				return html;
			},
			renderRadios: function () {
				var html = '';
				for (var i = 0; i < _self.pagesNo; i++) {
					var selected = "";
					if (_self.currentPageIndex == i) {
						selected = "checked='checked'";
					}
					var name = tpl.pageIndexName();
					var id = name+i;
					html += '<input '+selected+' type="radio" id="'+id+'" name="'+name+'" value="'+i+'" />';
					html += '<label for="'+id+'">'+(i+1)+'</label>';
				}
				return html;
			},
			manyPages : function () {
				return ''
					+'<fieldset class="ui-grid-a">'
					+'	<div class="ui-block-a"><a data-id="prev" href="" data-role="button" data-icon="arrow-l" data-iconpos="left"  >'+$mJ.i18n.get('Previous')+'</a></div>'
					+'	<div class="ui-block-b"><a data-id="next" href="" data-role="button" data-icon="arrow-r" data-iconpos="right" >'+$mJ.i18n.get('Next')+'</a></div>'
					+'</fieldset>'
					+'<select name="'+tpl.pageIndexName()+'">'+tpl.renderOptions()+'</select>'
				;
			},
			fewPages : function () {
				return '<fieldset data-role="controlgroup" data-type="horizontal" class="ui-field-contain"><legend>'+$mJ.i18n.get('Page')+':</legend>'+tpl.renderRadios()+'</fieldset>';
			},
			singlePage : function () {
				return '';
			},
			smallScreen : function () {
				if (_self.pagesNo < 2) {
					return tpl.singlePage();
				}
				if (_self.pagesNo <= 9) {
					return tpl.fewPages();
				}
				return tpl.manyPages();
			}
		};

		this.currentPageIndex = 0;
		this.itemsPerPage = 5;
		this.totalItems = 0;
		this.pagesNo = 1;

		/**
		 * Get pagination HTML and init interal values.
		 */
		this.getPagination = function (currentPageIndex, itemsPerPage, totalItems) {
			this.currentPageIndex = +currentPageIndex;
			this.itemsPerPage = itemsPerPage;
			this.totalItems = totalItems;
			this.pagesNo = Math.ceil(totalItems / itemsPerPage);

			return tpl.smallScreen(this.pagesNo);
		};

		/**
		 * Setup pagination controls
		 *
		 * @param {Element} paginationContainer jQuery or DOM element.
		 * @param {Function} onPageIndexChange Function that will receive new index.
		 */
		this.setupControls = function (paginationContainer, onPageIndexChange) {
			var $pageIndex = $('[name="'+tpl.pageIndexName()+'"]', paginationContainer);
			// select
			if ($pageIndex.length && $pageIndex[0].nodeName.toLowerCase() === 'select') {
				$pageIndex.unbind().change(function (){
					onPageIndexChange($pageIndex.val());
				});
			}
			// radio
			else {
				$pageIndex.unbind().change(function (){
					onPageIndexChange($pageIndex.filter(':checked').val());
				});
			}

			// prev/next button
			$('[data-id="prev"]', paginationContainer).unbind().click(function (){
				var index = _self.currentPageIndex;
				if (index > 0) {
					onPageIndexChange(index - 1);
				}
			});
			$('[data-id="next"]', paginationContainer).unbind().click(function (){
				var index = _self.currentPageIndex;
				if (index < _self.pagesNo - 1) {
					onPageIndexChange(index + 1);
				}
			});
		};
	};

	/**
	 * Page helper class.
	 *
	 * @param {String} pageId Id of the page (container ID).
	 * @returns {$mJ.controller.Page}
	 */
	$mJ.controller.Page = function (pageId) {
		var _page = this;
		this.id = pageId;
		this.container = document.getElementById(pageId);
		this.selector = '#'+pageId;
		this.header = {
			$container : $('[data-role=header]', _page.container)
		};
		this.content = {
			$container : $('[data-role=content]', _page.container)
		};
	};

})(jQuery, window.mJappisApplication);