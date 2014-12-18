/* global $injector, initGlobals */
describe('fuzzy search filter', function() {
  var filter;

  /** @const */
  var DEMO_INPUT = [
    {
      foo: 'Bar',
      lorem: 'Ipsum',
      drrt: 'bax'
    },
    {
      foo: 'Baz',
      lorem: 'Dolor',
      drrt: 'hihihi'
    },
    {
      foo: 'Bat',
      lorem: 'It',
      drrt: 'mehehe'
    },
    {
      foo: 'Bax',
      lorem: 'Amed',
      drrt: 'fhhht'
    },
  ];

  var STRICT_OPTIONS = {
    tePercent: 0
  };

  beforeEach(function() {
    initGlobals();
    filter = $injector.get('$filter')('fuzzySearch');
  });

  it('should exist', function() {
    expect(filter).toBeInstanceOf(Function);
  });

  it('should search all object entries if we provide a string', function() {
    expect(filter(DEMO_INPUT, 'Bax', STRICT_OPTIONS).length).toBe(2);
  });

  it('should search only on our key if we provide an object', function() {
    expect(filter(DEMO_INPUT, {drrt: 'Bax'}, STRICT_OPTIONS).length).toBe(1);
    expect(filter(DEMO_INPUT, {foo: 'Bax'}, STRICT_OPTIONS).length).toBe(1);
  });

  it('should reduce our input', function() {
    var result = filter(DEMO_INPUT, {foo: 'Bar'}, STRICT_OPTIONS);
    expect(result.length).toBe(1);
    expect(result[0].foo).toBe('Bar');
  });

  it('should reduce our input when substring found', function() {
    var result = filter(DEMO_INPUT, {foo: 'ax'}, STRICT_OPTIONS);
    expect(result.length).toBe(1);
    expect(result[0].foo).toBe('Bax');
  });

  it('should allow leaving out some chars', function() {
    var result = filter(DEMO_INPUT, {foo: 'Br'}, STRICT_OPTIONS);
    expect(result.length).toBe(1);
    expect(result[0].foo).toBe('Bar');
  });

  it('should allow typing errors', function() {
    var result = filter(DEMO_INPUT, {lorem: 'Ixsum'});
    expect(result.length).toBe(1);
    expect(result[0].foo).toBe('Bar');
  });

  it('should not allow to mutch typing errors', function() {
    expect(filter(DEMO_INPUT, {lorem: 'Ixxsum'}).length).toBe(0);
  });

  it('should be fuzzy', function() {
    expect(filter(DEMO_INPUT, {drrt: 'hhhe'}).length).toBe(3);
  });

  it('should not be too fuzzy', function() {
    var result = filter(DEMO_INPUT, {drrt: 'hhihe'});
    expect(result.length).toBe(1);
    expect(result[0].foo).toBe('Baz');
  });

});