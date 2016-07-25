/**
 * Created by aashishs on 23/11/2015.
 */
;(function ($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.basepath = (function () {

        function init() {
            $(document).ready(function(){
                process_all_hash_hrefs();
                remove_leading_forward_slashes_from_all_links();
            });
        }

        //So the base path works even with hash links
        function process_all_hash_hrefs(){
            $("a[href^='\#']").click(function(e){
                e.preventDefault();
                document.location.hash=this.href.substr(this.href.indexOf('#')+1);
            });
        }

        //Processing the backlog
        function remove_leading_forward_slashes_from_all_links(){
            var current_localisation = process_url_path_into_array(window.location.pathname);
            current_localisation = current_localisation[0];
            $("a[href^='/']").attr( 'href', function(){
                if ( $(this).attr('href').substring(0,2) === '//' ){
                    return $(this).attr('href');
                }
                else{
                    var href_array = process_url_path_into_array( $(this).attr('href') );
                    if ( current_localisation === href_array[0] ){
                        return $(this).attr('href');
                    }
                    else{
                        return $(this).attr('href').substring(1);
                    }
                }
                
            });
        }

        function process_url_path_into_array(path){
            var pathname = path;
            // We remove the first forward slash
            while (pathname.charAt(0) === '/') {
                pathname = pathname.substr(1);
            }
            // We also remove the last forward slash, if it exists
            while (pathname.substring(0, pathname.length - 1) === '/') {
                pathname = pathname.substring(0, pathname.length - 1);
            }
            var pathArray = pathname.split('/');
            //pathArray[0] should now equal the current localisation unless we are in GBR
            return pathArray;
        }

        function get_current_localisation(){
            var current_localisation = process_url_path_into_array(window.location.pathname);
            return current_localisation[0];
        }

        return {
            init: function () {
                init();
            },
            remove_leading_forward_slashes_from_all_links: function () {
                remove_leading_forward_slashes_from_all_links();
            },
            get_current_localisation: function () {
                get_current_localisation();
            }
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));

MF.basepath.init();
$( document ).ready(function() {
    MF.basepath.init();
});

