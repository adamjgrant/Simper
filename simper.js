var simple_persistence = {}

function ready(fn) {
  if (document.readyState != 'loading'){ fn(); }
  else { document.addEventListener('DOMContentLoaded', fn); }
}

// Allow storing objects in localstorage (from http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage)
Storage.prototype.setObject = function(key, value) { this.setItem(key, JSON.stringify(value)); }
Storage.prototype.getObject = function(key) { var value = this.getItem(key); return value && JSON.parse(value); }

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
  if (typeof localStorage === 'object') {
      try {
          localStorage.setItem('localStorage', 1);
          localStorage.removeItem('localStorage');
      } catch (e) {
          Storage.prototype._setItem = Storage.prototype.setItem;
          Storage.prototype.setItem = function() {};
          console.error('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
          return
      }
  }

  var persistedElements = Array.prototype.slice.call(document.querySelectorAll('[data-persist-key]')),
      state = localStorage.getObject('simple_persistence');

  persistedElements.forEach(function(persistedElement) {
    if (persistedElement.dataset['persistKey'] && state) {
      var _classes = state[persistedElement.dataset.persistKey]
      { persistedElement.setAttribute('class', '');

      _classes.forEach(function(_class) {
        persistedElement.classList.add(_class);
      })
    }
  });
});
