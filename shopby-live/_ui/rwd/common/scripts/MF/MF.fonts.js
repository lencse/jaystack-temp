;(function ($, window, document) {
  'use strict';

  var MF = window.MF = window.MF || {};

  MF.fonts = (function () {
  	function registerFontCall() {
      $(window).load( function() {
        setTimeout(function(){
          var ifrm = $('<iframe></iframe>').css('display', 'none');
          ifrm.appendTo('body');
          ifrm = ifrm[0];
          ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
          ifrm.document.open();
          ifrm.document.write('<link rel="stylesheet" href="' + ('https:' == document.location.protocol ? 'https' : 'http') + '://hello.myfonts.net/count/2be436');
          ifrm.document.close();
        }, 100);
      });
  	}
    function load_korean_malgun_gothic_fonts(){
      if ( $.cookie('country') === 'KOR' ){
        $.getScript( "//fast.fonts.net/jsapi/24db0a0a-afb5-465b-be0e-c6d6ec3a94dd.js" )
          .done(function( script, textStatus ) {
          })
          .fail(function( jqxhr, settings, exception ) {
            console.log('Korean Malgun Gothic font loading unsuccessful.');
          });
      }
    }
  	function init() {
  		$(registerFontCall);
      load_korean_malgun_gothic_fonts();
  	}
  	return {
  		init: init
  	};
  })();

}(jQuery, this, this.document));

MF.fonts.init();
