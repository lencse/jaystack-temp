/*
 *  requires
 *
 *  ACC.config.contextPath
 */

;(function($, window, document) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        searchForm: "#search_form",
        searchButton: "#searchSubmit"
    };

    MF.productSearch = (function() {

        var form, searchButton;

        var onSearchButtonClicked = function() {
            disableSearchFormElements();

            var search = getSearchParams();

            setGenderCookie(search.gender);
            setSearchQuery(search.text, search.gender);
        };

        var onSizeTaxonomySelected = function(value, index) {
            $.cookie("sizeTaxonomy", value, {
                path: "/" + ACC.config.contextPath
            });
            location.reload();
        };

        function init(options) {
            var opts = options || defaultOptions;

            MF.select.init({
                callback: onSizeTaxonomySelected,
                contextId: "#sizetaxonomy-selector-container"
            });

            form = $(opts.searchForm);
            searchButton = form.find(opts.searchButton);

            $(document).ready(function() {
                searchButton.on("click", onSearchButtonClicked);
            });
        }

        function disableSearchFormElements() {
            form.find(":text, :radio").attr("disabled", true);
        }

        function getSearchParams() {
            var searchText = form.find("#search").val();
            var searchGender = form.find("[name=gender]:checked").val();

            return {
                text: searchText,
                gender: searchGender
            };
        }

        function setGenderCookie(gender) {
            $.cookie("gender", gender.toLowerCase(), {
                path: "/" + ACC.config.contextPath
            });
        }

        function setSearchQuery(text, gender) {
            if (!isBlank(text)) {
                var query = "" + text + "::allCategories:" + gender;
                form.find("#query").val(query);
            } else {
                form.find("#query").val("");
            }
        }

        function isBlank(str) {
            return (!str || /^\s*$/.test(str));
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));

MF.productSearch.init();
