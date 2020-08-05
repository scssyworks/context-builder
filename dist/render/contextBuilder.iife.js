
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var Select = /*#__PURE__*/function () {
    function Select(selector, thisParent) {
      _classCallCheck(this, Select);

      // Check if document and document.body exist
      this.body = typeof document !== 'undefined' && document && document.body; // Resolve parent

      this.parent = thisParent || null; // Resolve references

      this.elements = [];

      if (this.body && selector) {
        if (typeof selector === 'string') {
          this.elements = _toConsumableArray(document.querySelectorAll(selector));
        } else if (selector instanceof Node) {
          this.elements = [selector];
        } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
          this.elements = _toConsumableArray(selector);
        } else if (Object.prototype.hasOwnProperty.call(selector, 'length')) {
          // For jQuery or jQuery like objects
          for (var i = 0; i < selector.length; i++) {
            this.elements.push(selector[i]);
          }
        } else if (selector instanceof Select) {
          this.elements = _toConsumableArray(selector.elements);
          this.parent = selector.parent;
        }
      }
    }
    /**
     * Query children of current element
     * @param {string} selector Selector
     */


    _createClass(Select, [{
      key: "query",
      value: function query(selector) {
        var selected = [];
        this.elements.forEach(function (el) {
          var children = _toConsumableArray(el.querySelectorAll(selector));

          children.forEach(function (child) {
            if (selected.indexOf(child) === -1) {
              selected.push(children);
            }
          });
        });
        return new Select(selected, this);
      }
      /**
       * Appends HTML body to current element(s)
       * @param {string | Node | NodeList | HTMLCollection | Node[] | Select} nodes 
       */

    }, {
      key: "append",
      value: function append(nodes) {
        if (this.body) {
          var consumableNodes;

          if (typeof nodes === 'string') {
            // Expecting a plain HTML string
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = nodes;
            consumableNodes = new Select(tempDiv.childNodes);
          } else {
            // For everything else treat them as regular nodes
            consumableNodes = new Select(nodes);
          }

          this.elements.forEach(function (target, i) {
            if (consumableNodes.elements.length === 1) {
              target.appendChild(consumableNodes.elements[0]); // Keeping intact the original reference
            } else {
              var fragment = document.createDocumentFragment();
              consumableNodes.elements.forEach(function (n) {
                fragment.appendChild(i === 0 ? n : n.cloneNode());
              });
              target.appendChild(fragment);
            }
          });
        }

        return this;
      }
      /**
       * Prepends HTML body to current element(s)
       * @param {string | Node | NodeList | HTMLCollection | Node[] | Select} nodes
       */

    }, {
      key: "prepend",
      value: function prepend(nodes) {
        if (this.body) {
          this.elements.forEach(function (target) {
            var currentFragment = new Select(target.childNodes).detach();
            new Select(target).append(nodes).append(currentFragment);
          });
        }

        return this;
      }
      /**
       * Removes current set of elements from DOM and return DocumentFragment as a Select instance
       */

    }, {
      key: "detach",
      value: function detach() {
        if (this.body) {
          var fragment = document.createDocumentFragment();
          this.elements.forEach(function (el) {
            fragment.appendChild(el);
          });
          return new Select(fragment);
        }

        return this;
      }
      /**
       * Clears current elements inner HTML
       */

    }, {
      key: "clear",
      value: function clear() {
        if (this.body) {
          this.elements.forEach(function (el) {
            el.innerHTML = '';
          });
        }

        return this;
      }
      /**
       * Returns current map of HTML strings
       */

    }, {
      key: "htmlMap",
      value: function htmlMap() {
        return this.map(function (el) {
          return el.innerHTML;
        });
      }
      /**
       * Returns current map of text strings
       */

    }, {
      key: "textMap",
      value: function textMap() {
        return this.map(function (el) {
          return el.textContent || el.innerText;
        });
      }
      /**
       * Returns current list of element as array
       * @param {Function} evaluatorFn Evaluator function
       */

    }, {
      key: "map",
      value: function map(evaluatorFn) {
        if (!this.body || typeof evaluatorFn !== 'function') {
          return this.elements;
        }

        return this.elements.map(evaluatorFn);
      }
      /**
       * Returns current body tag as a Select instance
       */

    }, {
      key: "getBodyTag",
      value: function getBodyTag() {
        return new Select(this.body);
      }
      /**
       * Returns current Select reference children
       */

    }, {
      key: "children",
      value: function children() {
        var elements = [];
        this.elements.forEach(function (el) {
          _toConsumableArray(el.childNodes).forEach(function (n) {
            if (elements.indexOf(n) === -1) {
              elements.push(n);
            }
          });
        });
        return new Select(elements);
      }
      /**
       * Binds a regular event listener
       */

    }, {
      key: "on",
      value: function on() {
        var _arguments = arguments;
        this.elements.forEach(function (el) {
          el.addEventListener.apply(el, _toConsumableArray(_arguments));
        });
        return this;
      }
      /**
       * Removes a regular event listener
       */

    }, {
      key: "off",
      value: function off() {
        var _arguments2 = arguments;
        this.elements.forEach(function (el) {
          el.removeEventListener.apply(el, _toConsumableArray(_arguments2));
        });
        return this;
      }
      /**
       * Static method to create a new HTML node
       * @param {string | Node | NodeList | HTMLCollection | Node[] | Select} nodes
       */

    }], [{
      key: "create",
      value: function create(nodes) {
        return new Select(document.createDocumentFragment()).append(nodes).children();
      }
    }]);

    return Select;
  }();

  var ContextMenu = function ContextMenu(target) {
    var _this = this;

    _classCallCheck(this, ContextMenu);

    this.contextTarget = typeof target === 'string' ? new Select(target) : new Select().getBodyTag();
    this.isSupported = !!this.contextTarget.body;
    this.rootElement = Select.create("<ul class=\"context-menu-list context-hidden\"></ul>");
    var ref = this;
    this.contextTarget.on('contextmenu', function (e) {
      e.preventDefault();
      new Select(this).append(ref.rootElement);
    }).on('click', function () {
      _this.rootElement = _this.rootElement.detach().children();
    });
    this.rootElement.on('click', function (e) {
      e.stopPropagation();
    });
  }; // Generates a context list

  console.log(new ContextMenu());

}());
//# sourceMappingURL=contextBuilder.iife.js.map
