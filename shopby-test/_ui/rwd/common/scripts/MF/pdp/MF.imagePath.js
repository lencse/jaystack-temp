/**
 * Created by damolaa on 17/02/2015.
 */
(function () {
    'use strict';

    var MF = window.MF || {};

    MF.imagePath = (function (){

        function updateImagePath(oldUrl, widthObj){
            var regx = /(\/\/[^\/]+\/[^\/]+[^\/]+\/[^\/]+\/)(?:[^\d]+)?([^_]+)_(\d)_[^\.]+\.(jpg|jpeg|gif|png|svg)/g;
            var reqWidth = "700";

            if (oldUrl.match(/\/\/[^\/]+\/[^\/]+[^\/]+\/[^\/]+\/[\d]+\/[^\.]+.(jpg|jpeg|gif|png)/g)){
                // already using newUrl so return
                return oldUrl;
            }
            if(typeof widthObj == 'undefined'){
                widthObj = [];
            }
            switch (MF.breakpoint.getActive()) {
                case "mobile":
                    reqWidth = typeof widthObj[0] == 'undefined' ? reqWidth : widthObj[0];
                    break;
                case "tablet":
                    reqWidth = typeof widthObj[1] == 'undefined' ? reqWidth : widthObj[1];
                    break;
                case "desktop":
                    reqWidth = typeof widthObj[2] == 'undefined' ? reqWidth : widthObj[2];
                    break;
                case "desktop-large":
                    reqWidth = typeof widthObj[3] == 'undefined' ? reqWidth : widthObj[3];
                    break;
                default:
                    return reqWidth;
            };
            if (oldUrl.match(/outfit/g)){
                return oldUrl.replace(regx, "$1" + reqWidth + "/outfit_$2_1.$4");
            }
            return oldUrl.replace(regx, "$1" + reqWidth + "/$2_$3.$4");
        };

        return {
            update: updateImagePath
        };
    })();

    window.MF = MF;

}());