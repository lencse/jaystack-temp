;(function ($, window, document, variantSelector, addToBagForm, breakpoint, contactUsForm, mediator) {
    "use strict";

    var MF = window.MF || {};

    var defaults = {
        defaultUnit: "cm",
        sizeFitGuideLink: "#sizeFitGuideLink",
        sizeGuideModal: "#sizeGuideModal",
        sizeGuideDescriptionSection: ".size-guide__product-description",
        sizeProductMeasurementSection: ".size-guide__product-measurements",
        sizeGuideMeasurementSection: ".sg__measuring-guide",
        sizeConversionTable: "#sizeConversionTable",
        measurementsTable: "#measurementsTable",
        measurementsSizesTable: "#measurementsSizesTable",
        wrapperID: ".sg__table-wrapper",
        tablesID: ".sg__table",
        cellsID: ".sg__table-cell",
        rowsID: ".sg__table-row",
        contactUsLink: "[data-sg-contactus]",
        contactUsSubmit: "#sfSubmitButton",
        moreInfoSection: ".size-guide__need-more-info",
        setCentimeterUnit: "#setCentimeterUnit",
        setInchUnit: "#setInchUnit",
        setCentimeterUnitMG: "#setCentimeterUnitMG",
        setInchUnitMG: "#setInchUnitMG",
        imageThumbs: "#imageThumbs",
        imageStage: "#imageStage"
    };

    MF.productSizeGuide = (function () {

        var options,
            selectors,
            activeSize,
            currentUnit,
            isThankYou,
            selectASizeText,
            $sizeGuideModal,
            $tables,
            $sizeConversionTable,
            $measurementsTable,
            $measurementsTableLeft,
            $measurementsSizesTable,
            $sizeGuideDescriptionSection,
            $sizeGuideMeasurementSection,
            $sizeProductMeasurementSection,
            sizeGuideMeasurementSelector,
            sizeGuideDescriptionSelector,
            $measuringGuideBody,
            $measuringGuideControl,
            $imageThumbs,
            $imageStage,
            contactUsFormObj;

        var highlightTablesBySizeCode = function(sizeCode, className) {
            var className = (className ? className : "hover");

            if (sizeCode) {
                highlightColumnBySizeCode(sizeCode, className, $sizeConversionTable);
                highlightRowBySizeCode(sizeCode, className, $measurementsTable);
                highlightRowBySizeCode(sizeCode, className, $measurementsTableLeft);
            }
        };

        var highlightColumnBySizeCode = function(sizeCode, className, $table) {
            $table.find("[data-base-size-code='" + sizeCode + "']").toggleClass(className);
        };

        var highlightRowBySizeCode = function(sizeCode, className, $table) {
            var $row = $table.find("[data-size-code='" + sizeCode + "']");
            $row.toggleClass(className);
        };

        var getActiveAccordionSection = function() {
            return $(".is-active", $measuringGuideBody);
        };

        var onCellClick = function($thatCell, size) {
            changeVariantValue(size);
            removeCurrentClass();
            setActiveSize({sizeCode: size});
        };

        var removeCurrentClass = function() {
            $(options.cellsID, $sizeConversionTable).removeClass("current");
            $(options.rowsID, $measurementsTable).removeClass("current");
            $(options.rowsID, $measurementsTableLeft).removeClass("current");
        };

        var changeVariantValue = function(size) {
            if (size) {
                sizeGuideDescriptionSelector.selectVariantBySize(size);
                sizeGuideDescriptionSelector.syncVariantSelectors();
            }
        };

        var highlightCell = function($thatCell) {
            $thatCell.toggleClass("cell-hover");
        };

        var showMoreInfoSection = function(e) {
            e.preventDefault();
            $(options.moreInfoSection).show();
            hideContactUsThankYou();
        };

        var initTablesScrollbar = function() {
            $tables = $(options.tablesID);

            $tables.each(function() {
                var $that = $(this);
                var $scrollWrapper = $that.closest("[data-scrollable='true']");

                if ($scrollWrapper.exists()) {
                    var height = $scrollWrapper.find(options.tablesID).height();

                    $scrollWrapper.css("height", height ? height : "auto");

                    if (breakpoint.getActive() === breakpoint.MOBILE || breakpoint.getActive() === breakpoint.TABLET) {
                        $scrollWrapper.mCustomScrollbar({
                            theme: "invisible",
                            scrollInertia: 300,
                            axis:"yx",
                            scrollbarPosition: "outside"
                        });
                    }
                }
            });
        };

        var bindEvents = function() {
            var $sizeFitGuideLink = $(options.sizeFitGuideLink);
            var $contactUsLink = $(options.contactUsLink);

            var $setCentimeterUnit = $(options.setCentimeterUnit);
            var $setInchUnit = $(options.setInchUnit);

            $measuringGuideBody = $(selectors.mgAccordionBody, $sizeGuideMeasurementSection);
            $measuringGuideControl = $(selectors.mgControl, $sizeGuideMeasurementSection);

            if ($sizeFitGuideLink.exists()) {
                $sizeFitGuideLink.on("click", onSizeGuideBtnClick);

                if($(".size-guide__product-measurements").exists()){
                    $(".pdp-accordion__measurement").show()
                }
                $(".pdp-accordion__size-guide").click(function(){
                    $sizeFitGuideLink.trigger("click");
                });
                $(".pdp-accordion__measurement").click(function(){
                    $sizeFitGuideLink.trigger("click");
                    $('html, body').animate({
                        scrollTop: $(".size-guide__product-measurements h4").offset().top
                    }, 1000);
                });
                $(".product-measurements_size-and-fit-guide-popup").click(function(){
                    $('html, body').animate({
                        scrollTop: $(".size-guide__product-measurements h4").offset().top
                    }, 1000);
                });
            }

            if ($contactUsLink.exists()) {
                $contactUsLink.on("click", showMoreInfoSection);
            }

            if ($setCentimeterUnit.exists() && $setInchUnit.exists()) {
               $(options.setCentimeterUnit + ", " + options.setInchUnit + ", " + options.setCentimeterUnitMG + ", " + options.setInchUnitMG).on("change", setUnit);
            }

            if ($measuringGuideBody.exists()) {
                $measuringGuideBody.on("click", ".is-active", function() {
                    updateMeasurementDimensionValues($(this));
                });
            }
        };

        var setUnitMT = function($target) {
            if ($target.data("unit") === "cm") {
                changeTo("cm");
            }

            if ($target.data("unit") === "inch") {
                changeTo("inch");
            }
        };

        var setUnitMG = function($target) {
            $(selectors.garmentUnitValue).text(getFullUnitLabel($target.data("unit")));
            updateMeasurementDimensionValues(getActiveAccordionSection());
        };

        var setUnit = function(e) {
            var $target = (e ? $(e.target) : $("[data-unit]:checked", $sizeGuideModal));
            currentUnit = $target.data("unit");

            syncUnitsSelectors($target);
            setUnitMT($target);

            if (activeSize) {
                setUnitMG($target);
            }
        };

        var syncUnitsSelectors = function($target) {
            $("[data-unit]", $sizeGuideModal).removeAttr("checked");
            $("[data-unit='" + $target.data("unit") + "']", $sizeGuideModal).attr('checked', 'checked');
        };

        var changeTo = function(unit) {
            $("[data-" + unit + "]", $measurementsTable).each(function() {
                if ($(this).data(unit) !== "") {
                    $(this).text( Number( $(this).data(unit) ).toFixed(1) );
                }
            });
        };

        var getFullUnitLabel = function(unit) {
            var units = {
                inch: "Inches",
                cm: "Centimetres"
            };

            return units[unit];
        };

        var setActiveSize = function(variantData) {
            activeSize = variantData.sizeCode;
            removeCurrentClass();
            highlightTablesBySizeCode(variantData.sizeCode, "current");

            updateMeasurementDimensionValues(getActiveAccordionSection());
            setUnit();
        };

        var updateMeasurementDimensionValues = function($that) {
            var dimension = getGarmentDimension($that);

            $that.find(selectors.garmentSizeValue).text(dimension);
            $(selectors.mgGarmentSize).find(selectors.garmentSizeValue).text(dimension);
            $(selectors.garmentSizeLabel).text($that.data("label"));
            $(selectors.measuringImage).attr("src", $that.data("image"));
        };

        var getGarmentDimension = function($that) {
            var $dataRow = $measurementsTable.find("[data-size-code='" + activeSize + "']");
            var $result = $dataRow.find("[data-measurement-code='" + $that.data("measurement-code") + "']");
            return $result.data(currentUnit);
        };

        var initMeasuringGuideControl = function() {
            $(selectors.mgAccordionBody, $sizeGuideMeasurementSection).on("click", ".is-active", function() {
                updateMeasurementDimensionValues($(this));
            });
        };

        var onSizeGuideBtnClick = function() {
            var garmentType = $("#garmentTypeCode").val();
            var mappedGarmentTypeValue = mapToSizeTableType[garmentType]
            $.ajax({
                url: "/component/html/" + mappedGarmentTypeValue,
                type: "GET",
                cache: true,
                success: function(data, status) {
                    $("#displayData").html(data);
                    initTablesScrollbar();
                    initMeasuringGuideControl();
                },
                error: function() {
                    initTablesScrollbar();
                    initMeasuringGuideControl();
                }
            });
        };

        var mapToSizeTableType =
        {
            "womens-all-in-ones" : "womens-clothing",
            "womens-coats" : "womens-clothing",
            "womens-dresses" : "womens-clothing",
            "womens-jackets" :"womens-clothing",
            "womens-jeans" : "womens-jeans",
            "womens-trousers" : "womens-jeans",
            "womens-shorts" : "womens-jeans",
            "womens-skirts" : "womens-clothing",
            "womens-tops" : "womens-clothing",
            "womens-lingerie-sleepwear" : "womens-clothing",
            "womens-shoes" : "womens-shoes",
            "womens-boots-ankle" : "womens-shoes",
            "womens-boots-knee" : "womens-shoes",
            "womens-belts" : "womens-belts",
            "womens-gloves" : "womens-gloves",
            "womens-hats" : "womens-hats",
            "womens-accessories" : "",
            "womens-rings" : "womens-rings",

            "mens-blazers" : "mens-clothing",
            "mens-coats" : "mens-clothing",
            "mens-jeans" : "mens-trousers",
            "mens-trousers" : "mens-trousers",
            "mens-shorts" : "mens-trousers",
            "mens-shirts" : "mens-shirts",
            "mens-jumpers" : "mens-clothing",
            "mens-tshirts-polos" : "mens-clothing",
            "mens-suits" : "mens-suits",
            "mens-shoes" : "mens-shoes",
            "mens-belts" : "mens-belts",
            "mens-gloves" : "mens-gloves",
            "mens-hats" : "mens-hats",
            "mens-underwear-sleepwear-robes" : "mens-clothing",
            "mens-accessories" : "",
            "mens-rings" : ""
        };

        var changeMainImage = function(url) {
            $imageStage = $(options.imageStage);
            $("img", $imageStage).attr("src", url);
        };

        var highlightThumbnail = function($thumb) {
            $(".thumb", $sizeGuideModal).removeClass("active");
            $thumb.closest(".thumb").addClass("active");
        };

        var onGalleryThumbnailClick = function(e) {
            var $target = $(e.target);
            highlightThumbnail($target);
            changeMainImage($target.data("primaryimagesrc"));
        };

        var setDefaultMeasurement = function() {
            var $defaultItem = $(selectors.accordionItem).first();
            selectASizeText = $("#pleaseSelectASize").text();
            $defaultItem.addClass("is-active");

            $(selectors.garmentSizeLabel).text($defaultItem.data("label"));
            $(selectors.measuringImage).attr("src", $defaultItem.data("image"));
            $(selectors.mgAccordionItemBody, $defaultItem).css({display: "block", overflow: "hidden"});
            $(selectors.garmentSizeValue).text(selectASizeText);
            $(selectors.garmentUnitValue).text("");
        };

        var showContactUsThankYou = function() {
            $(".thank-you-message").show();
            $(".contact-form").hide();
        };

        var hideContactUsThankYou = function() {
            $(".thank-you-message").hide();
            $(".contact-form").show();
        };

        var initGallery = function() {
            $imageThumbs = $(options.imageThumbs);

            $imageThumbs.on("click", onGalleryThumbnailClick);
        };

        var onDocumentReady = function() {
            initAddToCart();
            bindEvents();
            initTablesEvents();
            setDefaultMeasurement();
            initGallery();

            mediator.subscribe("pdp:variant:selected", setActiveSize);

            MF.select.init({
                contextId: "#sgCountrySelect"
            });

            MF.select.init({
                contextId: "#sgTypeOfEnquiry"
            });

            hideContactUsThankYou();
        };


        var initGlobals = function(opts) {
            options = $.extend({}, defaults, opts);

            selectors = {
                accordionItem: ".accordion-item",
                sgTableLeft: ".sg__table-left",
                mgAccordionBody: ".sg__measuring-guide__body",
                mgAccordionItemBody: ".sg__measuring-guide__item-body",
                mgGarmentSize: ".sg__measuring-guide__garment-size",
                mgControl: ".sg__measuring-guide__control",
                garmentSizeLabel: ".garment-size-label-text",
                garmentSizeValue: ".garment-size-value",
                garmentUnitValue: ".garment-unit-value",
                measuringImage: "#measuringImage"
            };

            $sizeGuideModal = $(options.sizeGuideModal);
            $sizeConversionTable = $(options.sizeConversionTable);
            $sizeGuideDescriptionSection = $(options.sizeGuideDescriptionSection);
            $sizeGuideMeasurementSection = $(options.sizeGuideMeasurementSection);
            $sizeProductMeasurementSection = $(options.sizeProductMeasurementSection);
            $measurementsTable = $(options.measurementsTable);
            $measurementsTableLeft = $(selectors.sgTableLeft, $sizeProductMeasurementSection);
            $measurementsSizesTable = $(options.measurementsSizesTable);

            currentUnit = options.defaultUnit;
        };

        var initTablesEvents = function() {
            $sizeConversionTable.on("hover", options.cellsID, function(e) {
                var $target = $(e.target);
                var sizeCode = $target.data("base-size-code") ? $target.data("base-size-code") : $target.data("size-code");

                if (sizeCode) {
                    highlightColumnBySizeCode(sizeCode, "hover", $sizeConversionTable);
                }

                highlightCell($target);
            });

            $measurementsTable.on("hover", options.cellsID, function(e) {
                var $target = $(e.target);
                var sizeCode = $target.parent().data("size-code");

                if (sizeCode) {
                    highlightRowBySizeCode(sizeCode, "hover", $measurementsTable);
                    highlightRowBySizeCode(sizeCode, "hover", $measurementsTableLeft);
                }

                highlightCell($target);
            });

            $sizeConversionTable.on("click", options.cellsID, function(e) {
                var $target = $(e.target);
                var size = ($target.data("base-size-code") ? $target.data("base-size-code") : $target.data("size-code"));

                onCellClick($target, size);
            });

            $measurementsTable.on("click", options.cellsID, function(e) {
                var $target = $(e.target);
                var size = $target.closest(options.rowsID).data("size-code");

                onCellClick($target, size);
            });
        };

        var initAddToCart = function() {
            sizeGuideDescriptionSelector = variantSelector();
            var addToBag = addToBagForm();

            sizeGuideDescriptionSelector.init($sizeGuideDescriptionSection);
            addToBag.init($("[data-cart-form='true']", $sizeGuideDescriptionSection), sizeGuideDescriptionSelector);

            sizeGuideMeasurementSelector = variantSelector();
            sizeGuideMeasurementSelector.init($sizeGuideMeasurementSection);
        };

        function revealContactUs() {
            $("#sizeSelect .cs__element").html($("#variantDropDown .cs__element").html());
            MF.select.refresh("#sizeSelect");

            var selectedOption = $("#variantDropDown .cs__options").find(".cs__item.selected").data("value");
            contactUsFormObj.setSelectedSizeOption(selectedOption);

            MF.overlay.openWithElement({
                element: $("#contactUsSection"),
                callbacks: {
                    open: function() {
                        hideContactUsThankYou();
                    }
                }
            });
        }

        function revealMyStylistContactUs($_this) {
            var $el;
            if ( $('.page-wishlist').exists() ) {
                 $el = $_this.prev("#mystylistContactUsSection");
            } else {
                 $el = $("#mystylistContactUsSection");
            }
            $el.find("#sizeSelect .cs__element").empty().html($("#variantDropDown .cs__element").html());
            MF.select.refresh("[data-contact-size]");

            var selectedOption = $("#variantDropDown .cs__options").find(".cs__item.selected").data("value");
            contactUsFormObj.setSelectedSizeOption(selectedOption);
            
            MF.overlay.openWithElement({
                element: $el,
                callbacks: {
                    open: function() {
                        hideContactUsThankYou();
                    }
                }
            });
        }

        function initContactUsForm(form) {
          
            contactUsFormObj = contactUsForm();

            var hideTypeOfEnquiry = $("[data-mystylistonly]").length > 0;

            contactUsFormObj.init({
                selectors: {
                    form: form,
                    email: "#contactByEmail_sg",
                    phone: "#contactByPhone_sg"
                },
                hideTypeOfEnquiry: hideTypeOfEnquiry
            });

            contactUsFormObj.setSubject($("#contactUsPdpSubject").text().trim());

            contactUsFormObj.getValidator().resetForm();

            contactUsFormObj.getForm().ajaxForm({
                // type: "POST",
                dataType: "jsonp",
                success: function() {
                    showContactUsThankYou();
                    return false;

                },
                error: function(){
                    errorContactUS()
                            },
                beforeSubmit: function(arr, $form) {
    
                        $.each(arr, function(index, val) {
                           console.log(val);
                        });
                       
                    contactUsFormObj.getValidator().form();
                  // return false 

                },
                beforeSerialize: function($form) {
                     var replaceSelectValue = ($('#sizeSelect').find(':selected').text().split(" ").join(""));
                        $('#sizeSelect').find(':selected').val(replaceSelectValue);
                }
            });
            return false; 
        }

        function errorContactUS() {
            showContactUsThankYou();
            console.log("Error submitting contact us form");
        }

        function init(opts) {
            initGlobals(opts);

            $(document).ready(function() {
            onDocumentReady();

                $("[data-contactus]").on("click", function (e) {
                    e.preventDefault();
                    initContactUsForm("#contactSfFormSizeGuide");
                    revealContactUs();
                });

                $("#contactUsButton, #myStylistContactUsButton").on("click", function (e) {
                    var $_this = $(this);
                    var id = $_this.data('base-value');
                    e.preventDefault();
                    initContactUsForm("#mystylistContactSfFormSizeGuide__"+id);
                    revealMyStylistContactUs($_this);
                });

                $("[data-mystylistonly]").on("click", function (e) {
                    e.preventDefault();
                    if($('.page-wishlist').exists()) {
                        var $_this = $(this);
                        var id = $_this.data('base-value');
                        var inc = ($_this.parents('.wishlist__item-row').index()).toString();
                        var newFormId = 'mystylistContactSfFormSizeGuide__'+ id +'__'+ inc;

                        $_this.prev("#mystylistContactUsSection").find('form').attr('id', newFormId);
                        initContactUsForm('#'+newFormId);
                        revealMyStylistContactUs($_this);

                        // Required ???
                        $('#'+newFormId).find('#00Nb0000009kl9q').append('<option value="'+$_this.data('base-size').split(" ").join("")+'">'+$_this.data('base-size').split(" ").join("")+'</option>');
                    
                        $('#'+newFormId).find('#sizeSelect').find('.cs__selected').hide();
                        $('#'+newFormId).find('#sizeSelect').append('<span>'+$_this.data('base-size').split(" ").join("")+'</span>');
                        $('#'+newFormId).find('#countrySelect select').attr('name','00Nb0000009klAA');
                        $('#'+newFormId).find('#contactByEmail_sg').attr('name','00Nb0000009klA0');
                        $('#'+newFormId).find('#contactByPhone_sg').attr('name','00Nb0000009kl9v');
                        $('#'+newFormId).find('textarea').attr('name','description');
                        $('#'+newFormId).find('[data-contact-name]').attr('name','00Nb00000049KPW');    
                        $('#'+newFormId).find('#productCodeInput').val($(this).data('base-value'));
                        $('#'+newFormId).find('#subject').val('General Product Request');
                        $('#'+newFormId).find('[name=RecordType]').val('012b0000000Tmbo');
                        $('#'+newFormId).find('[name=orgid]').val('00Db0000000KhGx');
                    }

                });
            });
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.variantSelector, MF.addToBagForm, MF.breakpoint, MF.contactUsForm, mediator));

MF.productSizeGuide.init();