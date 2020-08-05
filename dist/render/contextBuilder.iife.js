
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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
       * Returns map of DOMRect objects
       */

    }, {
      key: "bounds",
      value: function bounds() {
        return this.map(function (el) {
          return el.getBoundingClientRect();
        });
      }
      /**
       * Sets CSS properties to element(s)
       * @param {object} obj CSS properties
       */

    }, {
      key: "setCSSProps",
      value: function setCSSProps(obj) {
        this.elements.forEach(function (el) {
          Object.keys(obj).forEach(function (prop) {
            el.style[prop] = obj[prop];
          });
        });
        return this;
      }
      /**
       * Enforce a repaint of targeted elements
       */

    }, {
      key: "repaint",
      value: function repaint() {
        this.elements.forEach(function (el) {
          el.offsetHeight; // Accessing offset height somehow triggers a reflow
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

  var CursorPlacement = /*#__PURE__*/function () {
    function CursorPlacement(event, element) {
      _classCallCheck(this, CursorPlacement);

      this.target = new Select(element);
      this.targetPlacement = this.target.bounds()[0];
      this.windowProps = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      this.target.setCSSProps({
        position: 'fixed',
        top: "".concat(this.getClientY(event), "px"),
        left: "".concat(this.getClientX(event), "px")
      });
    }
    /**
     * Returns context menu's approximate position on X axis
     * @param {Event} event Event object
     */


    _createClass(CursorPlacement, [{
      key: "getClientX",
      value: function getClientX(event) {
        if (event.clientX + this.targetPlacement.width > this.windowProps.width) {
          return event.clientX - this.targetPlacement.width;
        }

        return event.clientX;
      }
      /**
       * Returns context menu's approximate position on Y axis
       * @param {Event} event Event object
       */

    }, {
      key: "getClientY",
      value: function getClientY(event) {
        if (event.clientY + this.targetPlacement.height > this.windowProps.height) {
          return event.clientY - this.targetPlacement.height;
        }

        return event.clientY;
      }
    }]);

    return CursorPlacement;
  }();

  var ContextMenu = /*#__PURE__*/function () {
    function ContextMenu(target, config) {
      var _this = this;

      _classCallCheck(this, ContextMenu);

      if (config && _typeof(config) === 'object') {
        this.config = Object.freeze(config);
      }

      this.contextTarget = typeof target === 'string' ? new Select(target) : new Select().getBodyTag();
      this.isSupported = !!this.contextTarget.body;
      this.rootElement = Select.create(this.config && this.config.rootElement ? this.config.rootElement : "<ul class=\"context-menu-list\"></ul>");
      var ref = this;
      this.contextTarget.on('contextmenu', function (e) {
        e.preventDefault();
        new Select(this).append(ref.rootElement);
        new CursorPlacement(e, ref.rootElement);

        if (ref.config && typeof ref.config.onActivate === 'function') {
          ref.rootElement.repaint();
          config.onActivate(ref.rootElement.map());
        }
      }).on('click', function () {
        var exitFunction = function exitFunction() {
          _this.rootElement = _this.rootElement.detach().children();
        };

        if (_this.config && typeof config.onDeactivate === 'function') {
          config.onDeactivate(exitFunction);
        } else {
          exitFunction();
        }
      });
      this.rootElement.on('click', function (e) {
        e.stopPropagation();
      });
    }

    _createClass(ContextMenu, [{
      key: "add",
      value: function add(element) {
        if (element instanceof ContextList || element instanceof ContextItem) {
          this.rootElement.append(element.rootElement);
        }
      }
    }]);

    return ContextMenu;
  }(); // Generates a context list

  var ContextList = function ContextList(title, config) {
    _classCallCheck(this, ContextList);

    if (config && _typeof(config) === 'object') {
      this.config = Object.freeze(config);
    }

    this.rootElement = Select.create(this.config && this.config.rootElement ? this.config.rootElement : "<li class=\"menu-item\"></li>");
    this.listElement = Select.create(this.config && this.config.listElement ? this.config.listElement : "<ul class=\"context-submenu\"></ul>");
    this.rootElement.append(title).append(this.listElement);
  }; // Generates a context item

  var ContextItem = function ContextItem() {
    _classCallCheck(this, ContextItem);
  };

  var menu = new ContextMenu();
  menu.add(new ContextList('test'));

}());
//# sourceMappingURL=contextBuilder.iife.js.map
