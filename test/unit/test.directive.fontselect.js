/* global DEFAULT_WEBSAFE_FONTS, $rootScope, $compile, $injector, $scope, elm, $rootScope,
          NAME_JDFONTLIST_CONTROLLER, $controller, NAME_FONTSSERVICE, ANOTHER_FONT, AND_SOME_FONT_MORE */
describe('fontselect directive', function() {
  'use strict';

  var mainToggleButton;

  beforeEach(function() {
    mainToggleButton = elm.find('button[ng-click="toggle()"]');
  });

  it('should add an wrapper element with fs-main class.', function() {
    expect(elm.find('.jdfs-main').length).toBe(1);
  });

  it('should replace the fontselect element.', function() {
    expect(elm.find('jd-fontselect').length).toBe(0);
  });

  it('should have a toggle button', function() {
    expect(mainToggleButton.length).toBe(1);
  });

  it('should become active when button is clicked', function() {
    expect($scope.active).toBe(false);
    mainToggleButton.click();
    expect($scope.active).toBe(true);
  });

  it('should have no current font on initiation.', function() {
    expect($scope.currentFont).not.toBeDefined();
  });

  it('should provide a list with some fonts', function() {
    expect(elm.find('li').length).toBe(5);
  });

  it('should not show the font-select window when inactive', function() {
    expect(elm.find('.jdfs-window.ng-hide').length).toBe(1);
  });

  it('should show the font-select window when active', function() {
    mainToggleButton.click();
    expect(elm.find('.jdfs-window.ng-hide').length).toBe(0);
  });

  it('should expend if we add a new font via the fonts service', function() {
    var length = elm.find('li').length;

    $injector.get('jdFontselect.fonts').add(ANOTHER_FONT);

    $scope.$digest();
    expect(elm.find('li').length).toBe(length + 1);
  });

  it('should have an id', function() {
    expect(elm.find('.jdfs-main').attr('id')).toBe('jd-fontselect-1');
  });

  it('should increase the id for every instance', function() {
    var elm2 = angular.element(
      '<div>' +
        '<jd-fontselect />' +
      '</div>');

    $compile(elm2)($rootScope);
    $rootScope.$digest();

    expect(elm2.find('.jdfs-main').attr('id')).toBe('jd-fontselect-2');
  });


  describe('font list', function() {

    function normalizeFontStack(stack) {
      stack = stack.replace(/"/g, '\'').split(',');
      angular.forEach(stack, function(font, i) {
        stack[i] = font.replace(/^\s+|\s+$/g, '');
      });

      return stack.join(',');
    }

    it('should have radio buttons inside the list items', function() {
      expect(elm.find('li input[type="radio"]').length).toBe(5);
    });

    it('should have labels for the radio buttons', function() {
      expect(elm.find('li label').length).toBe(5);
    });

    it('should link the labels to the radio buttons', function() {
      var radio = elm.find('input[type="radio"]');
      expect(radio.attr('id'))
        .toBe(radio.siblings('label').first().attr('for'));
    });

    it('should be able to provide a preview of the font', function() {
      expect(normalizeFontStack(elm.find('li label').eq(0).css('font-family')))
        .toBe(normalizeFontStack(DEFAULT_WEBSAFE_FONTS[2].stack));
    });

    it('should create multiple font lists for providers', function() {
      expect(elm.find('.jdfs-provider').length).toBeGreaterThan(1);
    });
  });

  describe('search', function() {
    it('should have a search input field', function() {
      expect(elm.find('input[name="jdfs-1-search"]').length).toBe(1);
    });
  });

  describe('category filter', function() {
    it('should have a list with categories', function() {
      expect(elm.find('button[ng-model="current.category"]').length).toBe(5);
    });

    it('should be able to change the current category filter with the setCategoryFilter method', function() {
      expect($scope.current.category).toBeUndefined();
      $scope.setCategoryFilter('foo');
      expect($scope.current.category).toBe('foo');
    });
  });

  describe('sorting', function() {
    it('should have a sort select dropdown', function() {
      expect(elm.find('select[ng-model="current.sort.attr"]').length).toBe(1);
    });

    it('should have a way to reverse the sorting', function() {
      expect(elm.find('button[ng-click="reverseSort()"]').length).toBe(1);
    });

    it('should negotiate the sort direction with the reverseSort method', function() {
      expect($scope.current.sort.direction).toBe(true);
      $scope.reverseSort();
      expect($scope.current.sort.direction).toBe(false);
    });
  });

  describe('character sets', function() {
    var fontsService;

    beforeEach(function() {
      fontsService = $injector.get(NAME_FONTSSERVICE);
    });

    it('should have a list of subsets', function() {
      expect(fontsService.getSubsets()).toBeInstanceOf(Array);
    });

    it('should try to add new subsets when we add a new font', function() {
      spyOn(fontsService, '_addSubsets');
      fontsService.add(ANOTHER_FONT);
      expect(fontsService._addSubsets).toHaveBeenCalled();
    });

    it('should expand the list of subsets if new are present', function() {
      var listBefore = fontsService._subsets.length;
      fontsService.add(AND_SOME_FONT_MORE);
      expect(fontsService._subsets.length).toBe(listBefore + 1);
    });

    it('should not add existing subsets', function() {
      var listBefore = fontsService._subsets.length;
      fontsService.add(ANOTHER_FONT);
      expect(fontsService._subsets.length).toBe(listBefore);
    });

    it('should generate a name from given subset key', function() {
      expect(fontsService._subsetNames['latin-ext']).toBe('Latin Ext');
    });

    it('should have checkboxes for all subsets', function() {
      expect(elm.find('input[type="checkbox"]').length).toBe(fontsService._subsets.length);
    });
  });

  describe('filter caching', function() {

    var spies = {}, $listScope;

    function expectAllSpiesCalled(times) {
      filterCalled('filter', times);
      filterCalled('orderBy', times);
      filterCalled('fuzzySearch', times);
      filterCalled('hasAllSubsets', times);
    }

    function filterCalled(name, times) {
      expect(spies[name].calls.length).toBe(times);
    }

    beforeEach(function() {
      $listScope = elm.find('h3').scope();

      spies.orderBy = jasmine.createSpy('orderBy');
      spies.filter = jasmine.createSpy('filter');
      spies.fuzzySearch = jasmine.createSpy('fuzzySearch');
      spies.hasAllSubsets = jasmine.createSpy('hasAllSubsets');

      var $filter = $injector.get('$filter');

      $controller(NAME_JDFONTLIST_CONTROLLER, {
        $scope: $listScope,
        $filter: function(name) {
          return spies[name].andCallFake($filter(name));
        },
        fontsService: $injector.get('jdFontselect.fonts')
      });

      expectAllSpiesCalled(0);
      $listScope.getFilteredFonts();
      expectAllSpiesCalled(1);
    });

    it('should not execute the filters twice if the filters have not changed', function() {
      $listScope.getFilteredFonts();
      expectAllSpiesCalled(1);
    });

    it('should call all filters when we change the source', function() {
      $injector.get('jdFontselect.fonts').add(ANOTHER_FONT);
      $listScope.getFilteredFonts();
      expectAllSpiesCalled(2);
    });

    it('should call all filters when we change the subset', function() {
      expectAllSpiesCalled(1);
      $listScope.current.subsets = {foo: true};
      $listScope.getFilteredFonts();
      expectAllSpiesCalled(2);
    });

    it('should call all next filters when we resort', function() {
      $listScope.current.sort.direction = false;
      $listScope.getFilteredFonts();
      filterCalled('filter', 2);
      filterCalled('fuzzySearch', 2);
      $listScope.current.sort.attr = false;
      $listScope.getFilteredFonts();
      filterCalled('filter', 3);
      filterCalled('fuzzySearch', 3);
    });

    it('should not call orderBy filter when we change the category or search', function() {
      filterCalled('orderBy', 1);
      $listScope.current.category = 'olive';
      $listScope.getFilteredFonts();
      filterCalled('orderBy', 1);
      $listScope.current.search = 'foob';
      $listScope.getFilteredFonts();
      filterCalled('orderBy', 1);
    });

    it('should call filter filter when we change the category', function() {
      filterCalled('filter', 1);
      $listScope.current.category = 'olive';
      $listScope.getFilteredFonts();
      filterCalled('filter', 2);
    });

    it('should not call orderBy and filter filter when search', function() {
      filterCalled('orderBy', 1);
      filterCalled('filter', 1);
      $listScope.current.search = 'foob';
      $listScope.getFilteredFonts();
      filterCalled('orderBy', 1);
      filterCalled('filter', 1);
    });

    it('should call the fuzzySearch filter when we search', function() {
      filterCalled('fuzzySearch', 1);
      $listScope.current.search = 'olive';
      $listScope.getFilteredFonts();
      filterCalled('fuzzySearch', 2);
    });
  });

});
