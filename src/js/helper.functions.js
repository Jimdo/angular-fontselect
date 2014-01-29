/* jshint unused: false */
function _bind(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
}

function _createKey(name) {
  return name.toLowerCase().replace(/[^a-z]+/g, '-');
}
