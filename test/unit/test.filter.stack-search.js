/* global DEFAULT_WEBSAFE_FONTS, initGlobals, $injector */
describe('stackSearch filter', function() {
  var filter;

  beforeEach(function() {
    initGlobals();
    filter = $injector.get('$filter')('stackSearch');
  });

  it('should exist', function() {
    expect(filter).toBeInstanceOf(Function);
  });

  it('should return empty result if given wrong stack', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, false)).toEqual([]);
  });

  it('should have a consistent set of fixture fonts', function() {
    expect(DEFAULT_WEBSAFE_FONTS.length).toBe(6);
    expect(DEFAULT_WEBSAFE_FONTS[0].name).toBe('Arial');
  });

  it('should find a font by a part of its stack', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, DEFAULT_WEBSAFE_FONTS[0].stack)).toEqual([DEFAULT_WEBSAFE_FONTS[0]]);
  });

  it('should find a font by a part of its stack', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, 'Arial')).toEqual([DEFAULT_WEBSAFE_FONTS[0]]);
  });

  it('should find the best fallback font if multiple stacks are matching', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, 'Helvetica')).toEqual([DEFAULT_WEBSAFE_FONTS[3]]);
  });

  it('should return multiple fonts when we cant not figure out the best one', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, 'sans-serif')).toEqual([DEFAULT_WEBSAFE_FONTS[0], DEFAULT_WEBSAFE_FONTS[3]]);
  });

  describe('caching', function() {
    it('should not create a weighted font List for the same input twice', function() {
      spyOn(filter, 'createWeightedFontList').and.callThrough();
      filter(DEFAULT_WEBSAFE_FONTS, 'Helvetica');
      filter(DEFAULT_WEBSAFE_FONTS, 'Arial');
      expect(filter.createWeightedFontList.calls.count()).toBe(1);
    });
  });

  describe('normalizeStack helper', function() {
    var normalizeStack;

    beforeEach(function() {
      normalizeStack = filter.normalizeStack;
    });

    it('should exist', function() {
      expect(normalizeStack).toBeInstanceOf(Function);
    });

    it('should split a string by comma', function() {
      expect(normalizeStack('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('should clean up every token', function() {
      expect(normalizeStack('foo   ,"bar lorem " ')).toEqual(['foo', 'bar lorem']);
    });
  });

});
