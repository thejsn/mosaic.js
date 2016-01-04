
export default class Grid {
	
	constructor() {
		
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
	_getClosestColor(color) {
		
		let ret = this._colors[0],
			len = this._colors.length,
			current = Number.MAX_VALUE,
			sr = color >> 16 & 0xFF,
			sg = color >> 8 & 0xFF,
			sb = color & 0xFF;
		
		
		let red = 0, green = 0, blue = 0,
			diffr = 0, diffg = 0, diffb = 0;
		
		
		for (let i = 0; i < len; i++) {
			let c = this._colors[i];
			
			red		= c >> 16 & 0xFF;
			green	= c >> 8 & 0xFF;
			blue	= c & 0xFF;
			
			diffr	= red - sr;
			diffg	= green - sg;
			diffb	= blue - sb;
			
			let distance = Math.sqrt((diffr * diffr) + (diffg * diffg) + (diffb * diffb));
			
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
	
	get poolSize() { return this._colors.length; }
	get size() { return this._columns * this._rows; }
	
	get colors() { return this._colors; }
	get canvas() { return this._canvas; }
	get context() { return this._context; }
	
	set colorBlending(value) { this._colorBlending = value; }
	get colorBlending() { return this._colorBlending; }
	
	
	
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
	setSize(width, height, columns, rows) {
		
		this._columns = Number(columns);
		this._rows = Number(rows);
		
		this._width = Number(width);
		this._height = Number(height);
		
		this._canvas.width = this._width;
		this._canvas.height = this._height;
		
		for (var i = 0; i < this._colors.length; i++) {
			
			let color = this._colors[i];
			
			this._pictures[color].setSize(
				Math.floor(this._width / this._columns),
				Math.floor(this._height / this._rows)
			);
		}
	}
	
	
	
	/**
	 * Add to pool of pictures to use in mosaic.
	 * @param {Picture} picture A Picture
	 */
	addPicture(picture) {
		
		let color = picture.averageColor;
		
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
	setTarget(picture) {
		
		this._target = picture;
		this.drawGrid();
	}
	
	
	
	/**
	 * Draw images to grid.
	 */
	drawGrid() {
		
		let pixels = this._target.getImageData();
		
		let blending = this._colorBlending,
			nearest,
			pic;
		
		let j = 0,
			x = 0,
			y = 0,
			w = (this._width / this._columns),
			h = (this._height / this._rows),
			cols = this._columns,
			rows = this._rows,
			ctx = this._context,
			len	= pixels.length / 4,
			red	= 0,
			green = 0,
			blue = 0,
			color;
		
		for (let i = 0; i < len; i++) {
			j = i * 4;
			red 	= pixels[j];
			green 	= pixels[j+1];
			blue 	= pixels[j+2];
			
			color = red << 16 | green << 8 | blue;
			
			x = (i % cols) * w;
			y = Math.floor(i / cols) * h;
			
			if (blending < 1) {
				
				nearest = this._getClosestColor(color);
				pic = this._pictures[nearest];
				
				ctx.drawImage(
					pic.canvas, 
					x, y, w, h
				);
			};
			
			if (blending > 0) {
				
				ctx.fillStyle = 'rgba('+red+', '+green+', '+blue+', '+blending+')';
				ctx.fillRect(x, y, w, h);
			};
		}
	}
}