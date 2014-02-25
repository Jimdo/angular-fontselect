/* jshint unused: false */
function _createKey(name) {
  return name.toLowerCase().replace(/[^a-z]+/g, '-');
}

function _createName(key) {
  var words = key.replace('-', ' ').split(' ');

  for (var i = 0, l = words.length; i < l; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join(' ');
}