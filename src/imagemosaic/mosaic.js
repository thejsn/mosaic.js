import Promise from 'es6-promise-polyfill';

import ImageLoader from './imageLoader';
import Grid from './grid';
import Picture from './picture';

export default class Mosaic {
	
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
	constructor(element) {
		
		//---------------------------------------
		// Private properties
		//---------------------------------------
		
		this._width = 300;
		this._height = 300;
		this._columns = 10;
		this._rows = 10;
		this._element;
		this._source;
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
	set colorBlending(value) { this._grid.colorBlending = value; }
	get colorBlending() { return this._grid.colorBlending; }
	
	/**
	 * The load progress of images added as URLs. Not very accurate 
	 * since only completely loaded images are counted towards progress.
	 * 
	 * @readonly
	 * 
	 * @return {Number} A value between 0 and 1.
	 */
	get loadProgress() { return this._loader.progress; }
	
	/**
	 * The canvas that holds the mosaic.
	 * 
	 * @readonly
	 * 
	 * @return {Element} A Canvas element.
	 */
	get canvas() { return this._canvas; }
	
	/**
	 * The pixel aspect ratio of the cells in the grid, represented as a single float value.
	 * If the ratio is 16:9, the value will be 16/9, or 1.77777777778.
	 * 
	 * @readonly
	 * 
	 * @return {Number}
	 */
	get pixelAspectRatio() { return (this._width / this._columns) / (this._height / this._rows); }
	
	
	
	//---------------------------------------
	// Resize helpers
	//---------------------------------------
	
	/**
	 * The width of the canvas in pixels.
	 * 
	 * @param {Number} value Width in pixels
	 * @return {Number}
	 */
	set width(value) {
		this.setSize(Number(value));
	}
	
	get width() { return this._width; }
	
	
	
	/**
	 * The height of the canvas in pixels.
	 * 
	 * @param {Number}  Height in pixels
	 * @return {Number}
	 */
	set height(value) {
		this.setSize(0, Number(value));
	}
	
	get height() { return this._height; }
	
	
	
	/**
	 * The number of columns in the grid.
	 * 
	 * @param {Number} value Number of columns
	 * @return {Number} Number of columns
	 */
	set columns(value) {
		this.setSize(0, 0, Number(value));
	}
	
	get columns() { return this._columns; }
	
	
	
	/**
	 * The number of rows in the grid.
	 * 
	 * @param {Number}  Number of rows
	 * @return {Number} Number of rows
	 */
	set rows(value) {
		this.setSize(0, 0, 0, Number(value));
	}
	
	get rows() { return this._rows; }
	
	
	
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
	_parseChildElements(element) {
		
		let child;
		
		for (var i = 0; i < element.children.length; i++) {
			
			child = element.children[i];
			
			if (child.tagName.toLowerCase() === 'link') {
				
				if(child.type === 'grid') {
					
					this.addToGridFromURL(child.href);
					
				} else if(child.type === 'source') {
					
					this.setSourceFromURL(child.href);
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
	_applySettingsFromElement(element) {
		
		this.colorBlending = HTML.getAttribute(element, 'mosaic-colorblending', this.colorBlending)
		
		this.setSize(
			HTML.getAttribute(element, 'mosaic-width', this._width),
			HTML.getAttribute(element, 'mosaic-height', this._height),
			HTML.getAttribute(element, 'mosaic-columns', this._columns),
			HTML.getAttribute(element, 'mosaic-rows', this._rows)
		);
	}
	
	
	
	/**
	 * Handle load status change. Redraw grid if ready.
	 * 
	 * @private
	 */
	_onLoadStatusChange() {
		
		if (this._loader.progress == 1 && !!this._source) {
			
			this._grid.setSource(this._source);
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
	draw() {
		
		if (!this._context) {
			return;
		}
		
		this._context.drawImage(
			this._grid.canvas, 
			0, 0, this._width, this._height
		);
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
	setElement(element) {
		
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
	setSize(width = 0, height = 0, columns = 0, rows = 0) {
		
		this._width = !!width ? Number(width) : this._width;
		this._height = !!height ? Number(height) : this._height;
		this._columns = !!columns ? Number(columns) : this._columns;
		this._rows = !!rows ? Number(rows) : this._rows;
		
		this._canvas.width = this._width;
		this._canvas.height = this._height;
		
		this._grid.setSize(this._width, this._height, this._columns, this._rows);
		
		if (!!this._source && this._grid.poolSize > 0) {
			
			this._source.setSize(this._columns, this._rows, this.pixelAspectRatio);
			this._grid.drawGrid();
			this.draw();
		}
	}
	
	
	/**
	 * Set the source image, from URL.
	 * 
	 * @example
	 * mosaic.setSourceFromURL('path/to/image.jpg');
	 * 
	 * @public
	 * 
	 * @param {String} url Path to image
	 */
	setSourceFromURL(url) {
		
		this._loader.load(url)
			.then(image => {
				
				this.setSourceImage(image);
				
			})
			.catch(error => {
				
				console.warn('[mosaic.js] Error loading ' + url + ':', error);
				
			})
			.then(() => {
				
			});
	}
	
	
	
	/**
	 * Set the image to be built directly.
	 * 
	 * @example
	 * var image = new Image()
	 * image.src = 'http://path/to/image.jpg'
	 * image.onLoad = function() {
	 * 	mosaic.setSourceImage(image)
	 * }
	 * 
	 * @public
	 * 
	 * @param  {Image} image
	 */
	setSourceImage(image) {
		
		this._source = new Picture(
			image, 
			this._columns,
			this._rows,
			this.pixelAspectRatio
		);
		
		this._onLoadStatusChange();
	}
	
	
	
	/**
	 * Add image to be used in the grid from URL.
	 * 
	 * @example
	 * mosaic.addToGridFromURL('path/to/image.jpg');
	 * 
	 * @public
	 * 
	 * @param {String} url Path to image
	 */
	addToGridFromURL(url) {
		
		this._loader.load(url)
			.then(image => {
				
				this.addToGrid(image);
				
			})
			.catch(error => {
				
				console.warn('[mosaic.js] Error loading ' + url + ':', error);
				
			})
			.then(() => {
				if (this._loader.progress == 1) {
					
					// console.log('[mosaic.js] All grid images loaded');
					this._onLoadStatusChange();
					
				} else {
					let p = Math.round(this._loader.progress * 100);
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
	 * 	mosaic.addToGrid(image)
	 * }
	 * 
	 * @public
	 * 
	 * @param  {Image} image 
	 */
	addToGrid(image) {
		
		let picture = new Picture(
			image, 
			Math.floor(this._width / this._columns),
			Math.floor(this._height / this._rows)
		);
		
		this._grid.addPicture(picture);
	}
}


/**
 * A util class for HTML stuff.
 * 
 * @private
 */
class HTML {
	
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
	static getAttribute(element, attributeName, defaultValue = '') {
		let value = element.getAttribute(attributeName);
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
	static setStyles(element, styles) {
		
		styles = !!styles ? styles : {};
		
		for(var style in styles) {
			element.style[style] = styles[style];
		}
	}
}