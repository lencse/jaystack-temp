if (typeof(ACC.carousel) != "undefined")
{
    ACC.carousel.bindJCarousel = function () {
        jQuery('.span-4 .jcarousel-skin').jcarousel({
            vertical: true
        });

        jQuery('.span-10  .jcarousel-skin').jcarousel({

        });

        jQuery('.span-18  .jcarousel-skin').jcarousel({

        });

        jQuery('.span-20  .jcarousel-skin').jcarousel({

        });

        jQuery('.span-24  .jcarousel-skin').jcarousel({

        });

        $(".modal").colorbox({
            onComplete: function ()
            {
                ACC.common.refreshScreenReaderBuffer();
            },
            onClosed: function ()
            {
                ACC.common.refreshScreenReaderBuffer();
            }
        });

        $('#homepage_slider').waitForImages(function ()
        {
            $(this).slideView({toolTip: true, ttOpacity: 0.6, autoPlay: true, autoPlayTime: 8000});
        });
    };
}