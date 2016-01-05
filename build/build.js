var buildMosaicSa = require('./build-mosaic-standalone');
var buildMosaicCjs = require('./build-mosaic');


buildMosaicCjs(true)
	.then(buildMosaicSa)
