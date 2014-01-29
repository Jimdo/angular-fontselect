/* global FontselectController, DEFAULT_WEBSAFE_FONTS, $rootScope, $compile, $injector, $scope, elm  */
describe('fontselect directive', function() {
  'use strict';

  var mainToggleButton;

  beforeEach(function() {
    mainToggleButton = elm.find('button[ng-click="toggle()"]');
  });

  it('s controller should exist', function() {
    expect(FontselectController).toBeDefined();
  });

  it('should be able to get itself', function() {
    expect($scope.getSelf()).toBeInstanceOf(FontselectController);
  });

  it('should add an wrapper element with fs-main class.', inject(function() {
    expect(elm.find('.fs-main').length).toBe(1);
  }));

  it('should replace the fontselect element.', function() {
    expect(elm.find('fontselect').length).toBe(0);
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

  describe('direct out', function() {
    var hiddeninput;
    beforeEach(function() {
      hiddeninput = elm.find('input[type="hidden"]');
    });

    it('should have a hidden input element', function() {
      expect(hiddeninput.length).toBe(1);
    });

    it('\'s hidden input should have the active font as a value', function() {
      expect(hiddeninput.val()).toBe('');
    });
  });

  it('should provide a list with some fonts', function() {
    expect(elm.find('li').length).toBe(5);
  });

  it('should not show the font-select window when inactive', function() {
    expect(elm.find('.fs-window.ng-hide').length).toBe(1);
  });

  it('should show the font-select window when active', function() {
    mainToggleButton.click();
    expect(elm.find('.fs-window.ng-hide').length).toBe(0);
  });

  it('should expend if we add a new font via the fonts service', function() {
    var length = elm.find('li').length;

    $injector.get('jdFontselect.fonts')
      .add({name: 'Drrrt', key: 'drt', stack: 'Bar, sans-serif'});

    $scope.$digest();
    expect(elm.find('li').length).toBe(length + 1);
  });

  it('should have an id', function() {
    expect(elm.find('.fs-main').attr('id')).toBe('fontselect-1');
  });

  it('should increase the id for every instance', function() {
    var elm2 = angular.element(
      '<div>' +
        '<jd-fontselect />' +
      '</div>');

    $compile(elm2)($rootScope);
    $rootScope.$digest();

    expect(elm2.find('.fs-main').attr('id')).toBe('fontselect-2');
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
      expect(elm.find('input[type="radio"]').attr('id'))
        .toBe(elm.find('label').attr('for'));
    });

    it('should be able to provide a preview of the font', function() {

      expect(normalizeFontStack(elm.find('li label').eq(0).css('font-family')))
        .toBe(normalizeFontStack(DEFAULT_WEBSAFE_FONTS[0].stack));
    });

    it('should create multiple font lists for providers', function() {
      expect(elm.find('.jd-fontselect-provider').length).toBeGreaterThan(1);
    });
  });

  describe('search', function() {
    it('should have a search input field', function() {
      expect(elm.find('input[name="fs-1-search"]').length).toBe(1);
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

});
