/*
 *  require : none
 *  
 */

(function ($, window, document){
    'use strict';

    var MF = window.MF || {};

    var mensEl = $(".slp__listing__mens ul");
    var womensEl = $(".slp__listing__womens ul");

    var defaultOptions = {
        searchForm: "#mf__search_form",
        searchButton: "#mf__searchSubmit"
    };

    MF.searchResults = (function () {

        var form, searchButton;

        var onSearchButtonClicked = function() {
            disableSearchFormElements();

            var search = getSearchParams();

            setGenderCookie(search.gender);
            setSearchQuery(search.text, search.gender);
        };

        function disableSearchFormElements() {
            form.find(":text, :radio").attr("disabled", true);
        }

        function getSearchParams() {
            var searchText = form.find("#mf__search").val();
            var searchGender = form.find("[name=gender]:checked").val();

            return {
                text: searchText,
                gender: ((searchGender === "Womens2") ? "Womens" :  "Mens")
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
                form.find("#mf__query").val(query);
            } else {
                form.find("#mf__query").val("");
            }
        }

        function isBlank(str) {
            return (!str || /^\s*$/.test(str));
        }

        
        function getAndShowCategories(deptIn, domEl) {

            var categoryNodeTemplate = "<li><a href='{{categoryUrl}}'>{{categoryName}}</a></li>";
            var categoryUrlTemplate = "/mfexternal/category/categoryNavTree/rootCategoryCode/{{departmentId}}/categoryCode/{{departmentId}}/";

            var categoryUrl = categoryUrlTemplate.replace(/{{departmentId}}/g, deptIn);
            
            if (domEl && domEl.length) { // only fetch the categories if there is an element to append to
                $.ajax({ // get the categories via AJAX and show them
                    url: categoryUrl,
                    cache: true
                })
                .done( function(data) {
                    $.each(data, function(index, value) {
                        var categoryNode = categoryNodeTemplate
                                                .replace("{{categoryUrl}}", value.url)
                                                .replace("{{categoryName}}", value.name);
                        $(categoryNode).appendTo(domEl);
                    });
                    
                })
                .fail( function(error) {
                    console.log('getAndShowCategories error', error.status, error.statusText);
                    return false;
                });
            }
    
        }

        function init(options) {
            getAndShowCategories("Womens", womensEl);
            getAndShowCategories("Mens", mensEl);

            var opts = options || defaultOptions;

            form = $(opts.searchForm);
            searchButton = form.find(opts.searchButton);

            $(document).ready(function() {
                searchButton.on("click", onSearchButtonClicked);
            });
        }

        return {
          init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));


// Search Reuslts init
$(function () {
    if (document.getElementById('slpNoRes')) {
        MF.searchResults.init();
    }
});