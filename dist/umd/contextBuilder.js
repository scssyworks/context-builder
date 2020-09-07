(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.contextBuilder = {}));
}(this, (function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    module.exports = _typeof = function _typeof(obj) {
	      return typeof obj;
	    };
	  } else {
	    module.exports = _typeof = function _typeof(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	module.exports = _typeof;
	});

	var runtime_1 = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function define(obj, key, value) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	    return obj[key];
	  }
	  try {
	    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
	    define({}, "");
	  } catch (err) {
	    define = function(obj, key, value) {
	      return obj[key] = value;
	    };
	  }

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  exports.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = define(
	    GeneratorFunctionPrototype,
	    toStringTagSymbol,
	    "GeneratorFunction"
	  );

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      define(prototype, method, function(arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }

	  exports.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  exports.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      define(genFun, toStringTagSymbol, "GeneratorFunction");
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  exports.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return PromiseImpl.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return PromiseImpl.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  exports.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    if (PromiseImpl === void 0) PromiseImpl = Promise;

	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList),
	      PromiseImpl
	    );

	    return exports.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  define(Gp, toStringTagSymbol, "Generator");

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  exports.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };

	  // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.
	  return exports;

	}(
	  // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	   module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  Function("r", "regeneratorRuntime = r")(runtime);
	}
	});

	var regenerator = runtime_1;

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
	  try {
	    var info = gen[key](arg);
	    var value = info.value;
	  } catch (error) {
	    reject(error);
	    return;
	  }

	  if (info.done) {
	    resolve(value);
	  } else {
	    Promise.resolve(value).then(_next, _throw);
	  }
	}

	function _asyncToGenerator(fn) {
	  return function () {
	    var self = this,
	        args = arguments;
	    return new Promise(function (resolve, reject) {
	      var gen = fn.apply(self, args);

	      function _next(value) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
	      }

	      function _throw(err) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
	      }

	      _next(undefined);
	    });
	  };
	}

	var asyncToGenerator = _asyncToGenerator;

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var classCallCheck = _classCallCheck;

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

	var createClass = _createClass;

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

	var defineProperty = _defineProperty;

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

	var classPrivateFieldGet = _classPrivateFieldGet;

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

	var classPrivateFieldSet = _classPrivateFieldSet;

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	var arrayLikeToArray = _arrayLikeToArray;

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return arrayLikeToArray(arr);
	}

	var arrayWithoutHoles = _arrayWithoutHoles;

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
	}

	var iterableToArray = _iterableToArray;

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
	}

	var unsupportedIterableToArray = _unsupportedIterableToArray;

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	var nonIterableSpread = _nonIterableSpread;

	function _toConsumableArray(arr) {
	  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
	}

	var toConsumableArray = _toConsumableArray;

	var isPromise_1 = isPromise;
	var _default = isPromise;

	function isPromise(obj) {
	  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	}
	isPromise_1.default = _default;

	function isEnvBrowser() {
	  return typeof document !== 'undefined' && Boolean(document.body);
	}
	function asyncResolve(_x) {
	  return _asyncResolve.apply(this, arguments);
	}

	function _asyncResolve() {
	  _asyncResolve = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(input) {
	    var returnValue;
	    return regenerator.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            if (!isPromise_1(input)) {
	              _context.next = 11;
	              break;
	            }

	            _context.prev = 1;
	            _context.next = 4;
	            return input;

	          case 4:
	            returnValue = _context.sent;
	            return _context.abrupt("return", returnValue);

	          case 8:
	            _context.prev = 8;
	            _context.t0 = _context["catch"](1);
	            console.error(_context.t0);

	          case 11:
	            return _context.abrupt("return", input);

	          case 12:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _callee, null, [[1, 8]]);
	  }));
	  return _asyncResolve.apply(this, arguments);
	}

	function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (_e) { function e(_x) { return _e.apply(this, arguments); } e.toString = function () { return _e.toString(); }; return e; }(function (e) { throw e; }), f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function (_e2) { function e(_x2) { return _e2.apply(this, arguments); } e.toString = function () { return _e2.toString(); }; return e; }(function (e) { didErr = true; err = e; }), f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

	function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	if (typeof document !== 'undefined') {
	  var win = document.defaultView; // Polyfill custom event

	  if (typeof win.CustomEvent === 'undefined') {
	    var _CustomEvent = function _CustomEvent(event, params) {
	      classCallCheck(this, _CustomEvent);

	      params = params || {
	        bubbles: false,
	        cancelable: false,
	        detail: undefined
	      };
	      var evt = document.createEvent('CustomEvent');
	      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	      return evt;
	    };

	    _CustomEvent.prototype = win.Event.prototype;
	    win.CustomEvent = _CustomEvent;
	  }
	}

	var _body = new WeakMap();

	var Select = /*#__PURE__*/function () {
	  function Select(selector) {
	    classCallCheck(this, Select);

	    _body.set(this, {
	      writable: true,
	      value: void 0
	    });

	    defineProperty(this, "elements", void 0);

	    defineProperty(this, "parent", void 0);

	    // Check if document and document.body exist
	    if (isEnvBrowser()) {
	      classPrivateFieldSet(this, _body, document.body);
	    } // Resolve references


	    this.elements = [];

	    if (classPrivateFieldGet(this, _body) && selector) {
	      if (typeof selector === 'string') {
	        this.elements = toConsumableArray(document.querySelectorAll(selector));
	      } else if (selector instanceof Node || selector instanceof EventTarget) {
	        this.elements = [selector];
	      } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
	        this.elements = toConsumableArray(selector);
	      } else if (Object.prototype.hasOwnProperty.call(selector, 'length')) {
	        // For jQuery or jQuery like objects
	        for (var _i = 0; _i < selector.length; _i++) {
	          this.elements.push(selector[_i]);
	        }
	      } else if (selector instanceof Select) {
	        this.elements = toConsumableArray(selector.elements);
	        this.parent = selector.parent;
	      }
	    } // Resolve parent


	    this.parent = this.getParentNode();
	  }
	  /**
	   * Returns a Select object for parent nodes
	   */


	  createClass(Select, [{
	    key: "getParentNode",
	    value: function getParentNode() {
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
	     * Returns a Select object for all parents
	     */

	  }, {
	    key: "getAllParents",
	    value: function getAllParents() {
	      var currRef = new Select(this);
	      var parentsList = new Select();

	      do {
	        currRef = currRef.getParentNode();

	        if (currRef) {
	          parentsList.add(currRef);
	        }
	      } while (currRef);

	      return parentsList;
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
	          var children = toConsumableArray(el.querySelectorAll(selector));

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
	      if (classPrivateFieldGet(this, _body)) {
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
	      if (classPrivateFieldGet(this, _body)) {
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
	      if (classPrivateFieldGet(this, _body)) {
	        var fragment = document.createDocumentFragment();
	        this.elements.forEach(function (el) {
	          fragment.appendChild(el);
	        });
	        return new Select(fragment);
	      }

	      return this;
	    }
	    /**
	     * Returns current list of element as array
	     * @param {Function} evaluatorFn Evaluator function
	     */

	  }, {
	    key: "map",
	    value: function map(evaluatorFn) {
	      if (!classPrivateFieldGet(this, _body) || typeof evaluatorFn !== 'function') {
	        return this.elements;
	      }

	      return this.elements.map(evaluatorFn);
	    }
	    /**
	     * Filter elements based on returned condition
	     * @param {Function} evaluatorFn Evaluator function
	     */

	  }, {
	    key: "filter",
	    value: function filter(evaluatorFn) {
	      var matched = [];
	      this.map(function (el, i) {
	        if (evaluatorFn(el, i)) {
	          matched.push(el);
	        }
	      });
	      return new Select(matched);
	    }
	    /**
	     * Merges passed selection to current object
	     * @param {Select} selection input selection
	     */

	  }, {
	    key: "add",
	    value: function add(selection) {
	      var _this$elements;

	      (_this$elements = this.elements).push.apply(_this$elements, toConsumableArray(selection.elements));

	      return this;
	    }
	    /**
	     * Returns current body tag as a Select instance
	     */

	  }, {
	    key: "getBodyTag",
	    value: function getBodyTag() {
	      return new Select(classPrivateFieldGet(this, _body));
	    }
	    /**
	     * Returns current Select reference children
	     */

	  }, {
	    key: "children",
	    value: function children() {
	      var elements = [];
	      this.elements.forEach(function (el) {
	        toConsumableArray(el.childNodes).forEach(function (n) {
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
	        el.addEventListener("".concat(eventType), cb, useCapture);
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
	        ref.off(eventType, onceCb, useCapture);
	      };

	      this.on(eventType, onceCb, useCapture);
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
	     * @param {boolean} polite Flag to set attributes politely
	     */

	  }, {
	    key: "setAttr",
	    value: function setAttr(obj) {
	      var polite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      this.elements.forEach(function (el) {
	        if (el instanceof HTMLElement) {
	          Object.keys(obj).forEach(function (attr) {
	            if (!polite || polite && el.hasAttribute(attr)) {
	              el.setAttribute(attr, "".concat(obj[attr]));
	            }
	          });
	        }
	      });
	      return this;
	    }
	    /**
	     * Enforce a repaint of targeted elements
	     */

	  }, {
	    key: "reflow",
	    value: function reflow() {
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
	     * Removes the current element from DOM entirely
	     */

	  }, {
	    key: "remove",
	    value: function remove() {
	      this.elements.forEach(function (el) {
	        var _el$parentNode;

	        (_el$parentNode = el.parentNode) === null || _el$parentNode === void 0 ? void 0 : _el$parentNode.removeChild(el);
	      });
	      return this;
	    }
	    /**
	     * Emits a browser event
	     * @param {string} eventName Event name
	     * @param {any[]} args Parameters
	     */

	  }, {
	    key: "emit",
	    value: function emit(eventName) {
	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var customEvent = new CustomEvent(eventName, {
	        cancelable: true,
	        bubbles: true,
	        detail: {
	          args: args
	        }
	      });
	      this.elements.forEach(function (el) {
	        el.dispatchEvent(customEvent);
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
	      if (nodes instanceof HTMLTemplateElement) {
	        return new Select(nodes.content).children(); // Content is a fragment itself
	      }

	      return new Select(document.createDocumentFragment()).append(nodes).children();
	    }
	  }]);

	  return Select;
	}();

	var CursorPlacement = /*#__PURE__*/function () {
	  function CursorPlacement(event, element) {
	    classCallCheck(this, CursorPlacement);

	    defineProperty(this, "target", void 0);

	    defineProperty(this, "targetPlacement", void 0);

	    defineProperty(this, "windowProps", void 0);

	    var win = typeof document !== 'undefined' && document.defaultView || {
	      innerWidth: 0,
	      innerHeight: 0
	    };
	    this.target = new Select(element);
	    this.targetPlacement = this.target.bounds()[0];
	    this.windowProps = {
	      width: win.innerWidth,
	      height: win.innerHeight
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


	  createClass(CursorPlacement, [{
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

	var _parentThis = new WeakMap();

	var _root = new WeakMap();

	var _beaconEvent = new WeakMap();

	var _resolver = new WeakMap();

	var _beaconListener = new WeakMap();

	var Beacon = /*#__PURE__*/function () {
	  function Beacon(parentThis) {
	    var _this = this;

	    classCallCheck(this, Beacon);

	    _parentThis.set(this, {
	      writable: true,
	      value: void 0
	    });

	    _root.set(this, {
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
	            args = _ref.args;

	        if (typeof classPrivateFieldGet(_this, _resolver) === 'function') {
	          classPrivateFieldGet(_this, _resolver).call(_this, args[0] !== classPrivateFieldGet(_this, _parentThis));
	        }
	      }
	    });

	    classPrivateFieldSet(this, _parentThis, parentThis);

	    if (isEnvBrowser()) {
	      classPrivateFieldSet(this, _root, new Select(document));
	    }
	  }

	  createClass(Beacon, [{
	    key: "emit",
	    value: function emit() {
	      if (classPrivateFieldGet(this, _root)) {
	        classPrivateFieldGet(this, _root).emit(classPrivateFieldGet(this, _beaconEvent), classPrivateFieldGet(this, _parentThis));
	      }
	    }
	  }, {
	    key: "listen",
	    value: function listen(resolve) {
	      var _classPrivateFieldGet2;

	      classPrivateFieldSet(this, _resolver, resolve);

	      (_classPrivateFieldGet2 = classPrivateFieldGet(this, _root)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.on(classPrivateFieldGet(this, _beaconEvent), classPrivateFieldGet(this, _beaconListener));
	    }
	  }, {
	    key: "off",
	    value: function off() {
	      var _classPrivateFieldGet3;

	      (_classPrivateFieldGet3 = classPrivateFieldGet(this, _root)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.off(classPrivateFieldGet(this, _beaconEvent), classPrivateFieldGet(this, _beaconListener));

	      classPrivateFieldSet(this, _resolver, undefined);
	    }
	  }]);

	  return Beacon;
	}();

	var _ref = new WeakMap();

	var _handlers = new WeakMap();

	var EventEmitter = /*#__PURE__*/function () {
	  function EventEmitter(thisRef) {
	    classCallCheck(this, EventEmitter);

	    _ref.set(this, {
	      writable: true,
	      value: void 0
	    });

	    _handlers.set(this, {
	      writable: true,
	      value: []
	    });

	    classPrivateFieldSet(this, _ref, thisRef);
	  }

	  createClass(EventEmitter, [{
	    key: "on",
	    value: function on(type, handler) {
	      classPrivateFieldGet(this, _handlers).push({
	        type: type,
	        handler: handler
	      });
	    }
	  }, {
	    key: "off",
	    value: function off(targetType, targetHandler) {
	      if (typeof targetType !== 'string') {
	        classPrivateFieldGet(this, _handlers).length = 0;
	      } else {
	        classPrivateFieldSet(this, _handlers, classPrivateFieldGet(this, _handlers).filter(function (_ref2) {
	          var type = _ref2.type,
	              handler = _ref2.handler;
	          return !(type === targetType && (typeof targetHandler === 'undefined' || handler === targetHandler));
	        }));
	      }
	    }
	  }, {
	    key: "emit",
	    value: function emit(type) {
	      var _this = this;

	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var returnedValues = [];

	      classPrivateFieldGet(this, _handlers).forEach(function (currEvent) {
	        if (currEvent.type === type) {
	          returnedValues.push(currEvent.handler.apply(classPrivateFieldGet(_this, _ref), args));
	        }
	      });

	      return returnedValues;
	    }
	  }, {
	    key: "hasListener",
	    value: function hasListener(type) {
	      return Boolean(classPrivateFieldGet(this, _handlers).filter(function (evt) {
	        return evt.type === type;
	      }).length);
	    }
	  }]);

	  return EventEmitter;
	}();

	function _createForOfIteratorHelper$1(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

	function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	var _open = new WeakMap();

	var _active = new WeakMap();

	var _doc = new WeakMap();

	var _beacon = new WeakMap();

	var _eventEmitter = new WeakMap();

	var _body$1 = new WeakMap();

	var _exitFunction = new WeakMap();

	var _onClick = new WeakMap();

	var _getReferenceTarget = new WeakMap();

	var _onContextMenu = new WeakMap();

	var _onRootClick = new WeakMap();

	var _onBeforeCleanup = new WeakMap();

	var _performCleanup = new WeakMap();

	var ContextMenu = /*#__PURE__*/function () {
	  function ContextMenu(_target, config) {
	    var _this = this;

	    classCallCheck(this, ContextMenu);

	    _open.set(this, {
	      writable: true,
	      value: false
	    });

	    _active.set(this, {
	      writable: true,
	      value: false
	    });

	    _doc.set(this, {
	      writable: true,
	      value: void 0
	    });

	    _beacon.set(this, {
	      writable: true,
	      value: void 0
	    });

	    _eventEmitter.set(this, {
	      writable: true,
	      value: void 0
	    });

	    _body$1.set(this, {
	      writable: true,
	      value: void 0
	    });

	    defineProperty(this, "contextTarget", void 0);

	    defineProperty(this, "isSupported", void 0);

	    defineProperty(this, "rootElement", void 0);

	    defineProperty(this, "config", {});

	    _exitFunction.set(this, {
	      writable: true,
	      value: function value() {
	        var _classPrivateFieldGet2;

	        _this.rootElement = _this.rootElement.detach().children();

	        classPrivateFieldSet(_this, _open, false);

	        classPrivateFieldSet(_this, _active, false);

	        _this.contextTarget.setAttr({
	          'aria-expanded': false
	        }, true);

	        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }

	        (_classPrivateFieldGet2 = classPrivateFieldGet(_this, _eventEmitter)).emit.apply(_classPrivateFieldGet2, ['closed'].concat(args));
	      }
	    });

	    _onClick.set(this, {
	      writable: true,
	      value: function value() {
	        if (classPrivateFieldGet(_this, _active)) {
	          if (typeof _this.config.onDeactivate === 'function' || classPrivateFieldGet(_this, _eventEmitter).hasListener('deactivate')) {
	            classPrivateFieldSet(_this, _open, true);

	            if (_this.config.onDeactivate) {
	              _this.config.onDeactivate(_this.rootElement, classPrivateFieldGet(_this, _exitFunction));
	            }

	            classPrivateFieldGet(_this, _eventEmitter).emit('deactivate', _this.rootElement, classPrivateFieldGet(_this, _exitFunction));
	          } else {
	            classPrivateFieldGet(_this, _exitFunction).call(_this);
	          }
	        }
	      }
	    });

	    _getReferenceTarget.set(this, {
	      writable: true,
	      value: function value(target) {
	        var currentTarget = new Select(target);
	        return currentTarget.getAllParents().add(currentTarget).filter(function (el) {
	          return el instanceof HTMLElement && el.hasAttribute('data-cm-host');
	        });
	      }
	    });

	    _onContextMenu.set(this, {
	      writable: true,
	      value: function value(e) {
	        e.preventDefault();
	        e.stopPropagation(); // For nested context menus

	        classPrivateFieldGet(_this, _beacon).emit(); // Sends notification to other context menu instances to automatically close


	        classPrivateFieldSet(_this, _active, true);

	        if (!classPrivateFieldGet(_this, _open)) {
	          classPrivateFieldGet(_this, _getReferenceTarget).call(_this, e.target).setAttr({
	            'aria-expanded': true
	          }, true);

	          classPrivateFieldGet(_this, _body$1).append(_this.rootElement);

	          new CursorPlacement(e, _this.rootElement);

	          if (typeof _this.config.onActivate === 'function') {
	            _this.rootElement.reflow();

	            _this.config.onActivate.apply(_this.rootElement, [_this.rootElement]);
	          }

	          if (typeof _this.config.onContextMenu === 'function') {
	            _this.config.onContextMenu.apply(_this.rootElement, [e]);
	          }

	          classPrivateFieldGet(_this, _eventEmitter).emit('activate', _this.rootElement);

	          classPrivateFieldGet(_this, _eventEmitter).emit('contextmenu', e);
	        }
	      }
	    });

	    _onRootClick.set(this, {
	      writable: true,
	      value: function () {
	        var _value = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(e) {
	          return regenerator.wrap(function _callee2$(_context2) {
	            while (1) {
	              switch (_context2.prev = _context2.next) {
	                case 0:
	                  e.stopPropagation();

	                  if (!(typeof _this.config.onClick === 'function' || classPrivateFieldGet(_this, _eventEmitter).hasListener('click'))) {
	                    _context2.next = 8;
	                    break;
	                  }

	                  if (!_this.config.onClick) {
	                    _context2.next = 7;
	                    break;
	                  }

	                  _context2.next = 5;
	                  return asyncResolve(_this.config.onClick.apply(new Select(e.target), [e]));

	                case 5:
	                  if (!_context2.sent) {
	                    _context2.next = 7;
	                    break;
	                  }

	                  classPrivateFieldGet(_this, _onClick).call(_this);

	                case 7:
	                  classPrivateFieldGet(_this, _eventEmitter).emit('click', e, new Select(e.target)).forEach( /*#__PURE__*/function () {
	                    var _ref = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(shouldExit) {
	                      return regenerator.wrap(function _callee$(_context) {
	                        while (1) {
	                          switch (_context.prev = _context.next) {
	                            case 0:
	                              _context.next = 2;
	                              return asyncResolve(shouldExit);

	                            case 2:
	                              if (!_context.sent) {
	                                _context.next = 4;
	                                break;
	                              }

	                              classPrivateFieldGet(_this, _onClick).call(_this);

	                            case 4:
	                            case "end":
	                              return _context.stop();
	                          }
	                        }
	                      }, _callee);
	                    }));

	                    return function (_x2) {
	                      return _ref.apply(this, arguments);
	                    };
	                  }());

	                case 8:
	                case "end":
	                  return _context2.stop();
	              }
	            }
	          }, _callee2);
	        }));

	        function value(_x) {
	          return _value.apply(this, arguments);
	        }

	        return value;
	      }()
	    });

	    _onBeforeCleanup.set(this, {
	      writable: true,
	      value: function value(cb) {
	        if (typeof cb === 'function') {
	          var result = cb();
	          return typeof result === 'undefined' || result;
	        }

	        return true;
	      }
	    });

	    _performCleanup.set(this, {
	      writable: true,
	      value: function value() {
	        _this.contextTarget.off('contextmenu', classPrivateFieldGet(_this, _onContextMenu)).off('click', classPrivateFieldGet(_this, _onClick));

	        _this.rootElement.off('click', classPrivateFieldGet(_this, _onRootClick)).remove();

	        if (isEnvBrowser()) {
	          var _classPrivateFieldGet3;

	          (_classPrivateFieldGet3 = classPrivateFieldGet(_this, _doc)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.off('click', classPrivateFieldGet(_this, _onClick));
	        }

	        classPrivateFieldGet(_this, _beacon).off();

	        classPrivateFieldGet(_this, _eventEmitter).emit('cleaned');

	        classPrivateFieldGet(_this, _eventEmitter).off();

	        classPrivateFieldSet(_this, _active, false);

	        classPrivateFieldSet(_this, _open, false);
	      }
	    });

	    classPrivateFieldSet(this, _beacon, new Beacon(this));

	    this.config = Object.freeze(_typeof_1(config) === 'object' && config || {});

	    classPrivateFieldSet(this, _body$1, new Select().getBodyTag());

	    this.contextTarget = typeof _target === 'string' ? new Select(_target) : classPrivateFieldGet(this, _body$1);
	    this.contextTarget.setAttr({
	      'aria-haspopup': true,
	      'aria-expanded': false
	    }, true);
	    this.isSupported = Boolean(this.contextTarget.elements.length);
	    this.rootElement = Select.create(this.config.rootElement ? this.config.rootElement : "<ul class=\"context-menu-list\"></ul>").setAttr({
	      'data-cm-root': true
	    }).on('click', classPrivateFieldGet(this, _onRootClick));
	    this.contextTarget.setAttr({
	      'data-cm-host': true
	    }).on('contextmenu', classPrivateFieldGet(this, _onContextMenu));

	    if (isEnvBrowser()) {
	      classPrivateFieldSet(this, _doc, new Select(document));

	      classPrivateFieldGet(this, _doc).on('click', classPrivateFieldGet(this, _onClick));
	    }

	    classPrivateFieldGet(this, _beacon).listen(function (shouldClose) {
	      if (shouldClose) {
	        classPrivateFieldGet(_this, _onClick).call(_this);
	      }
	    });

	    classPrivateFieldSet(this, _eventEmitter, new EventEmitter(this.rootElement));
	  } // Private functions


	  createClass(ContextMenu, [{
	    key: "add",
	    // Public methods
	    value: function add() {
	      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      var elements = [].concat(args);

	      var _iterator = _createForOfIteratorHelper$1(elements),
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
	    value: function () {
	      var _cleanup = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
	        return regenerator.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                classPrivateFieldGet(this, _eventEmitter).emit('beforecleanup');

	                if (!(typeof this.config.onBeforeCleanup === 'function')) {
	                  _context3.next = 8;
	                  break;
	                }

	                _context3.next = 4;
	                return asyncResolve(classPrivateFieldGet(this, _onBeforeCleanup).call(this, this.config.onBeforeCleanup));

	              case 4:
	                if (!_context3.sent) {
	                  _context3.next = 6;
	                  break;
	                }

	                classPrivateFieldGet(this, _performCleanup).call(this);

	              case 6:
	                _context3.next = 9;
	                break;

	              case 8:
	                classPrivateFieldGet(this, _performCleanup).call(this);

	              case 9:
	              case "end":
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this);
	      }));

	      function cleanup() {
	        return _cleanup.apply(this, arguments);
	      }

	      return cleanup;
	    }()
	  }, {
	    key: "on",
	    value: function on(event, handler) {
	      classPrivateFieldGet(this, _eventEmitter).on(event, handler);

	      return this;
	    }
	  }, {
	    key: "off",
	    value: function off(event, handler) {
	      classPrivateFieldGet(this, _eventEmitter).off(event, handler);

	      return this;
	    }
	  }]);

	  return ContextMenu;
	}(); // Generates a context list

	var ContextList = /*#__PURE__*/function () {
	  function ContextList(title, config) {
	    classCallCheck(this, ContextList);

	    defineProperty(this, "config", {});

	    defineProperty(this, "rootElement", void 0);

	    defineProperty(this, "listElement", void 0);

	    this.config = Object.freeze(_typeof_1(config) === 'object' && config || {});
	    this.listElement = Select.create(this.config.listElement ? this.config.listElement : "<ul class=\"context-submenu\"></ul>").setAttr({
	      'data-cm-submenu-root': true
	    });
	    this.rootElement = Select.create(this.config.rootElement ? this.config.rootElement : "<li class=\"menu-item\"></li>").setAttr({
	      'data-sub-elements': true
	    }).append(title).append(this.listElement);
	  }

	  createClass(ContextList, [{
	    key: "add",
	    value: function add() {
	      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      var elements = [].concat(args);

	      var _iterator2 = _createForOfIteratorHelper$1(elements),
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
	    key: "remove",
	    value: function remove() {
	      this.rootElement.remove();
	    }
	  }, {
	    key: "parent",
	    get: function get() {
	      return this.rootElement.parent;
	    }
	  }]);

	  return ContextList;
	}(); // Generates a context item

	var ContextItem = /*#__PURE__*/function () {
	  function ContextItem(title, config) {
	    classCallCheck(this, ContextItem);

	    defineProperty(this, "config", {});

	    defineProperty(this, "rootElement", void 0);

	    this.config = Object.freeze(_typeof_1(config) === 'object' && config || {});
	    this.rootElement = Select.create(this.config.rootElement ? this.config.rootElement : "<li class=\"menu-item\"></li>").setAttr({
	      'data-cm-leaf': true
	    }).append(title);
	  }

	  createClass(ContextItem, [{
	    key: "remove",
	    value: function remove() {
	      this.rootElement.remove();
	    }
	  }]);

	  return ContextItem;
	}();

	exports.ContextItem = ContextItem;
	exports.ContextList = ContextList;
	exports.ContextMenu = ContextMenu;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=contextBuilder.js.map
