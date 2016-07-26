(function($) {
    'use strict';

    var MF = window.MF || {};

    var defaults = {
        mywindow: $(window),
        size: 980 //42.5em tablet Breakpoint
    };
    MF.responsiveTables = (function(window, undefined) {

        var switched = false;
        // TODO scrollTable is defined below as a function. Please make sure we need the var declaration below
        // var scrollTable = false;
        var updateTables = function() {

            var myTable = $('.responsive');
            var myTableFull = $('.full');
            events(myTable);

            if ($('table').data('js', 'mf-responsive')) {

                if ((defaults.mywindow.width() < defaults.size) && !switched) {
                    switched = true;
                    events(myTable);
                    myTable.each(function(i, element) {
                        splitTable($(element));
                        myTableFull.wrap("<div class='table-scroll-wrapper' />");

                    });
                    return true;
                } else if (switched && (defaults.mywindow.width() > defaults.size)) {
                    switched = false;

                    myTable.each(function(i, element) {
                        unsplitTable($(element));
                        myTableFull.unwrap();
                    });

                }
            }

        };

        // Events
        defaults.mywindow.on("resize", updateTables);
        defaults.mywindow.load(updateTables);
        defaults.mywindow.on("redraw", function() {
            switched = false;
            // TODO It seems like we wanted to call a function below instead of simply referring to the variable
            // updateTables;
        });

        function splitTable(original) {
            original.wrap("<div class='table-wrapper' />");

            var copy = original.clone();
            copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
            copy.removeClass("responsive");

            original.closest(".table-wrapper").append(copy);
            copy.wrap("<div class='pinned' />");
            original.wrap("<div class='scrollable' />");
        }

        function scrollTable(original) {
            original.wrap("<div class='table-scroll-wrapper' />");
            copy.removeClass("responsive");
        }

        function unsplitTable(original) {
            original.closest(".table-wrapper").find(".pinned").remove();
            original.unwrap();
            original.unwrap();
        }

        function setCellHeights(original, copy) {
            var tr = original.find('tr'),
                tr_copy = copy.find('tr'),
                heights = [];

            tr.each(function(index) {
                var self = $(this),
                    tx = self.find('th, td');

                tx.each(function() {
                    var height = $(this).outerHeight(true);
                    heights[index] = heights[index] || 0;
                    if (height > heights[index]) heights[index] = height;
                });

            });

            tr_copy.each(function(index) {
                $(this).height(heights[index]);
            });
        }

        function events(el) {
            var rows = el.find('tr');
            rows.children().hover(function() {
                    rows.children().removeClass('hover');
                    var index = $(this).prevAll().length;
                    rows.find(':nth-child(' + (index + 1) + ')').addClass('hover');
                    rows.find('th').css({
                        'text-decoration': 'underline',
                    });
                },
                function() {
                    rows.children().removeClass('hover');
                });

            rows.children().click(function() {
                //console.log($('[data-mf-select]').find('[data-size-code]'));
                console.log($(this).data('base-size-code'));
                console.log($('#WOMDSH850003WHI-variants').text());
                //$('[data-mf-select]').data('size-code', $(this).data('base-size-code'));
                //$('[data-mf-select]').trigger('change');
                //$('#WOMDSH850003WHI-variants').val($(this).data('base-size-code'));


            });
            $('.pinned').find('tr').hover(function() {
                el.find('tr:eq(' + ($(this).index()) + ')').toggleClass('hover');
            });

        }

        return {
            init: updateTables
        };

    })();
    window.MF = MF;

}(jQuery));