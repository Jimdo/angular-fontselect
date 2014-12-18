/* global DEFAULT_WEBSAFE_FONTS, initGlobals, $injector */
describe('hasAllSubsets filter', function() {
  var filter;

  beforeEach(function() {
    initGlobals();
    filter = $injector.get('$filter')('hasAllSubsets');
    expect(DEFAULT_WEBSAFE_FONTS.length).toBe(6);
  });

  it('should exist', function() {
    expect(filter).toBeInstanceOf(Function);
  });

  it('should always return arrays', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, {foo: true})).toBeInstanceOf(Array);
    expect(filter(DEFAULT_WEBSAFE_FONTS, {foo: false})).toBeInstanceOf(Array);
  });

  it('should find all fonts with greek script', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, {greek: true}).length).toBe(3);
  });

  it('should find all latin extended fonts', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, {'latin-ext': true}).length).toBe(1);
  });

  it('should ignore falsy filter entries', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, {greek: false}).length).toBe(6);
  });

  it('should only return items that contain all required subsets', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, {greek: true, latin: true}).length).toBe(3);
  });

  it('should remove all entries when no subsets are found', function() {
    expect(filter(DEFAULT_WEBSAFE_FONTS, {foo: true}).length).toBe(0);
  });
});
