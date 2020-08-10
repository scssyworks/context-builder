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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

      _defineProperty(this, "body", void 0);

      _defineProperty(this, "elements", void 0);

      _defineProperty(this, "parent", void 0);

      // Check if document and document.body exist
      this.body = typeof document !== 'undefined' && !!document && document.body; // Resolve references

      this.elements = [];

      if (this.body && selector) {
        if (typeof selector === 'string') {
          this.elements = _toConsumableArray(document.querySelectorAll(selector));
        } else if (selector instanceof Node || selector instanceof EventTarget) {
          this.elements = [selector];
        } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
          this.elements = _toConsumableArray(selector);
        } else if (Object.prototype.hasOwnProperty.call(selector, 'length')) {
          // For jQuery or jQuery like objects
          for (var _i = 0; _i < selector.length; _i++) {
            this.elements.push(selector[_i]);
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
          if (el instanceof HTMLElement) {
            var children = _toConsumableArray(el.querySelectorAll(selector));

            children.forEach(function (child) {
              if (selected.indexOf(child) === -1) {
                selected.push(child);
              }
            });
          }
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
            if (el instanceof HTMLElement) {
              el.innerHTML = '';
            }
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
          if (el instanceof HTMLElement) {
            return el.innerHTML;
          }

          return '';
        });
      }
      /**
       * Returns current map of text strings
       */

    }, {
      key: "textMap",
      value: function textMap() {
        return this.map(function (el) {
          if (el instanceof HTMLElement) {
            return el.textContent || el.innerText;
          }

          return '';
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
      value: function on(eventType, cb, useCapture) {
        this.elements.forEach(function (el) {
          el.addEventListener(eventType, cb, useCapture);
        });
        return this;
      }
      /**
       * Removes a regular event listener
       */

    }, {
      key: "off",
      value: function off(eventType, cb, useCapture) {
        this.elements.forEach(function (el) {
          el.removeEventListener(eventType, cb, useCapture);
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

        var onceCb = function onceCb(e) {
          cb.apply(this, [e]);
          ref.elements.forEach(function (el) {
            el.removeEventListener(eventType, onceCb, useCapture);
          });
        };

        this.elements.forEach(function (el) {
          el.addEventListener(eventType, onceCb, useCapture);
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
          if (el instanceof HTMLElement) {
            return el.getBoundingClientRect();
          }

          return null;
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
          if (el instanceof HTMLElement) {
            Object.keys(obj).forEach(function (prop) {
              el.style[prop] = obj[prop];
            });
          }
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
          if (el instanceof HTMLElement) {
            Object.keys(obj).forEach(function (attr) {
              el.setAttribute(attr, obj[attr]);
            });
          }
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
          if (el instanceof HTMLElement) {
            return el.getAttribute(attr);
          }

          return undefined;
        });
      }
      /**
       * Enforce a repaint of targeted elements
       */

    }, {
      key: "repaint",
      value: function repaint() {
        this.elements.forEach(function (el) {
          if (el instanceof HTMLElement) {
            el.offsetHeight; // Accessing offset height somehow triggers a reflow
          }
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

      _defineProperty(this, "target", void 0);

      _defineProperty(this, "targetPlacement", void 0);

      _defineProperty(this, "windowProps", void 0);

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
        if (this.targetPlacement) {
          var displacement = event.clientX + this.targetPlacement.width - this.windowProps.width;

          if (displacement > 0) {
            return event.clientX - displacement - 4;
          }
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
        if (this.targetPlacement) {
          var displacement = event.clientY + this.targetPlacement.height - this.windowProps.height;

          if (displacement > 0) {
            return event.clientY - displacement - 4;
          }
        }

        return event.clientY;
      }
    }]);

    return CursorPlacement;
  }();

  if (typeof window !== 'undefined') {
    // Polyfill custom event
    if (typeof window.CustomEvent === 'undefined') {
      var _CustomEvent = function _CustomEvent(event, params) {
        _classCallCheck(this, _CustomEvent);

        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      };

      _CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = _CustomEvent;
    }
  }

  var _parentThis = new WeakMap();

  var _body = new WeakMap();

  var _beaconEvent = new WeakMap();

  var _resolver = new WeakMap();

  var _beaconListener = new WeakMap();

  var Beacon = /*#__PURE__*/function () {
    function Beacon(parentThis) {
      var _this = this;

      _classCallCheck(this, Beacon);

      _parentThis.set(this, {
        writable: true,
        value: void 0
      });

      _body.set(this, {
        writable: true,
        value: void 0
      });

      _beaconEvent.set(this, {
        writable: true,
        value: 'closecontextmenu'
      });

      _resolver.set(this, {
        writable: true,
        value: void 0
      });

      _beaconListener.set(this, {
        writable: true,
        value: function value(e) {
          var _ref = e.detail,
              originContext = _ref.originContext;

          if (typeof _classPrivateFieldGet(_this, _resolver) === 'function') {
            _classPrivateFieldGet(_this, _resolver).call(_this, originContext !== _classPrivateFieldGet(_this, _parentThis));
          }
        }
      });

      _classPrivateFieldSet(this, _parentThis, parentThis);

      if (typeof document !== 'undefined') {
        _classPrivateFieldSet(this, _body, document.body);
      }
    }

    _createClass(Beacon, [{
      key: "emit",
      value: function emit() {
        if (_classPrivateFieldGet(this, _body)) {
          var contextMenuClose = new CustomEvent(_classPrivateFieldGet(this, _beaconEvent), {
            cancelable: true,
            bubbles: true,
            detail: {
              originContext: _classPrivateFieldGet(this, _parentThis)
            }
          });

          _classPrivateFieldGet(this, _body).dispatchEvent(contextMenuClose);
        }
      }
    }, {
      key: "listen",
      value: function listen(resolve) {
        var _classPrivateFieldGet2;

        _classPrivateFieldSet(this, _resolver, resolve);

        (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _body)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.addEventListener(_classPrivateFieldGet(this, _beaconEvent), _classPrivateFieldGet(this, _beaconListener));
      }
    }, {
      key: "off",
      value: function off() {
        var _classPrivateFieldGet3;

        (_classPrivateFieldGet3 = _classPrivateFieldGet(this, _body)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.removeEventListener(_classPrivateFieldGet(this, _beaconEvent), _classPrivateFieldGet(this, _beaconListener));

        _classPrivateFieldSet(this, _resolver, undefined);
      }
    }]);

    return Beacon;
  }();

  var _open = new WeakMap();

  var _active = new WeakMap();

  var _beacon = new WeakMap();

  var _exitFunction = new WeakMap();

  var _onClick = new WeakMap();

  var _onContextMenu = new WeakMap();

  var _onRootClick = new WeakMap();

  var ContextMenu = /*#__PURE__*/function () {
    function ContextMenu(target, config) {
      var _this = this;

      _classCallCheck(this, ContextMenu);

      _open.set(this, {
        writable: true,
        value: false
      });

      _active.set(this, {
        writable: true,
        value: false
      });

      _beacon.set(this, {
        writable: true,
        value: void 0
      });

      _exitFunction.set(this, {
        writable: true,
        value: function value() {
          _this.rootElement = _this.rootElement.detach().children();

          _classPrivateFieldSet(_this, _open, false);

          _classPrivateFieldSet(_this, _active, false);
        }
      });

      _onClick.set(this, {
        writable: true,
        value: function value() {
          if (_classPrivateFieldGet(_this, _active)) {
            if (_this.config && typeof _this.config.onDeactivate === 'function') {
              _classPrivateFieldSet(_this, _open, true);

              _this.config.onDeactivate(_this.rootElement, _classPrivateFieldGet(_this, _exitFunction));
            } else {
              _classPrivateFieldGet(_this, _exitFunction).call(_this);
            }
          }
        }
      });

      _onContextMenu.set(this, {
        writable: true,
        value: function value(e) {
          e.preventDefault();
          e.stopPropagation(); // For nested context menus

          _classPrivateFieldGet(_this, _beacon).emit(); // Sends notification to other context menu instances to automatically close


          _classPrivateFieldSet(_this, _active, true);

          if (!_classPrivateFieldGet(_this, _open)) {
            _this.contextTarget.append(_this.rootElement);

            new CursorPlacement(e, _this.rootElement);

            if (_this.config && typeof _this.config.onActivate === 'function') {
              _this.rootElement.repaint();

              _this.config.onActivate(_this.rootElement);
            }
          }
        }
      });

      _onRootClick.set(this, {
        writable: true,
        value: function value(e) {
          e.stopPropagation();

          if (_this.config && typeof _this.config.onClick === 'function') {
            var shouldExit = _this.config.onClick.apply(new Select(e.target), [e]);

            if (shouldExit) {
              _classPrivateFieldGet(_this, _onClick).call(_this);
            }
          }
        }
      });

      _defineProperty(this, "contextTarget", void 0);

      _defineProperty(this, "isSupported", void 0);

      _defineProperty(this, "rootElement", void 0);

      _defineProperty(this, "config", {});

      _classPrivateFieldSet(this, _beacon, new Beacon(this));

      if (config && _typeof(config) === 'object') {
        this.config = Object.freeze(config);
      }

      this.contextTarget = typeof target === 'string' ? new Select(target) : new Select().getBodyTag();
      this.isSupported = !!this.contextTarget.body;
      this.rootElement = Select.create(this.config && this.config.rootElement ? this.config.rootElement : "<ul class=\"context-menu-list\"></ul>");
      this.contextTarget.on('contextmenu', _classPrivateFieldGet(this, _onContextMenu));

      if (this.contextTarget.body) {
        new Select(this.contextTarget.body).on('click', _classPrivateFieldGet(this, _onClick));
      }

      _classPrivateFieldGet(this, _beacon).listen(function (shouldClose) {
        if (shouldClose) {
          _classPrivateFieldGet(_this, _onClick).call(_this);
        }
      });

      this.rootElement.on('click', _classPrivateFieldGet(this, _onRootClick));
    }

    _createClass(ContextMenu, [{
      key: "add",
      value: function add() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var elements = [].concat(args);

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
        this.contextTarget.off('contextmenu', _classPrivateFieldGet(this, _onContextMenu)).off('click', _classPrivateFieldGet(this, _onClick));
        this.rootElement.off('click', _classPrivateFieldGet(this, _onRootClick));

        _classPrivateFieldGet(this, _beacon).off();
      }
    }]);

    return ContextMenu;
  }(); // Generates a context list

  var ContextList = /*#__PURE__*/function () {
    function ContextList(title, config) {
      _classCallCheck(this, ContextList);

      _defineProperty(this, "config", {});

      _defineProperty(this, "rootElement", void 0);

      _defineProperty(this, "listElement", void 0);

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
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var elements = [].concat(args);

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

    _defineProperty(this, "config", {});

    _defineProperty(this, "rootElement", void 0);

    if (config && _typeof(config) === 'object') {
      this.config = Object.freeze(config);
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
