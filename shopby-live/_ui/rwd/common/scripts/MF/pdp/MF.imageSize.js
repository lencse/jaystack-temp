(function () {
    'use strict';

    var MF = window.MF || {};

    MF.imageSize = (function (){
        /* array size definition: ["mobile", "tablet", "desktop", "large desktop"] */
        return {
            mainImage: [638, 871, 531, 612],
            zoomImage: [1403, 1691, 1385, 1391],
            thumbnails: [131, 131, 66, 67],
            largeThumbnails: [532, 532, 532, 612],
            fullscreenImage: [1612, 1612, 1044, 1391]
        };
    })();

    window.MF = MF;

}());