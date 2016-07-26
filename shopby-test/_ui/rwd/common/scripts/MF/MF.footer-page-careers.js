// code provided by kool for accordions on footer pages

/* fp-accordion
 * used in: careers, cookie-policy
 *
 * html construction:
 *
 * <container data-fp-accordion=".handle">
 *     <element>
 *         <handle>
 *         </handle>
 *         <hidden-content>
 *         </hidden-content>
 *     </element>
 *     <element>
 *         <handle>
 *         </handle>
 *         <hidden-content>
 *         </hidden-content>
 *     </element>
 * </container>
 *
 * for example:
 *
 * <ul data-fp-accordion=".title">
 *     <li>
 *         <div class="title">
 *             Title
 *         <div>
 *         <div class="hidden-content">
 *             text text text
 *         </div>
 *
 *  onclick on .handle, the .handle-parent get the class "accordion-open"
 *
 * */


(function($) {

    $(function () {

        var $accordion = $('[data-fp-accordion]');
        $accordion.find($accordion.data('fp-accordion')).click(function () {

            var $this = $(this),
                state_open_class = 'accordion-open',
                $parent = $this.parent();

            if ($parent.hasClass(state_open_class)) {
                $parent.removeClass(state_open_class);
            }
            else {

                /* accordion behavior, close others */
                $this.parents('[data-fp-accordion]')
                    .find('.' + state_open_class)
                    .removeClass(state_open_class);

                $parent.addClass(state_open_class);
            }
        })
    });
})(jQuery);