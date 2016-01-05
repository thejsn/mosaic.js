
//---------------------------------------------------------------------
//
// Imports
//
//---------------------------------------------------------------------

var fs = require('fs')
var uglify = require('uglify-js');
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var npm = require('rollup-plugin-npm');
var commonjs = require('rollup-plugin-commonjs');


//---------------------------------------------------------------------
//
// Variables
//
//---------------------------------------------------------------------

var banner =
	'/**\n' +
	' * Mosaic.js\n' +
	' * https://github.com/thejsn/mosaic.js\n' +
	' * Released under the MIT License.\n' +
	' */';

//---------------------------------------------------------------------
//
// Build
//
//---------------------------------------------------------------------

function build(minify) {
	
	return rollup.rollup({

		entry: 'src/imagemosaic/mosaic.js',
		plugins: [ 
			npm({
				jsnext: true,
				main: true
			}),
			commonjs({
				include: 'node_modules/**'
			}),
			babel({
				exclude: 'node_modules/**'
			})
		]
		
	}).then( function ( bundle ) {
		
		console.log('Build mosaic.js');
		
		bundle.write({
			format		: 'umd',
			banner		: banner,
			moduleId	: 'mosaic-js',
			moduleName	: 'Mosaic',
			dest		: 'dist/mosaic.js'
		});
		
		return bundle;
		
	}).then(function (bundle) {
		
		if (!!minify) {
			
			console.log('Build mosaic.min.js');
			
			var code = bundle.generate({
				format		: 'umd',
				moduleId	: 'mosaic-js',
				moduleName	: 'Mosaic',
			}).code;
			
			var minified = banner + '\n' + uglify.minify(code, {
				fromString: true
			}).code;
			
			write('dist/mosaic.min.js', minified);
			return minify;
		}
		
	}).catch(function(e) {
		
		console.log('Rollup error:');
		console.log(e);
	});
}

function write (dest, code) {
	
	return new Promise(function (resolve, reject) {
		
		fs.writeFile(dest, code, function (err) {
			
			if (err) {
				return reject(err)
			} else {
				resolve()
			}
		})
	})
}

module.exports = build;