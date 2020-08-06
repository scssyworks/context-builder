(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.contextBuilder = {}));
}(this, (function (exports) { 'use strict';

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

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = privateMap.get(receiver);

    if (!descriptor) {
      throw new TypeError("attempted to get private field on non-instance");
    }

    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }

    return descriptor.value;
  }

  function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = privateMap.get(receiver);

    if (!descriptor) {
      throw new TypeError("attempted to set private field on non-instance");
    }

    if (descriptor.set) {
      descriptor.set.call(receiver, value);
    } else {
      if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
      }

      descriptor.value = value;
    }

    return value;
  }

  var Select = /*#__PURE__*/function () {
    function Select(selector) {
      _classCallCheck(this, Select);

      // Check if document and document.body exist
      this.body = typeof document !== 'undefined' && document && document.body; // Resolve references

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
      } // Resolve parent


      this.parent = this.getParentSelection();
    }
    /**
     * Returns a Select object for parent nodes
     */


    _createClass(Select, [{
      key: "getParentSelection",
      value: function getParentSelection() {
        var parentNodeList = this.elements.map(function (el) {
          return el.parentNode;
        }).filter(function (el) {
          return !!el;
        });

        if (parentNodeList.length) {
          return new Select(parentNodeList);
        }

        return null;
      }
      /**
       * Query children of current element
       * @param {string} selector Selector
       */

    }, {
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
        return new Select(selected);
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
       * Auto detach event listener after first call
       * @param {string} eventType Event name
       * @param {Function} cb Callback function
       * @param {boolean} useCapture Use capture mode
       */

    }, {
      key: "once",
      value: function once(eventType, cb, useCapture) {
        var ref = this;

        var onceCb = function onceCb() {
          cb.apply(this, arguments);
          ref.elements.forEach(function (el) {
            el.removeEventListener(eventType, onceCb, useCapture);
          });
        };

        this.elements.forEach(function (el) {
          el.addEventListener(eventType, onceCb, useCapture);
        });
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
       * Sets HTML element attributes
       * @param {object} obj HTML element attributes
       */

    }, {
      key: "setAttr",
      value: function setAttr(obj) {
        this.elements.forEach(function (el) {
          Object.keys(obj).forEach(function (attr) {
            el.setAttribute(attr, obj[attr]);
          });
        });
        return this;
      }
      /**
       * Returns a map of attribute values for selected elements
       * @param {string} attr Attribute
       */

    }, {
      key: "getAttrMap",
      value: function getAttrMap(attr) {
        return this.map(function (el) {
          return el.getAttribute(attr);
        });
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
       * Returns true if current element is contained in this selector
       * @param {Node | NodeList | HTMLCollection | Select} nodes Element
       */

    }, {
      key: "contains",
      value: function contains(nodes) {
        var _this = this;

        return new Select(nodes).map(function (n) {
          var _iterator = _createForOfIteratorHelper(_this.elements),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var el = _step.value;

              if (el.contains(n)) {
                return true;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return false;
        }).indexOf(false) === -1;
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
        left: "".concat(this.getClientX(event), "px"),
        maxWidth: "".concat(this.windowProps.width - 10, "px"),
        maxHeight: "".concat(this.windowProps.height - 10, "px"),
        overflow: 'auto'
      });
    }
    /**
     * Returns context menu's approximate position on X axis
     * @param {Event} event Event object
     */


    _createClass(CursorPlacement, [{
      key: "getClientX",
      value: function getClientX(event) {
        var displacement = event.clientX + this.targetPlacement.width - this.windowProps.width;

        if (displacement > 0) {
          return event.clientX - displacement - 4;
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
        var displacement = event.clientY + this.targetPlacement.height - this.windowProps.height;

        if (displacement > 0) {
          return event.clientY - displacement - 4;
        }

        return event.clientY;
      }
    }]);

    return CursorPlacement;
  }();

  var _listeners = new WeakMap();

  var _open = new WeakMap();

  var ContextMenu = /*#__PURE__*/function () {
    function ContextMenu(target, config) {
      var _this = this;

      _classCallCheck(this, ContextMenu);

      _listeners.set(this, {
        writable: true,
        value: []
      });

      _open.set(this, {
        writable: true,
        value: false
      });

      if (config && _typeof(config) === 'object') {
        this.config = Object.freeze(config);
      }

      this.contextTarget = typeof target === 'string' ? new Select(target) : new Select().getBodyTag();
      this.isSupported = !!this.contextTarget.body;
      this.rootElement = Select.create(this.config && this.config.rootElement ? this.config.rootElement : "<ul class=\"context-menu-list\"></ul>");
      var ref = this;

      var onContextMenu = function onContextMenu(e) {
        e.preventDefault();

        if (!_classPrivateFieldGet(ref, _open)) {
          new Select(this).append(ref.rootElement);
          new CursorPlacement(e, ref.rootElement);

          if (ref.config && typeof ref.config.onActivate === 'function') {
            ref.rootElement.repaint();
            config.onActivate(ref.rootElement);

            _classPrivateFieldSet(ref, _open, true);
          }
        }
      };

      var exitFunction = function exitFunction() {
        _this.rootElement = _this.rootElement.detach().children();

        _classPrivateFieldSet(_this, _open, false);
      };

      var onClick = function onClick() {
        if (_this.config && typeof config.onDeactivate === 'function') {
          config.onDeactivate(_this.rootElement, exitFunction);
        } else {
          exitFunction();
        }
      };

      var onRootClick = function onRootClick(e) {
        e.stopPropagation();

        if (_this.config && typeof _this.config.onClick === 'function') {
          var shouldExit = _this.config.onClick.apply(new Select(e.target), [e]);

          if (shouldExit) {
            if (typeof _this.config.onDeactivate === 'function') {
              _this.config.onDeactivate(_this.rootElement, exitFunction);
            } else {
              exitFunction();
            }
          }
        }
      };

      _classPrivateFieldGet(this, _listeners).push({
        onContextMenu: onContextMenu
      }, {
        onClick: onClick
      }, {
        onRootClick: onRootClick
      });

      this.contextTarget.on('contextmenu', onContextMenu).on('click', onClick);
      this.rootElement.on('click', onRootClick);
    }

    _createClass(ContextMenu, [{
      key: "add",
      value: function add() {
        var elements = Array.prototype.slice.call(arguments);

        var _iterator = _createForOfIteratorHelper(elements),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var element = _step.value;

            if (element instanceof ContextList || element instanceof ContextItem) {
              this.rootElement.append(element.rootElement);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return this;
      }
    }, {
      key: "cleanup",
      value: function cleanup() {
        var onContextMenu = _classPrivateFieldGet(this, _listeners).filter(function (fn) {
          return Object.prototype.hasOwnProperty.call(fn, 'onContextMenu');
        })[0].onContextMenu;

        var onClick = _classPrivateFieldGet(this, _listeners).filter(function (fn) {
          return Object.prototype.hasOwnProperty.call(fn, 'onClick');
        })[0].onClick;

        var onRootClick = _classPrivateFieldGet(this, _listeners).filter(function (fn) {
          return Object.prototype.hasOwnProperty.call(fn, 'onRootClick');
        })[0].onRootClick;

        this.contextTarget.off('contextmenu', onContextMenu).off('click', onClick);
        this.rootElement.off('click', onRootClick);
      }
    }]);

    return ContextMenu;
  }(); // Generates a context list

  var ContextList = /*#__PURE__*/function () {
    function ContextList(title, config) {
      _classCallCheck(this, ContextList);

      if (config && _typeof(config) === 'object') {
        this.config = Object.freeze(config);
      }

      this.rootElement = Select.create(this.config && this.config.rootElement ? this.config.rootElement : "<li class=\"menu-item\"></li>");
      this.rootElement.setAttr({
        'data-has-sub-elements': true
      });
      this.listElement = Select.create(this.config && this.config.listElement ? this.config.listElement : "<ul class=\"context-submenu\"></ul>");
      this.rootElement.append(title).append(this.listElement);
    }

    _createClass(ContextList, [{
      key: "add",
      value: function add() {
        var elements = Array.prototype.slice.call(arguments);

        var _iterator2 = _createForOfIteratorHelper(elements),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var element = _step2.value;

            if (element instanceof ContextList || element instanceof ContextItem) {
              this.listElement.append(element.rootElement);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        return this;
      }
    }, {
      key: "parent",
      get: function get() {
        return this.rootElement.parent;
      }
    }]);

    return ContextList;
  }(); // Generates a context item

  var ContextItem = function ContextItem(title, config) {
    _classCallCheck(this, ContextItem);

    if (config && _typeof(config) === 'object') {
      this.config = Object.freeze();
    }

    this.rootElement = Select.create(this.config && this.config.rootElement ? this.config.rootElement : "<li class=\"menu-item\"></li>");
    this.rootElement.append(title);
  };

  exports.ContextItem = ContextItem;
  exports.ContextList = ContextList;
  exports.ContextMenu = ContextMenu;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=contextBuilder.js.map