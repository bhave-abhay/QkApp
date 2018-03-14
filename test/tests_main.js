$(function () {
    alert('Hello...');
    app.show_dialog(
        'Simple dialog',
        'Sample text content of the dialog.'
        )
        .buttons([{
            'sText': 'Ok',
            'cssClasses': 'btn-danger',
            'onClick': fn_show_login_dialog
        }]);

    var formLogin = $('#formLogin').SillyForm({
        cbGetData: function () {
            return {
                'sUserId': $('#txtUsername').val(),
                'sPswdHash': CryptoJS.SHA512($('#txtPassword').val()).toString().toUpperCase()
            };
        },
        cbShowData: function (objData) {
            $('#txtUsername').val(objData.sUserId);
            $('#txtPassword').val('');
        }
    });
    formLogin.on('sillyform:validate', function (evt, vetoPoll) {
        var eltUserName = $('#txtUsername');
        var eltPswd = $('#txtPassword');
        if (eltUserName.val() === '') {
            vetoPoll.veto('User name not entered', 'txtUsername');
        }
        if (eltPswd.val() === '') {
            vetoPoll.veto('Password not entered', 'txtPassword');
        }
    });
    formLogin.hide();

    var formBusiness = $('#formBusiness').SillyForm({
        cbGetData: function () {
            return {
            };
        },
        cbShowData: function (objData) {
        }
    });
    formBusiness.on('sillyform:validate', function (evt, vetoPoll) {

    });
    formBusiness.hide();

    function fn_show_login_dialog() {
        app.show_dialog('Login', formLogin, { 'sUserId': 'Abhay.Bhave' })
            .buttons([{
                'sText': 'Login',
                'cssClasses': 'btn-success',
                'onClick': function (dialogState) {
                    if (dialogState.fValid) {
                        app.show_dialog('FormData (Dialog timeout: 5 sec)', '<pre>' + JSON.stringify(dialogState.formData, null, '\t') + '</pre>', {}, 5)
                            .buttons([{
                                'sText': 'Close',
                                'cssClasses': 'btn-success',
                                'onClick': function () { app.hide_dialog(); }
                            }])
                    }
                }
            }, {
                'sText': 'Cancel',
                'cssClasses': 'btn-danger',
                'onClick': function () { app.hide_dialog(); }
            }]);
    }

    var formBusiness_basic = $('#formBusiness_basic').SillyForm({
        cbGetData: function () {
            return {
                'sBusinessName': $('#txtBusinessFullName').val(),
                'sBusinessShortName': $('#txtBusinessShortName').val(),
                'sAddressLine1': $('#txtAddressL1').val(),
                'sAddressLine2': $('#txtAddressL2').val(),
                'sCity': $('#txtBusinessCity').val(),
                'sDistrict': $('#txtBusinessDistrict').val(),
                'sState': $('#txtBusinessState').val(),
                'sPostalCode': $('#txtBusinessPostalCode').val(),
                'sCountryCode': $('#txtBusinessCountryCode').val()
            };
        },
        cbShowData: function (objData) {
            $('#txtBusinessFullName').val(objData.sBusinessName);
            $('#txtBusinessShortName').val(objData.sBusinessShortName);
            $('#txtBusinessCity').val(objData.sCity);
            $('#txtBusinessState').val(objData.sState);
            $('#txtBusinessCountryCode').val(objData.sCountryCode);
        }
    });
    formBusiness_basic.on('sillyform:validate', function (evt, vetoPoll) {
        if ($('#txtBusinessShortName').val() === '') {
            vetoPoll.veto('Short name of Business is mandatory', 'txtBusinessShortName');
        }
    });

    var formBusiness_contact = $('#formBusiness_contact').SillyForm({
        cbGetData: function () {
            return {
                sPhoneNumber1: $('#txtBusinessPhoneNumber1').val(),
                sPhoneNumber2: $('#txtBusinessPhoneNumber2').val(),
                sEmailId: $('#txtBusinessEmail').val()
            };
        },
        cbShowData: function (objData) {
            $('#txtBusinessPhoneNumber1').val(objData.sPhoneNumber1);
        }
    });
    formBusiness_contact.on('sillyform:validate', function (evt, vetoPoll) {
        if ($('#txtBusinessEmail').val() === '') {
            vetoPoll.veto('Business email is mandatory', 'txtBusinessEmail');
        }
    });

    var formAdmin_basic = $('#formAdmin').SillyForm({
        cbGetData: function () {
            return {
                'sNameFirst': $('#txtFirstName').val(),
                'sNameLast': $('#txtLastName').val(),
                'sNameOther': '',
                'sEMail': $('#txtEMail').val(),
                'sMobileNumber': $('#txtMobile').val(),
                'sUserId': $('#txtNewUsername').val()
            };
        },
        cbShowData: function (objData) {
            $('#txtFirstName').val(objData.sNameFirst);
            $('#txtLastName').val(objData.sNameLast);
            $('#txtEMail').val(objData.sEMail);
            $('#txtMobile').val(objData.sMobileNumber);
        }
    });
    formAdmin_basic.on('sillyform:validate', function (evt, vetoPoll) {
        if ($('#txtFirstName').val() === '') {
            vetoPoll.veto('First name not entered', 'txtFirstName');
        }
        if ($('#txtEMail').val() === '') {
            vetoPoll.veto('e-mail not entered', 'txtEMail');
        }
        if ($('#txtMobileNumber').val() === '') {
            vetoPoll.veto('Mobile number not entered', 'txtMobileNumber');
        }
        if ($('#txtNewUsername').val() === '') {
            vetoPoll.veto('User name not entered', 'txtNewUsername');
        }
        if (!$('#chkTnC').prop('checked')) {
            vetoPoll.veto('You must agree Terms of use in order to use the system', 'chkTnC');
        }
    });

    var formAdmin_SecurityInfo = $('#formAdmin_SecurityInfo').SillyForm({
        cbGetData: function () {
            //var userInfo = $('#txtUsername_ro').data('userInfo');
            return {
                sPswdHashNew: CryptoJS.SHA512($('#txtNewPassword').val()).toString().toUpperCase(),
                sSecretQuestion: $('#txtSecretQuestion').val(),
                sSecretAnswerHash: CryptoJS.SHA512($('#txtSecretAnswer').val()).toString().toUpperCase()
            }
        },
        cbShowData: function (objData) {
            $('#txtUsername_ro').val(objData.sUserId);
        }
    });
    formAdmin_SecurityInfo.on('sillyform:validate', function (evt, vetoPoll) {
        if ($('#txtNewPassword').val() === '') {
            vetoPoll.veto('Password not entered', 'txtNewPassword');
        }
        if ($('#txtConfirmNewPassword').val() === '') {
            vetoPoll.veto('Password not confirmed', 'txtConfirmNewPassword');
        }
        if ($('#txtNewPassword').val() !== $('#txtConfirmNewPassword').val()) {
            vetoPoll.veto('Password confirmation failed', 'txtConfirmNewPassword');
        }
    });

    var formOTP = $('#formOTP').SillyForm({
        cbGetData: function () {
            return {
                'sOtpHash': CryptoJS.SHA512($('#txtOTP').val()).toString().toUpperCase()
            };
        }
    });
    formOTP.on('sillyform:validate', function (e, vetoPoll) {
        if ($('#txtVetoPoll').val() === '') {
            vetoPoll.veto('OTP not entered!', 'txtOTP');
        }
    });

    var wizardCreateBusiness = $('#divWizard').SillyWizard({
        arrForms: [
            {
                form: formBusiness_basic,
                data: {
                    'sBusinessName': 'Alpha Bravo and Charlie Corporation',
                    'sBusinessShortName': 'ABC',
                    'sCity': 'Washington',
                    'sState': 'New York',
                    'sCountryCode': 'US'
                },
                title: 'Business - Basic Information'
            },
            {
                form: formBusiness_contact,
                data: {
                    'sPhoneNumber1': '12345678900',
                    'sEmailId': 'info@abccorp.com'
                },
                title: 'Business - Contact Information'
            },
            {
                form: formAdmin_basic,
                data: {
                    'sNameFirst': 'John',
                    'sNameLast': 'Smith',
                    'sEMail': 'john.smith@abccorp.com',
                    'sMobileNumber': '55588899990'
                },
                title: 'Admin User - Basic Information'
            },
            {
                form: formAdmin_SecurityInfo,
                data: function () { return formAdmin_basic.sillyval(); },
                title: 'Admin User - Security Information'
            },
            {
                form: formOTP,
                data: {},
                title: 'Enter OTP'
            }
        ],
        buttons: {
            btnNext: {
                sText: 'Next',
                sCssClasses: 'btn-outline-primary'
            },
            btnPrev: {
                sText: 'Previous',
                sCssClasses: 'btn-outline-primary'
            }
        }
    });
    wizardCreateBusiness.on(
        'sillywizard:done',
        function (evt,
            dataBusiness_basic,
            dataBusiness_contact,
            dataAdmin_basic,
            dataAdmin_SecurityInfo,
            dataOTP) {
            OtpReq = {
                'business': $.extend({}, dataBusiness_basic, dataBusiness_contact),
                'adminUser': $.extend({}, dataAdmin_basic, dataAdmin_SecurityInfo),
                'sOtpHash': dataOTP.sOtpHash
            };
            app.show_dialog('Data', '<pre>' + JSON.stringify(OtpReq, null, '\t') + '</pre>')
                .buttons([{
                    'sText': 'Ok',
                    'sCssClasses': 'btn-outline-primary',
                    'onClick': function (dialogState) {
                        app.hide_dialog();
                    }
                }]);

        });
});