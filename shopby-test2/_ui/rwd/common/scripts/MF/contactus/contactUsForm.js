/*
 *  requires
 */

;(function($, window, contactUsFormValidator) {
    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {
        selectors: {
            form: "#contactSfForm",
            email: "#contactByEmail",
            phone: "#contactByPhone",
            order: "#orderNoContainer",
            firstName: "#name",
            lastName: "#last-name",
            contactName: "[data-contact-name]",
            typeOfEnquiry: "#typeOfEnquiry",
            countrySelect: "#countrySelect",
            sizeSelect: "#sizeSelect",
            subject: "input[type=hidden][name='subject']",
            subjectContainer: ".subjectContainer",
            typeOfEnquiryContainer: "#typeOfEnquiry"
        },
        hideOrderNoField: false,
        hideTypeOfEnquiry: false
    };

    MF.contactUsForm = function () {

        var $form, $emailCheckbox, $phoneCheckbox;
        var $firstName, $lastName, $contactName;
        var $sizeSelect, $subject, $subjectContainer;
        var $typeOfEnquiryContainer;
        var validator, options;

        var radioGroupSetup = function() {
            var onChange = function($elementToUncheck) {
                if(this.checked) {
                    $elementToUncheck.prop("checked", false);
                }
            };

            $emailCheckbox.on("change", _.partial(onChange, $phoneCheckbox));
            $phoneCheckbox.on("change", _.partial(onChange, $emailCheckbox));
        };

        var orderContainerSetup = function() {
            var orderContainer = $form.find(options.selectors.order);

            if (options.hideOrderNoField) {
                orderContainer.html('');
            } else {
                orderContainer.show();
            }
        };

        var getForm = function() {
            return $form;
        };

        var getValidator = function() {
            return validator;
        };

        var setSelectedSizeOption = function(selectedOption) {
            if (selectedOption) {
                var $select = $sizeSelect.find("select");
                $select.val(selectedOption);
                $select.trigger("change");
            }
        };

        var setSubject = function(val) {
            if ($subject) {
                $subject.val(val);
            } else {
                $subjectContainer.html("<input type=hidden name='subject' id='subject' value='" + val + "' />");
            }
        };

        var onNameChange = function() {
            $contactName.val(($firstName.val() + " " + $lastName.val()).trim());
        };

        var firstLastNameSetup = function() {
            $firstName = $form.find(options.selectors.firstName);
            $lastName = $form.find(options.selectors.lastName);
            $contactName = $form.find(options.selectors.contactName);

            $firstName.on("change", onNameChange);
            $lastName.on("change", onNameChange);

            onNameChange(); // initializing contact field
        };

        var initSelectors = function() {
            MF.select.init({contextId: $form.find(options.selectors.typeOfEnquiry)});
            MF.select.init({contextId: $form.find(options.selectors.countrySelect)});
            MF.select.init({contextId: $form.find(options.selectors.sizeSelect)});
        };

        var initForm = function(opts) {
            options = $.extend(true, {}, defaultOptions, opts);

            $form = $(options.selectors.form);
            $emailCheckbox = $form.find(options.selectors.email);
            $phoneCheckbox = $form.find(options.selectors.phone);
            $sizeSelect = $form.find(options.selectors.sizeSelect);
            $subject = $form.find(options.selectors.subject);
            $subjectContainer = $form.find(options.selectors.subjectContainer);
            $typeOfEnquiryContainer = $form.find(options.selectors.typeOfEnquiryContainer);

            if (options.hideTypeOfEnquiry) {
                //$typeOfEnquiryContainer.html("");
            }

            if($form.length != 0) validator = contactUsFormValidator.validate($form);

            firstLastNameSetup();
            orderContainerSetup();
            initSelectors();
            radioGroupSetup();
        };

        return {
            init: initForm,
            getForm: getForm,
            getValidator: getValidator,
            setSelectedSizeOption: setSelectedSizeOption,
            setSubject: setSubject
        }
    };

}(jQuery, this, MF.contactUsFormValidator));