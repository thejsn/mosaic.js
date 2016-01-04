# mosaic.js

Mosaic.js is a small library for generating an [image mosaic](https://en.wikipedia.org/wiki/Photographic_mosaic) using a HTML5 canvas element.


## Download

* CommonJS version (Browserify / WebPack) - [dev](https://github.com/thejsn/mosaic.js/blob/master/dist/mosaic.js) | [min](https://github.com/thejsn/mosaic.js/blob/master/dist/mosaic.min.js)
* Standalone (No build step) - [dev](https://github.com/thejsn/mosaic.js/blob/master/dist/mosaic-standalone.js) | [min](https://github.com/thejsn/mosaic.js/blob/master/dist/mosaic-standalone.min.js)


## Basic usage

Create an element to hold the canvas

    <div id="imagemosaic"></div>

Then create a new instance of Mosaic and pass a reference to the element:

    var mosaic = new Mosaic(document.getElementById('imagemosaic'))

Next, add source images that will fill the mosaic:

    mosaic.addSourceFromURL('image_1.jpg');
    mosaic.addSourceFromURL('image_2.jpg');
    // etc.

Finally, set a target image:

    mosaic.setTargetFromURL('images_1.jpg');

## Settings

### Dimensions

Set the size of the canvas:

    mosaic.width = 620
    mosaic.height = 480

Set the number of rows and columns:

    mosaic.columns = 100
    mosaic.rows = 10

A more efficient way to set the dimensions is to do it all in one call:
    
    // This will only re-draw the canvas once.
    mosaic.setSize(620, 480, 100, 10)

### Misc.

You can blend the source images with the target color that it matches:

    mosaic.colorBlending = 0.9


## Dependencies

None.

## License

The MIT License (MIT)
