angular.module('jdFontselect').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/partials/current-href.html',
    "<link ng-href={{url}} ng-repeat=\"url in urls\">"
  );


  $templateCache.put('src/partials/font.html',
    "<li><input type=radio ng-model=current.font ng-value=font name=jdfs-{{id}}-font id=jdfs-{{id}}-font-{{font.key}}><label ng-class=\"{'jdfs-active jdfs-highlight': current.font.name == font.name}\" for=jdfs-{{id}}-font-{{font.key}} style=\"font-family: {{font.stack}}\">{{font.name}}</label></li>"
  );


  $templateCache.put('src/partials/fontlist.html',
    "<div class=jdfs-fontlistcon ng-class=\"{'jdfs-active': isActive()}\"><button class=\"jdfs-fontpagination jdfs-fontpagination-prev\" ng-click=\"paginate('prev')\" ng-class=\"{'jdfs-disabled': !paginationButtonActive('prev')}\" ng-disabled=\"!paginationButtonActive('prev')\">{{text.page.prev}}</button><ul class=jdfs-fontlist><li ng-if=\"getFilteredFonts().length === 0\" class=jdfs-fontlist-noresults>{{text.noResultsLabel}}</li><jd-font ng-repeat=\"font in getFilteredFonts() | startFrom: page.current * page.size | limitTo: page.size\"></ul><button class=\"jdfs-fontpagination jdfs-fontpagination-next\" ng-click=\"paginate('next')\" ng-class=\"{'jdfs-disabled': !paginationButtonActive('next')}\" ng-disabled=\"!paginationButtonActive('next')\">{{text.page.next}}</button></div>"
  );


  $templateCache.put('src/partials/fontselect.html',
    "<div class=jdfs-main id=jd-fontselect-{{id}}><button ng-click=toggleSearch() ng-class=\"{'jdfs-highlight': searching}\" class=jdfs-search-indicator>{{text.searchToggleLabel}}</button> <button ng-click=toggleSearch() class=jdfs-toggle-search ng-show=!searching><span class=jdfs-font-name style=\"font-family: {{current.font.stack}}\">{{current.font.name || text.toggleSearchLabel}}</span></button> <input class=jdfs-search placeholder={{text.search}} name=jdfs-{{id}}-search ng-show=searching ng-model=current.search> <button class=jdfs-reset-search ng-click=resetSearch() ng-show=\"searching && current.search.length > 0\">x</button> <button class=jdfs-toggle ng-click=toggle() ng-class=\"{'jdfs-highlight': active}\">{{active ? text.toggleCloseLabel : text.toggleOpenLabel}}</button><div class=jdfs-window ng-show=active><jd-fontlist fsid=id text=text meta=meta current=current fonts=fonts active=active></jd-fontlist><div class=jdfs-footer-con><a class=\"jdfs-footer-tab-toggle jdfs-styles-label\" ng-click=toggleStyles() ng-class=\"{'jdfs-footer-tab-open': stylesActive}\">{{text.styleLabel}}</a> <a class=\"jdfs-footer-tab-toggle jdfs-settings-label\" ng-click=toggleSettings() ng-class=\"{'jdfs-footer-tab-open': settingsActive}\">{{text.settingsLabel}}</a><div class=jdfs-footer><div class=jdfs-styles ng-show=stylesActive><button class=\"jdfs-filterbtn jdfs-fontstyle-{{category.key}}\" ng-repeat=\"category in categories\" ng-class=\"{'jdfs-active jdfs-highlight': category.key == current.category}\" ng-click=setCategoryFilter(category.key) ng-model=current.category>{{text.category[category.key] || toName(category.key)}}</button></div><div class=jdfs-settings ng-show=settingsActive><div class=jdfs-provider-list><h4 class=jdfs-settings-headline>{{text.providerLabel}}</h4><div ng-repeat=\"(provider, active) in current.providers\" class=jdfs-provider ng-class=\"{'jdfs-active jdfs-highlight': current.providers[provider]}\"><input ng-model=current.providers[provider] type=checkbox id=jdfs-{{id}}-provider-{{provider}}><label for=jdfs-{{id}}-provider-{{provider}}>{{text.provider[provider] || toName(provider)}}</label></div></div><div class=jdfs-subsets><h4 class=jdfs-settings-headline>{{text.subsetLabel}}</h4><div ng-repeat=\"(key, name) in current.subsets\" class=jdfs-subset ng-class=\"{'jdfs-active jdfs-highlight': current.subsets[key]}\"><input ng-model=current.subsets[key] type=checkbox id=jdfs-{{id}}-subset-{{key}}><label for=jdfs-{{id}}-subset-{{key}}>{{text.subset[key] || toName(key)}}</label></div></div></div></div></div><jd-meta meta=meta></jd-meta><button ng-click=toggle() class=jdfs-close><span>{{text.closeButton}}</span></button></div></div>"
  );


  $templateCache.put('src/partials/meta.html',
    "<div class=jdfs-meta><div class=jdfs-fontcount>{{text.fontFabel}} <span ng-if=\"meta.fonts.current == meta.fonts.total\">{{meta.fonts.total}}</span> <span ng-if=\"meta.fonts.total && meta.fonts.current != meta.fonts.total\">{{meta.fonts.current}}/{{meta.fonts.total}}</span> <span ng-if=!meta.fonts.total>…</span></div><div class=jdfs-pagecon>{{text.pageLabel}} <span class=jdfs-page-current>{{meta.page.currentAbs + 1}}</span>/<span class=jdfs-page-count>{{meta.page.count}}</span></div></div>"
  );

}]);
