
export default class Picture {
	
	constructor(image, width = 10, height = 10, aspectRatio = 1) {
		
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
	_getBounds() {
		
		let imgWidth = this._image.naturalWidth,
			imgHeight = this._image.naturalHeight;
			
		// Default sizes and positions
		let sx = 0, sy = 0, 
			sw = imgWidth, 
			sh = imgHeight,
			dx = 0, dy = 0, 
			dw = this._width, 
			dh = this._height,
			pr = this._aspectRatio;
		
		// Relation between width and height for source and destination.
		// Adjust ratio with aspectRatio.
		let sr = sw / sh,
			dr = (dw * pr) / dh;
		
		// Differance in relation determines wich is wider/taller.
		if(sr > dr) {
			
			// Taller image
			
			sw = sh * dr;
			sx = (imgWidth * 0.5) - (sw * 0.5);
			
		} else {
			
			// Wider image
			
			sh = sw / dr;
			sy = (imgHeight * 0.5) - (sh * 0.5);
			
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
		}
	}
	
	
	_drawImage() {
		
		if (!(this._width > 0 && this._height > 0 && !!this._image)) {
			return;
		};
		
		let b = this._getBounds();
		
		this._context.drawImage(
			this._image, 
			b.sx, b.sy, b.sw, b.sh, 
			b.dx, b.dy, b.dw, b.dh
		);
		
		this._calculateAverageColor();
	}
	
	
	_calculateAverageColor() {
		
		let pixels = this.getImageData();
		let len	= pixels.length / 4;
		
		let red	= 0;
		let green = 0;
		let blue = 0;
		
		for (let i = 0; i < len*4; i+=4)
		{
			red 	+= pixels[i];
			green 	+= pixels[i+1];
			blue 	+= pixels[i+2];
		}
		
		red 	/= len;
		green 	/= len;
		blue 	/= len;
		
		this._averageColor = red << 16 | green << 8 | blue;
		
		return this._averageColor;
	}
	
	
	
	//---------------------------------------
	// Getters / setters
	//---------------------------------------
	
	
	
	get width() { return this._image.naturalWidth; }
	get height() { return this._image.naturalHeight; }
	
	get canvas() { return this._canvas; }
	get context() { return this._context; }
	get averageColor() { return this._averageColor; }
	
	
	
	//---------------------------------------
	// Public methods
	//---------------------------------------
	
	
	
	/**
	 * This will redraw the image. Avoid this in loops/raf.
	 * @param {Number} width  New width.
	 * @param {Number} height New height.
	 */
	setSize(width, height, aspectRatio = 1) {
		
		this._aspectRatio = aspectRatio;
		
		this._canvas.width = this._width = Number(width);
		this._canvas.height = this._height = Number(height);
		
		// ------------------------
		
		this._drawImage();
	}
	
	
	
	getImageData() {
		return this._context.getImageData(0, 0, this._width, this._height).data;
	}
	
	
	
	setImage(image) {
		
		this._image = image;
		this._drawImage();
	}
}