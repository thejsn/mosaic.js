/**
 * Mosaic.js
 *  * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('mosaic-js', factory) :
  global.Mosaic = factory();
}(this, function () { 'use strict';

  var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  babelHelpers;
  var Picture = (function () {
  	function Picture(image) {
  		var width = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
  		var height = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];
  		var aspectRatio = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];
  		babelHelpers.classCallCheck(this, Picture);

  		//---------------------------------------
  		// Private properties
  		//---------------------------------------

  		this._aspectRatio = aspectRatio;
  		this._averageColor = 0;
  		this._width = 0;
  		this._height = 0;

  		this._image;
  		this._canvas = document.createElement('canvas');
  		this._context = this._canvas.getContext('2d');

  		//---------------------------------------
  		// Setup
  		//---------------------------------------

  		this.setSize(width, height, aspectRatio);

  		if (!!image) {
  			this.setImage(image);
  		};
  	}

  	//---------------------------------------
  	// Private
  	//---------------------------------------

  	/**
    * Get image dimensions based on source image 
    * and dimensions of grid square.
    * 
    * @return {Object} Object with size data.
    */

  	babelHelpers.createClass(Picture, [{
  		key: '_getBounds',
  		value: function _getBounds() {

  			var imgWidth = this._image.naturalWidth,
  			    imgHeight = this._image.naturalHeight;

  			// Default sizes and positions
  			var sx = 0,
  			    sy = 0,
  			    sw = imgWidth,
  			    sh = imgHeight,
  			    dx = 0,
  			    dy = 0,
  			    dw = this._width,
  			    dh = this._height,
  			    pr = this._aspectRatio;

  			// Relation between width and height for source and destination.
  			// Adjust ratio with aspectRatio.
  			var sr = sw / sh,
  			    dr = dw * pr / dh;

  			// Differance in relation determines wich is wider/taller.
  			if (sr > dr) {

  				// Taller image

  				sw = sh * dr;
  				sx = imgWidth * 0.5 - sw * 0.5;
  			} else {

  				// Wider image

  				sh = sw / dr;
  				sy = imgHeight * 0.5 - sh * 0.5;
  			}

  			return {
  				sx: sx,
  				sy: sy,
  				sw: sw,
  				sh: sh,

  				dx: dx,
  				dy: dy,
  				dw: dw,
  				dh: dh
  			};
  		}
  	}, {
  		key: '_drawImage',
  		value: function _drawImage() {

  			if (!(this._width > 0 && this._height > 0 && !!this._image)) {
  				return;
  			};

  			var b = this._getBounds();

  			this._context.drawImage(this._image, b.sx, b.sy, b.sw, b.sh, b.dx, b.dy, b.dw, b.dh);

  			this._calculateAverageColor();
  		}
  	}, {
  		key: '_calculateAverageColor',
  		value: function _calculateAverageColor() {

  			var pixels = this.getImageData();
  			var len = pixels.length / 4;

  			var red = 0;
  			var green = 0;
  			var blue = 0;

  			for (var i = 0; i < len * 4; i += 4) {
  				red += pixels[i];
  				green += pixels[i + 1];
  				blue += pixels[i + 2];
  			}

  			red /= len;
  			green /= len;
  			blue /= len;

  			this._averageColor = red << 16 | green << 8 | blue;

  			return this._averageColor;
  		}

  		//---------------------------------------
  		// Getters / setters
  		//---------------------------------------

  	}, {
  		key: 'setSize',

  		//---------------------------------------
  		// Public methods
  		//---------------------------------------

  		/**
     * This will redraw the image. Avoid this in loops/raf.
     * @param {Number} width  New width.
     * @param {Number} height New height.
     */
  		value: function setSize(width, height) {
  			var aspectRatio = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  			this._aspectRatio = aspectRatio;

  			this._canvas.width = this._width = Number(width);
  			this._canvas.height = this._height = Number(height);

  			// ------------------------

  			this._drawImage();
  		}
  	}, {
  		key: 'getImageData',
  		value: function getImageData() {
  			return this._context.getImageData(0, 0, this._width, this._height).data;
  		}
  	}, {
  		key: 'setImage',
  		value: function setImage(image) {

  			this._image = image;
  			this._drawImage();
  		}
  	}, {
  		key: 'width',
  		get: function get() {
  			return this._image.naturalWidth;
  		}
  	}, {
  		key: 'height',
  		get: function get() {
  			return this._image.naturalHeight;
  		}
  	}, {
  		key: 'canvas',
  		get: function get() {
  			return this._canvas;
  		}
  	}, {
  		key: 'context',
  		get: function get() {
  			return this._context;
  		}
  	}, {
  		key: 'averageColor',
  		get: function get() {
  			return this._averageColor;
  		}
  	}]);
  	return Picture;
  })();

  var ImageLoader = (function () {
  	function ImageLoader() {
  		babelHelpers.classCallCheck(this, ImageLoader);

  		this._loadCount = 0;
  		this._completeCount = 0;
  	}

  	babelHelpers.createClass(ImageLoader, [{
  		key: "loadComplete",
  		value: function loadComplete() {
  			this._completeCount++;

  			if (this._loadCount === this._completeCount) {
  				this._completeCount = 0;
  				this._loadCount = 0;
  			}
  		}

  		//---------------------------------------
  		// Getters / setters
  		//---------------------------------------

  	}, {
  		key: "load",

  		//---------------------------------------
  		// Public methods
  		//---------------------------------------

  		/**
     * Load an image.
     * 
     * @param  {String} url Image url
     * @return {Promise}
     */
  		value: function load(url) {
  			var _this = this;

  			this._loadCount++;

  			return new Promise(function (resolve, reject) {

  				var img = new Image();

  				img.onload = (function (response) {

  					resolve(img);
  					this.loadComplete();
  				}).bind(_this);

  				img.onerror = (function (response) {

  					reject(response);
  					this.loadComplete();
  				}).bind(_this);

  				img.src = url;
  			});
  		}
  	}, {
  		key: "progress",
  		get: function get() {
  			return this._loadCount < 1 ? 1 : this._completeCount / this._loadCount;
  		}
  	}]);
  	return ImageLoader;
  })();

  var Grid = (function () {
  	function Grid() {
  		babelHelpers.classCallCheck(this, Grid);

  		this._colorBlending = 0.2;

  		this._width = 0;
  		this._height = 0;

  		this._columns = 0;
  		this._rows = 0;

  		this._colors = [];

  		this._target;
  		this._pictures = new Map();

  		this._canvas = document.createElement('canvas');
  		this._context = this._canvas.getContext('2d');
  	}

  	/**
    * Return the color in _colors array, that is most similar to the given color.
    * @param  {Number} color Color to match.
    * @return {Number}       Nearest color.
    */

  	babelHelpers.createClass(Grid, [{
  		key: '_getClosestColor',
  		value: function _getClosestColor(color) {

  			var ret = this._colors[0],
  			    len = this._colors.length,
  			    current = Number.MAX_VALUE,
  			    sr = color >> 16 & 0xFF,
  			    sg = color >> 8 & 0xFF,
  			    sb = color & 0xFF;

  			var red = 0,
  			    green = 0,
  			    blue = 0,
  			    diffr = 0,
  			    diffg = 0,
  			    diffb = 0;

  			for (var i = 0; i < len; i++) {
  				var c = this._colors[i];

  				red = c >> 16 & 0xFF;
  				green = c >> 8 & 0xFF;
  				blue = c & 0xFF;

  				diffr = red - sr;
  				diffg = green - sg;
  				diffb = blue - sb;

  				var distance = Math.sqrt(diffr * diffr + diffg * diffg + diffb * diffb);

  				if (distance === 0) {
  					// Exact match, no need to keep looking.
  					return c;
  				} else if (distance < current) {

  					current = distance;
  					ret = c;
  				}
  			}

  			return ret;
  		}

  		//---------------------------------------
  		// Static
  		//---------------------------------------

  		//---------------------------------------
  		// Getters / setters
  		//---------------------------------------

  	}, {
  		key: 'setSize',

  		//---------------------------------------
  		// Public methods
  		//---------------------------------------

  		/**
     * Set canvas dimenstions in pixels
     * @param {Number} width  Width in pixels.
     * @param {Number} height Height in pixels.
     * @param {Number} columns Number of columns
     * @param {Number} rows    Number of rows
     */
  		value: function setSize(width, height, columns, rows) {

  			this._columns = Number(columns);
  			this._rows = Number(rows);

  			this._width = Number(width);
  			this._height = Number(height);

  			this._canvas.width = this._width;
  			this._canvas.height = this._height;

  			for (var i = 0; i < this._colors.length; i++) {

  				var color = this._colors[i];

  				this._pictures[color].setSize(Math.floor(this._width / this._columns), Math.floor(this._height / this._rows));
  			}
  		}

  		/**
     * Add to pool of pictures to use in mosaic.
     * @param {Picture} picture A Picture
     */

  	}, {
  		key: 'addPicture',
  		value: function addPicture(picture) {

  			var color = picture.averageColor;

  			// The average color of the image is its key.
  			this._pictures[color] = picture;

  			// Save color in array for quick search later.
  			this._colors.push(color);
  		}

  		/**
     * Set target image
     * 
     * @param {Picture} picture Picture object holding the target image.
     */

  	}, {
  		key: 'setTarget',
  		value: function setTarget(picture) {

  			this._target = picture;
  			this.drawGrid();
  		}

  		/**
     * Draw images to grid.
     */

  	}, {
  		key: 'drawGrid',
  		value: function drawGrid() {

  			var pixels = this._target.getImageData();

  			var blending = this._colorBlending,
  			    nearest = undefined,
  			    pic = undefined;

  			var j = 0,
  			    x = 0,
  			    y = 0,
  			    w = this._width / this._columns,
  			    h = this._height / this._rows,
  			    cols = this._columns,
  			    rows = this._rows,
  			    ctx = this._context,
  			    len = pixels.length / 4,
  			    red = 0,
  			    green = 0,
  			    blue = 0,
  			    color = undefined;

  			for (var i = 0; i < len; i++) {
  				j = i * 4;
  				red = pixels[j];
  				green = pixels[j + 1];
  				blue = pixels[j + 2];

  				color = red << 16 | green << 8 | blue;

  				x = i % cols * w;
  				y = Math.floor(i / cols) * h;

  				if (blending < 1) {

  					nearest = this._getClosestColor(color);
  					pic = this._pictures[nearest];

  					ctx.drawImage(pic.canvas, x, y, w, h);
  				};

  				if (blending > 0) {

  					ctx.fillStyle = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + blending + ')';
  					ctx.fillRect(x, y, w, h);
  				};
  			}
  		}
  	}, {
  		key: 'poolSize',
  		get: function get() {
  			return this._colors.length;
  		}
  	}, {
  		key: 'size',
  		get: function get() {
  			return this._columns * this._rows;
  		}
  	}, {
  		key: 'colors',
  		get: function get() {
  			return this._colors;
  		}
  	}, {
  		key: 'canvas',
  		get: function get() {
  			return this._canvas;
  		}
  	}, {
  		key: 'context',
  		get: function get() {
  			return this._context;
  		}
  	}, {
  		key: 'colorBlending',
  		set: function set(value) {
  			this._colorBlending = value;
  		},
  		get: function get() {
  			return this._colorBlending;
  		}
  	}]);
  	return Grid;
  })();

  var promise = (function (module, global) {
  var exports = module.exports;
  (function(global){

  //
  // Check for native Promise and it has correct interface
  //

  var NativePromise = global['Promise'];
  var nativePromiseSupported =
    NativePromise &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    'resolve' in NativePromise &&
    'reject' in NativePromise &&
    'all' in NativePromise &&
    'race' in NativePromise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function(){
      var resolve;
      new NativePromise(function(r){ resolve = r; });
      return typeof resolve === 'function';
    })();


  //
  // export if necessary
  //

  if (typeof exports !== 'undefined' && exports)
  {
    // node.js
    exports.Promise = nativePromiseSupported ? NativePromise : Promise;
    exports.Polyfill = Promise;
  }
  else
  {
    // AMD
    if (typeof define == 'function' && define.amd)
    {
      define(function(){
        return nativePromiseSupported ? NativePromise : Promise;
      });
    }
    else
    {
      // in browser add to global
      if (!nativePromiseSupported)
        global['Promise'] = Promise;
    }
  }


  //
  // Polyfill
  //

  var PENDING = 'pending';
  var SEALED = 'sealed';
  var FULFILLED = 'fulfilled';
  var REJECTED = 'rejected';
  var NOOP = function(){};

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  // async calls
  var asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
  var asyncQueue = [];
  var asyncTimer;

  function asyncFlush(){
    // run promise callbacks
    for (var i = 0; i < asyncQueue.length; i++)
      asyncQueue[i][0](asyncQueue[i][1]);

    // reset async asyncQueue
    asyncQueue = [];
    asyncTimer = false;
  }

  function asyncCall(callback, arg){
    asyncQueue.push([callback, arg]);

    if (!asyncTimer)
    {
      asyncTimer = true;
      asyncSetTimer(asyncFlush, 0);
    }
  }


  function invokeResolver(resolver, promise) {
    function resolvePromise(value) {
      resolve(promise, value);
    }

    function rejectPromise(reason) {
      reject(promise, reason);
    }

    try {
      resolver(resolvePromise, rejectPromise);
    } catch(e) {
      rejectPromise(e);
    }
  }

  function invokeCallback(subscriber){
    var owner = subscriber.owner;
    var settled = owner.state_;
    var value = owner.data_;  
    var callback = subscriber[settled];
    var promise = subscriber.then;

    if (typeof callback === 'function')
    {
      settled = FULFILLED;
      try {
        value = callback(value);
      } catch(e) {
        reject(promise, e);
      }
    }

    if (!handleThenable(promise, value))
    {
      if (settled === FULFILLED)
        resolve(promise, value);

      if (settled === REJECTED)
        reject(promise, value);
    }
  }

  function handleThenable(promise, value) {
    var resolved;

    try {
      if (promise === value)
        throw new TypeError('A promises callback cannot return that same promise.');

      if (value && (typeof value === 'function' || typeof value === 'object'))
      {
        var then = value.then;  // then should be retrived only once

        if (typeof then === 'function')
        {
          then.call(value, function(val){
            if (!resolved)
            {
              resolved = true;

              if (value !== val)
                resolve(promise, val);
              else
                fulfill(promise, val);
            }
          }, function(reason){
            if (!resolved)
            {
              resolved = true;

              reject(promise, reason);
            }
          });

          return true;
        }
      }
    } catch (e) {
      if (!resolved)
        reject(promise, e);

      return true;
    }

    return false;
  }

  function resolve(promise, value){
    if (promise === value || !handleThenable(promise, value))
      fulfill(promise, value);
  }

  function fulfill(promise, value){
    if (promise.state_ === PENDING)
    {
      promise.state_ = SEALED;
      promise.data_ = value;

      asyncCall(publishFulfillment, promise);
    }
  }

  function reject(promise, reason){
    if (promise.state_ === PENDING)
    {
      promise.state_ = SEALED;
      promise.data_ = reason;

      asyncCall(publishRejection, promise);
    }
  }

  function publish(promise) {
    var callbacks = promise.then_;
    promise.then_ = undefined;

    for (var i = 0; i < callbacks.length; i++) {
      invokeCallback(callbacks[i]);
    }
  }

  function publishFulfillment(promise){
    promise.state_ = FULFILLED;
    publish(promise);
  }

  function publishRejection(promise){
    promise.state_ = REJECTED;
    publish(promise);
  }

  /**
  * @class
  */
  function Promise(resolver){
    if (typeof resolver !== 'function')
      throw new TypeError('Promise constructor takes a function argument');

    if (this instanceof Promise === false)
      throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');

    this.then_ = [];

    invokeResolver(resolver, this);
  }

  Promise.prototype = {
    constructor: Promise,

    state_: PENDING,
    then_: null,
    data_: undefined,

    then: function(onFulfillment, onRejection){
      var subscriber = {
        owner: this,
        then: new this.constructor(NOOP),
        fulfilled: onFulfillment,
        rejected: onRejection
      };

      if (this.state_ === FULFILLED || this.state_ === REJECTED)
      {
        // already resolved, call callback async
        asyncCall(invokeCallback, subscriber);
      }
      else
      {
        // subscribe
        this.then_.push(subscriber);
      }

      return subscriber.then;
    },

    'catch': function(onRejection) {
      return this.then(null, onRejection);
    }
  };

  Promise.all = function(promises){
    var Class = this;

    if (!isArray(promises))
      throw new TypeError('You must pass an array to Promise.all().');

    return new Class(function(resolve, reject){
      var results = [];
      var remaining = 0;

      function resolver(index){
        remaining++;
        return function(value){
          results[index] = value;
          if (!--remaining)
            resolve(results);
        };
      }

      for (var i = 0, promise; i < promises.length; i++)
      {
        promise = promises[i];

        if (promise && typeof promise.then === 'function')
          promise.then(resolver(i), reject);
        else
          results[i] = promise;
      }

      if (!remaining)
        resolve(results);
    });
  };

  Promise.race = function(promises){
    var Class = this;

    if (!isArray(promises))
      throw new TypeError('You must pass an array to Promise.race().');

    return new Class(function(resolve, reject) {
      for (var i = 0, promise; i < promises.length; i++)
      {
        promise = promises[i];

        if (promise && typeof promise.then === 'function')
          promise.then(resolve, reject);
        else
          resolve(promise);
      }
    });
  };

  Promise.resolve = function(value){
    var Class = this;

    if (value && typeof value === 'object' && value.constructor === Class)
      return value;

    return new Class(function(resolve){
      resolve(value);
    });
  };

  Promise.reject = function(reason){
    var Class = this;

    return new Class(function(resolve, reject){
      reject(reason);
    });
  };

  })(typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : typeof self != 'undefined' ? self : this);
  return module.exports;
  })({exports:{}}, __commonjs_global);

  var Mosaic = (function () {

  	/**
    * The given element will have its content replaced with a canvas element 
    * containing the generated mosaic. The element can have a number of 
    * settings attributes. If no element is given, the canvas with the mosaic will 
    * not be visible, but can be accessed with [mosaic.canvas]{@link Mosaic#canvas}.
    * 
    * @see  [Element]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element}
    * 
    * @example
    * <!-- Create an element -->
    * <div id="imagemosaic"></div>
    * 
    * @example
    * <!-- Create an element with settings -->
    * <div id="imagemosaic"
    * 	mosaic-columns="10" 
    * 	mosaic-rows="10" 
    * 	mosaic-width="200" 
    * 	mosaic-height="200"
    * 	mosaic-colorblending="0.5"
    * ></div>
    * 
    * @example
    * // Set element with regular javascript
    * var mosaic = new Mosaic(document.getElementById('imagemosaic'))
    * 
    * @example
    * // Set element with jQuery or similar
    * var mosaic = new Mosaic($('#imagemosaic')[0])
    * 
    * @constructor
    * 
    * @param  {Element=} element The DOM element.
    */

  	function Mosaic(element) {
  		babelHelpers.classCallCheck(this, Mosaic);

  		//---------------------------------------
  		// Private properties
  		//---------------------------------------

  		this._width = 300;
  		this._height = 300;
  		this._columns = 10;
  		this._rows = 10;
  		this._element;
  		this._target;
  		this._grid = new Grid();
  		this._loader = new ImageLoader();
  		this._canvas = document.createElement('canvas');
  		this._canvas.width = this._width;
  		this._canvas.height = this._height;
  		this._context = this._canvas.getContext('2d');

  		//---------------------------------------
  		// Setup
  		//---------------------------------------

  		if (typeof element !== 'undefined') {
  			this.setElement(element);
  		};
  	}

  	//----------------------------------------------------------------
  	//
  	// Properties - Getters / Setters
  	//
  	//----------------------------------------------------------------

  	/**
    * The Blending between each image and the matching color.
    * 
    * @example
    * mosaic.colorBlending = 0.9
    * 
    * @param  {Number} value A value between 0 and 1
    * @return {Number}       A value between 0 and 1
    */

  	babelHelpers.createClass(Mosaic, [{
  		key: '_parseChildElements',

  		//----------------------------------------------------------------
  		//
  		// Private
  		//
  		//----------------------------------------------------------------

  		/**
     * Loop through children of given element to find images.
     * 
     * @private
     * 
     * @param  {Element} element Element to loop through.
     */
  		value: function _parseChildElements(element) {

  			var child = undefined;

  			for (var i = 0; i < element.children.length; i++) {

  				child = element.children[i];

  				if (child.tagName.toLowerCase() === 'link') {

  					if (child.type === 'source') {

  						this.addSourceFromURL(child.href);
  					} else if (child.type === 'target') {

  						this.setTargetFromURL(child.href);
  					}
  				};
  			};

  			element.innerHTML = '';
  		}

  		/**
     * Retrieve settings from attributes on the element.
     * 
     * @private
     * 
     * @param  {Element} element [description]
     */

  	}, {
  		key: '_applySettingsFromElement',
  		value: function _applySettingsFromElement(element) {

  			this.colorBlending = HTML.getAttribute(element, 'mosaic-colorblending', this.colorBlending);

  			this.setSize(HTML.getAttribute(element, 'mosaic-width', this._width), HTML.getAttribute(element, 'mosaic-height', this._height), HTML.getAttribute(element, 'mosaic-columns', this._columns), HTML.getAttribute(element, 'mosaic-rows', this._rows));
  		}

  		/**
     * Handle load status change. Redraw grid if ready.
     * 
     * @private
     */

  	}, {
  		key: '_onLoadStatusChange',
  		value: function _onLoadStatusChange() {

  			if (this._loader.progress == 1 && !!this._target) {

  				this._grid.setTarget(this._target);
  				this.draw();
  			}
  		}

  		//---------------------------------------------------------------------
  		//
  		// Public
  		//
  		//---------------------------------------------------------------------

  		/**
     * Draw the hidden grid canvas to the visible canvas on the DOM. 
     * Can be used to force an update of the mosaic.
     * 
     * @example
     * mosaic.draw();
     * 
     * @public
     */

  	}, {
  		key: 'draw',
  		value: function draw() {

  			if (!this._context) {
  				return;
  			}

  			this._context.drawImage(this._grid.canvas, 0, 0, this._width, this._height);
  		}

  		/**
     * The given element will have its content replaced with a canvas element
     * with the generated mosaic.
     * 
     * @example
     * <!-- Create an element -->
     * <div id="imagemosaic"></div>
     * 
     * @example
     * // With javascript
     * var mosaic = new Mosaic()
     * mosaic.setElement(document.getElementById('imagemosaic'))
     * 
     * @example
     * // With jQuery or similar
     * var mosaic = new Mosaic()
     * mosaic.setElement($('#imagemosaic')[0])
     * 
     * @public
     * 
     * @param  {Element} element The DOM element.
     */

  	}, {
  		key: 'setElement',
  		value: function setElement(element) {

  			this._element = element;
  			this._applySettingsFromElement(this._element);

  			if (!!this._element.innerHTML) {

  				this._parseChildElements(this._element);
  			}

  			this._element.appendChild(this._canvas);
  		}

  		/**
     * Set the size of the canvas. Any falsy value will be ignored (such as 0).
     * This function will redraw the canvas and all grid images so it should probably be avoided
     * in animations.
     * 
     * @example
     * // Set the height and number of columns
     * mosaic.setSize(0, 200, 20)
     * 
     * @public
     * 
     * @param {Number} [width=0]   Width in pixels
     * @param {Number} [height=0]  Height in pixels
     * @param {Number} [columns=0] Number of columns
     * @param {Number} [rows=0]    Number of rows
     */

  	}, {
  		key: 'setSize',
  		value: function setSize() {
  			var width = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
  			var height = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  			var columns = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  			var rows = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

  			this._width = !!width ? Number(width) : this._width;
  			this._height = !!height ? Number(height) : this._height;
  			this._columns = !!columns ? Number(columns) : this._columns;
  			this._rows = !!rows ? Number(rows) : this._rows;

  			this._canvas.width = this._width;
  			this._canvas.height = this._height;

  			this._grid.setSize(this._width, this._height, this._columns, this._rows);

  			if (!!this._target && this._grid.poolSize > 0) {

  				this._target.setSize(this._columns, this._rows, this.pixelAspectRatio);
  				this._grid.drawGrid();
  				this.draw();
  			}
  		}

  		/**
     * Set the target image, from URL.
     * 
     * @example
     * mosaic.setTargetFromURL('path/to/image.jpg');
     * 
     * @public
     * 
     * @param {String} url Path to image
     */

  	}, {
  		key: 'setTargetFromURL',
  		value: function setTargetFromURL(url) {
  			var _this = this;

  			this._loader.load(url).then(function (image) {

  				_this.setTargetImage(image);
  			}).catch(function (error) {

  				console.warn('[mosaic.js] Error loading ' + url + ':', error);
  			}).then(function () {});
  		}

  		/**
     * Set the image to be built directly.
     * 
     * @example
     * var image = new Image()
     * image.src = 'http://path/to/image.jpg'
     * image.onLoad = function() {
     * 	mosaic.setTargetImage(image)
     * }
     * 
     * @public
     * 
     * @param  {Image} image
     */

  	}, {
  		key: 'setTargetImage',
  		value: function setTargetImage(image) {

  			this._target = new Picture(image, this._columns, this._rows, this.pixelAspectRatio);

  			this._onLoadStatusChange();
  		}

  		/**
     * Add image to be used in the grid from URL.
     * 
     * @example
     * mosaic.addSourceFromURL('path/to/image.jpg');
     * 
     * @public
     * 
     * @param {String} url Path to image
     */

  	}, {
  		key: 'addSourceFromURL',
  		value: function addSourceFromURL(url) {
  			var _this2 = this;

  			this._loader.load(url).then(function (image) {

  				_this2.addSource(image);
  			}).catch(function (error) {

  				console.warn('[mosaic.js] Error loading ' + url + ':', error);
  			}).then(function () {
  				if (_this2._loader.progress == 1) {

  					// console.log('[mosaic.js] All source images loaded');
  					_this2._onLoadStatusChange();
  				} else {
  					var p = Math.round(_this2._loader.progress * 100);
  					// console.log('[mosaic.js] Loading ' + p + '%');
  				}
  			});
  		}

  		/**
     * Add image to be used in the grid directly. The image should be completely loaded before being added.
     * 
     * @example
     * var image = new Image()
     * image.src = 'http://path/to/image.jpg'
     * image.onLoad = function() {
     * 	mosaic.addSource(image)
     * }
     * 
     * @public
     * 
     * @param  {Image} image 
     */

  	}, {
  		key: 'addSource',
  		value: function addSource(image) {

  			var picture = new Picture(image, Math.floor(this._width / this._columns), Math.floor(this._height / this._rows));

  			this._grid.addPicture(picture);
  		}
  	}, {
  		key: 'colorBlending',
  		set: function set(value) {
  			this._grid.colorBlending = value;
  		},
  		get: function get() {
  			return this._grid.colorBlending;
  		}

  		/**
     * The load progress of images added as URLs. Not very accurate 
     * since only completely loaded images are counted towards progress.
     * 
     * @readonly
     * 
     * @return {Number} A value between 0 and 1.
     */

  	}, {
  		key: 'loadProgress',
  		get: function get() {
  			return this._loader.progress;
  		}

  		/**
     * The canvas that holds the mosaic.
     * 
     * @readonly
     * 
     * @return {Element} A Canvas element.
     */

  	}, {
  		key: 'canvas',
  		get: function get() {
  			return this._canvas;
  		}

  		/**
     * The pixel aspect ratio of the cells in the grid, represented as a single float value.
     * If the ratio is 16:9, the value will be 16/9, or 1.77777777778.
     * 
     * @readonly
     * 
     * @return {Number}
     */

  	}, {
  		key: 'pixelAspectRatio',
  		get: function get() {
  			return this._width / this._columns / (this._height / this._rows);
  		}

  		//---------------------------------------
  		// Resize helpers
  		//---------------------------------------

  		/**
     * The width of the canvas in pixels.
     * 
     * @param {Number} value Width in pixels
     * @return {Number}
     */

  	}, {
  		key: 'width',
  		set: function set(value) {
  			this.setSize(Number(value));
  		},
  		get: function get() {
  			return this._width;
  		}

  		/**
     * The height of the canvas in pixels.
     * 
     * @param {Number}  Height in pixels
     * @return {Number}
     */

  	}, {
  		key: 'height',
  		set: function set(value) {
  			this.setSize(0, Number(value));
  		},
  		get: function get() {
  			return this._height;
  		}

  		/**
     * The number of columns in the grid.
     * 
     * @param {Number} value Number of columns
     * @return {Number} Number of columns
     */

  	}, {
  		key: 'columns',
  		set: function set(value) {
  			this.setSize(0, 0, Number(value));
  		},
  		get: function get() {
  			return this._columns;
  		}

  		/**
     * The number of rows in the grid.
     * 
     * @param {Number}  Number of rows
     * @return {Number} Number of rows
     */

  	}, {
  		key: 'rows',
  		set: function set(value) {
  			this.setSize(0, 0, 0, Number(value));
  		},
  		get: function get() {
  			return this._rows;
  		}
  	}]);
  	return Mosaic;
  })();

  var HTML = (function () {
  	function HTML() {
  		babelHelpers.classCallCheck(this, HTML);
  	}

  	babelHelpers.createClass(HTML, null, [{
  		key: 'getAttribute',

  		/**
     * Retrieve an attribute from given element. Will 
     * return empty string if not not present and no 
     * default value is given.
     * 
     * @param  {Object} element       The element
     * @param  {String} attributeName Attribute name
     * @param  {String} defaultValue  Default value if attribute is missing
     * @return {*}	               	  Attribute value or default.
     */
  		value: function getAttribute(element, attributeName) {
  			var defaultValue = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  			var value = element.getAttribute(attributeName);
  			return !!value ? value : defaultValue;
  		}

  		/**
     * Set styles on element.
     * 
     * @example
     * HTML.setStyles(element, {'color': '#fff'})
     * 
     * @param {Object} element Element to recieve styles.
     * @param {Object} styles  Object containing styles as name:value pairs. 
     */

  	}, {
  		key: 'setStyles',
  		value: function setStyles(element, styles) {

  			styles = !!styles ? styles : {};

  			for (var style in styles) {
  				element.style[style] = styles[style];
  			}
  		}
  	}]);
  	return HTML;
  })();

  return Mosaic;

}));