var simple_persistence = {}

function ready(fn) {
  if (document.readyState != 'loading'){ fn(); }
  else { document.addEventListener('DOMContentLoaded', fn); }
}

// Allow storing objects in localstorage (from http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage)
Storage.prototype.setObject = function(key, value) { this.setItem(key, JSON.stringify(value)); }
Storage.prototype.getObject = function(key) { var value = this.getItem(key); return value && JSON.parse(value); }

// Automatically cache state when retrieved.
var setStateCache = function(state, context, key) {
  localStorage.setObject(key, state)
}

// Save class state
window.addEventListener('beforeunload', function() {
  var persistedElements = Array.prototype.slice.call(document.querySelectorAll('[data-persist-key]'));
  persistedElements.forEach(function(persistedElement) {
    simple_persistence[persistedElement.dataset.persistKey] = Array.prototype.slice.call(persistedElement.classList)
  });
  localStorage.setObject('simple_persistence', simple_persistence)
});

// Get class state
ready(function() {
  var persistedElements = Array.prototype.slice.call(document.querySelectorAll('[data-persist-key]')),
      state = localStorage.getObject('simple_persistence');

  persistedElements.forEach(function(persistedElement) {
    var _classes = state[persistedElement.dataset.persistKey]
    persistedElement.setAttribute('class', '');

    _classes.forEach(function(_class) {
      persistedElement.classList.add(_class);
    })
  });
});
