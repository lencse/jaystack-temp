/**
 * Created by omoni on 23/07/2014.
 */
;
(function ($, window, document, select, passwordFormValidator) {
    'use strict';

    var MF = window.MF || {};

    MF.myaccount = (function () {

        function init() {
            $(function () {
                bindUsePostCodeLookup();
                bindEnterAddManual();
                bindSubmitLookupAddress();
                bindAddDropDown();
                bindCreditCurrencySelect();
                initStickyNavbar();
                initDropdown();
                initUpdateMessage();
                bindEvents()

                if ($(".acc__contact").exists()) {
                    //validateContactForm();

                    passwordFormValidator.validate($("#updatePasswordForm"));

                    updateInputFieldOutline();
                    toggleSubmitButtonMode("updateProfileForm");
                    toggleSubmitButtonMode("updateEmailForm");
                }
            });
        }

        function initUpdateMessage() {
            var $formContainer = $('.change-password').find('#localMessagePlaceholder');

            if ($formContainer.exists()) {
                var $messagePlaceHolder = $('#globalMessages').find('.alert'),
                    messagePlaceHolderText = $.trim($messagePlaceHolder.text());

                if ($messagePlaceHolder.hasClass('negative')) {
                    $formContainer.text(messagePlaceHolderText).removeAttr('class').addClass('red-alert');
                    $messagePlaceHolder.empty();
                } else {
                    $formContainer.text(messagePlaceHolderText).removeAttr('class').addClass('green-alert');
                    $messagePlaceHolder.empty();
                }
            }
        }

        function initStickyNavbar() {
            if( $('.acc__nav').length > 0 ) {
                MF.stickit.init({
                    targetElement: '.acc__nav',
                    topElement: '.header-wrapper',
                    bottomElement: '.mf-footer'
                });
            }
        }

        function initDropdown(){
            select.init({
                links: true,
                contextId: ".acc__nav__mobile__menu"
            });
        }

        function bindUsePostCodeLookup() {
            $(document).on("click", '#usePostCodeLookup', function () {
                $("#manualAddressEntry").hide();
                $("#usePostCodeLookup").hide();
                $("#enterAddManual").show();
                $("#lookupelements").show();
            });
        }

        function bindEnterAddManual() {
            $(document).on("click", '#enterAddManual', function () {
                $("#manualAddressEntry").show();
                $("#usePostCodeLookup").show();
                $("#enterAddManual").hide();
                $("#lookupelements").hide();
            });
        }

        function bindSubmitLookupAddress() {
            $(document).on("click", '#lookupAccountAddressBtn', function () {

                var postcode = $('#address\\.postalCode').val();
                var country = $('#address\\.country').val();
                var building = $('#address\\.line1').val();
                if (country == null) {
                    $("#countryNotSelectedDisplaylabel").show();
                    return;
                }

                $.ajax({
                    beforeSend: function (request)
                    {
                        request.setRequestHeader("Cache-Control", "no-store");
                    },
                    url: "/ajax/addresslookup",
                    data: {postcode: postcode, country: country, building: building},
                    cache: false,
                    success: function (data) {
                        if (Object.keys(data).length > 0) {
                            populateSelect(data);
                            $("#addNotListedDisplaylabel").hide();
                        } else {
                            $("#addDropdown").empty();
                            $("#addNotListedDisplaylabel").show();
                        }
                    }
                });
            });
        }

        function bindAddDropDown() {
            $(document).on("click", '#addDropdown', function () {
                var selectedAddress = $(this).val();
                setAddressFields(selectedAddress);
            });
        }


        function populateSelect(addresses) {
            $("#addDropdown").empty();
            $("#addDropdown").append(new Option("Select Address", ""));

            $.each(addresses, function (i, v) {
                var selectOption = "<option value='"
                    + addresses[i].address1 + "|"
                    + addresses[i].address2 + "|"
                    + addresses[i].postalCode + "|"
                    + addresses[i].town +
                    "'>" + addresses[i].address1 + " " + addresses[i].address2 + "</option>";
                $("#addDropdown").append(selectOption);
            });

        }

        function setAddressFields(selectedAddress) {
            var split = selectedAddress.split('|');
            $("#accountAddressForm #address\\.line1").val(split[0]);
            $("#accountAddressForm #address\\.line2").val(split[1]);
            $("#accountAddressForm #address\\.postalCode").val(split[2]);
            $("#accountAddressForm #address\\.townCity").val(split[3]);
        }

        function bindCreditCurrencySelect() {
            MF.select.init({
                contextId: '#credit-currency-selector',
                callback: function() {
                    $('#credit-currency-selector').submit();
                }
            });
        
            $(document).on("change", '#credit-currency-selector', function () {
                window.location.href = window.location.pathname + '?currency='+ $(this).val();
            });
        }

        function toggleSubmitButtonMode(formName){
            var buttonWrapper = $("#" + formName);
            var editModeMessage = buttonWrapper.find(".editModeMessage");
            var savedModeMessage = buttonWrapper.find(".savedModeMessage");
            var inputLabel = buttonWrapper.find(".control-group");
            var genericMessage = buttonWrapper.find(".generic__error__message");
            var propertyChangeUnbound = false;

            buttonWrapper.find(".default-opt").andSelf().one("click", function(e){
                e.preventDefault();
                editModeMessage.show();
                savedModeMessage.hide();
            });

            if( inputLabel.hasClass("error") ){
                editModeMessage.show();
                savedModeMessage.hide();
                genericMessage.addClass("error");
            }
        }

        function updateInputFieldOutline(){
            $(".acc__contact").find( "input[type='text'], input[type='password']" ).each(function( index ) {
                if( $( this ).val().length > 0 ){
                    $( this ).addClass("blackOutline");
                } else {
                    $( this ).removeClass("blackOutline");
                }
            });
        }

        function validateContactForm(){
            $("#updateProfileForm").validate({
                onfocusout: function(element) {
                    $(element).valid();
                },
                rules: {
                    titleCode: {
                        maxlength: 255,
                        required: true
                    },
                    firstName: {
                        maxlength: 255,
                        required: true
                    },
                    lastName: {
                        maxlength: 255,
                        required: true
                    },
                    phone: {
                        pattern: '(?=[\\d \\(\\)\\+\\-]+$)\\D*(\\d\\D*){9,}.*'
                    }
                },
                errorPlacement: function(error, element) {
                    error.insertBefore(element);
                }
            });
        }

        function popUps(type){
            var userEmail = $.cookie("userID");
            var womensUrl = 'https://cb.sailthru.com/manage/3n2/mens-designers?email='+userEmail,
                mensUrl = 'https://cb.sailthru.com/manage/3n2/womens-designers?email='+userEmail;
   
            MF.overlay.openWithElement({
                element: $(type),
                callbacks: {
                    open: function() {
                        MF.busyOverlay.enable();
                         $(type).find('iframe').on('load', function(event) {
                            done: {
                             MF.busyOverlay.disable();
                             $(this).height($(window).height()-150)
                            }
                        });
                    }
                }
            });

        }

        function bindEvents(){

            $('#menInit').on('click', function(event) {
                event.preventDefault();
                popUps("#menPopUp");
            });
            $('#womenInit').on('click', function(event) {
                event.preventDefault();
                popUps("#womenPopUp");
            });
            
        }


        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.select, MF.passwordFormValidator));

if ($(".acc__pages").exists()) {
    MF.myaccount.init();
}