var QkAPIGateway = function (objOptions) {
    this.objOptions = objOptions;
    this.prom = function (xhr, sResponseDataKey) {
        var this_ = this;
        function fn_ComposeAjaxErrorMessage(oAjaxError) {
            var sMsg = oAjaxError.status + ' - ' + oAjaxError.statusText;
            if (oAjaxError.responseJSON !== undefined) {
                sMsg += '<br /><span class="text-muted small">' + oAjaxError.responseJSON.MessageDetail + '</span>';
            }
            return sMsg;
        }
        function fn_ComposeAPIErrorMessage(oApiError) {
            var sApiErrorMsg = oApiError.jErrorCode + ' - ' + oApiError.sErrorMessage;
            if (oApiError.sErrorDetails !== '') {
                sApiErrorMsg += '<br /><span class="text-muted small">' + oApiError.sErrorDetails + '</span>';
            }
            return sApiErrorMsg;
        }
        function fn_ApiAjaxSuccess(rsp, dfd, sResponseDataKey) {
            if (this_.objOptions.cbResponseSuccessTest(rsp)) {
                var resolution = null;
                if (rsp.propertyIsEnumerable(sResponseDataKey)) {
                    resolution = rsp[sResponseDataKey];
                }
                else {
                    resolution = rsp;
                }
                dfd.resolve(resolution);
            } else {
                dfd.reject(fn_ComposeAPIErrorMessage(rsp.oError));
            }
        }
        var dfd = $.Deferred();
        xhr
            .done(function (rsp) {
                fn_ApiAjaxSuccess(rsp, dfd, sResponseDataKey);
            })
            .fail(function (oError) {
                dfd.reject(fn_ComposeAjaxErrorMessage(oError));
            });
        return dfd.promise();
    };
};
QkAPIGateway.prototype.GET = function (sResourceURL, objRequestData, sResponseDataKey) {
    var objRequestDataDecorated = this.objOptions.cbDecorateRequestData(objRequestData);
    var sRequestParams = Object.keys(objRequestDataDecorated).map(function (sKey) {
        return encodeURIComponent(sKey) + '=' + encodeURIComponent(objRequestDataDecorated[sKey]);
    }).join('&');
    var urlCall = this.objOptions.sUrlBase + sResourceURL + '/?' + sRequestParams;
    return this.prom($.getJSON(urlCall), sResponseDataKey);
};
QkAPIGateway.prototype.POST = function (sResourceURL, objDataToPost, sResponseDataKey) {
    var objRequestDataDecorated = this.objOptions.cbDecorateRequestData(objDataToPost);
    return this.prom($.ajax({
        type: 'POST',
        dataType: 'json',
        url: this.objOptions.sUrlBase + sResourceURL,
        data: objRequestDataDecorated
    }), sResponseDataKey);
};

var QkSession = function (sPrefix) {

    this.getItem = function (sName) {
        return window.sessionStorage.getItem(sPrefix + sName);
    };
    this.setItem = function (sName, sValue) {
        window.sessionStorage.setItem(sPrefix + sName, sValue);
    };
    this.removeItem = function (sName) {
        window.sessionStorage.removeItem(sPrefix + sName);
    };
};

var QkLoginManager = function (objLoginOptions) {
    this.objLoginOptions = objLoginOptions;

};
QkLoginManager.prototype.login = function (objCreds) {
    var this_ = this;
    $(document).trigger('QkLoginManager:LoginAttempt');
    return this_.objLoginOptions.cbLoginProm(objCreds)
        .done(function (resp) {
            if (resp.propertyIsEnumerable(this_.objLoginOptions.sessionRefKey)) {
                window.sessionStorage.setItem(this_.objLoginOptions.sessionRefKey, JSON.stringify(resp[this_.objLoginOptions.sessionRefKey]));
            }
            if (resp.propertyIsEnumerable(this_.objLoginOptions.userInfoKey)) {
                window.sessionStorage.setItem(this_.objLoginOptions.userInfoKey, JSON.stringify(resp[this_.objLoginOptions.userInfoKey]));
                this_.objLoginOptions.cbUserInfo(resp[this_.objLoginOptions.userInfoKey]);
            }
            $(document).trigger('QkLoginManager:LoginSuccess', resp);
        })
        .fail(function (err) {
            $(document).trigger('QkLoginManager:LoginFailure', err);
        });
};
QkLoginManager.prototype.logout = function () {
    var this_ = this;
    $(document).trigger('QkLoginManager:LogoutAttempt');
    return this_.objLoginOptions.cbLogoutProm()
        .done(function (resp) {
            window.sessionStorage.removeItem(this_.objLoginOptions.sessionRefKey);
            $(document).trigger('QkLoginManager:LogoutSuccess', resp);
        })
        .fail(function (err) {
            $(document).trigger('QkLoginManager:LogoutFailure', err);
        });
};
QkLoginManager.prototype.validateSession = function () {
    var this_ = this;
    $(document).trigger('QkLoginManager:SessionValidaionAttempt');
    return this_.objLoginOptions.cbValidateSessionProm()
        .done(function (resp) {
            if (resp.propertyIsEnumerable(this_.objLoginOptions.sessionRefKey)) {
                window.sessionStorage.setItem(this_.objLoginOptions.sessionRefKey, JSON.stringify(resp[this_.objLoginOptions.sessionRefKey]));
            }
            if (resp.propertyIsEnumerable(this_.objLoginOptions.userInfoKey)) {
                window.sessionStorage.setItem(this_.objLoginOptions.userInfoKey, JSON.stringify(resp[this_.objLoginOptions.userInfoKey]));
                this_.objLoginOptions.cbUserInfo(resp[this_.objLoginOptions.userInfoKey]);
            }
            $(document).trigger('QkLoginManager:SessionValidaionSuccess', resp);
        })
        .fail(function (err) {
            $(document).trigger('QkLoginManager:SessionValidaionFailure');
        });
};
QkLoginManager.prototype.isLoggedIn = function () {
    return window.sessionStorage.getItem(this.objLoginOptions.sessionRefKey) !== null;
};
QkLoginManager.prototype.getAccessToken = function () {
    var tokenJson = window.sessionStorage.getItem(this.objLoginOptions.sessionRefKey);
    var token = '';
    if (tokenJson !== null) {
        token = JSON.parse(tokenJson);
    }
    return token;
};
QkLoginManager.prototype.getCurrentUserInfo = function () {
    return JSON.parse(window.sessionStorage.getItem(this.objLoginOptions.userInfoKey));
};

var QkApp = function ($, objOptions) {
    'use strict';

    var Vetoable = function () {
        var fVetoed = false;
        var arrVetoReason = [];
        this.veto = function (sVetoReason, sTarget) {
            fVetoed = true;
            if (sVetoReason !== undefined || sTarget !== undefined) {
                arrVetoReason.push({
                    sReason: sVetoReason,
                    sTarget: sTarget
                });
            }
        };
        this.isVetoed = function () {
            return !!fVetoed;
        };
        this.getVetoReasons = function () {
            if (fVetoed) {
                return arrVetoReason.slice();
            }
            return null;
        };
    };
    var QkForm = function (objOptions) {
        //Defaults
        var _handlers = {
            cbGetData: function () { return {}; },
            cbShowData: function (objData) { },
            cbOnDirty: function () { }
        };
        var jqElts = {
            validationSummary: $(this.find('*[data-qkform-role="validation-summary"]')[0])
        };

        //init
        jqElts.validationSummary.empty().addClass('alert-warning').hide();

        if (objOptions === undefined) {
            objOptions = {};
        }
        if (typeof objOptions.cbGetData === 'function') {
            _handlers.cbGetData = objOptions.cbGetData;
        }
        if (typeof objOptions.cbShowData === 'function') {
            _handlers.cbShowData = objOptions.cbShowData;
        }

        //event handlers
        {
            let this_form = this;
            this_form.on('change', '*[data-qkform-causesvalidation="true"]', function () {
                this_form.validate();
            });
        }


        //members
        this.validate = function () {
            var evt = new $.Event("qkform:validate");
            var vetoPoll = new Vetoable();
            $('*[data-qkform-causesvalidation="true"]', this)
                .removeClass('bg-warning');
            jqElts.validationSummary.empty().hide();
            this.trigger(evt, vetoPoll);
            if (vetoPoll.isVetoed()) {
                var arrReasons = vetoPoll.getVetoReasons();
                let ul = $('<ul></ul>');
                for (var i = 0; i < arrReasons.length; i++) {
                    if (arrReasons[i].sTarget !== undefined) {
                        $('#' + arrReasons[i].sTarget)
                            .addClass('bg-warning');
                    }
                    if (arrReasons[i].sReason !== undefined) {
                        ul.append(
                            $('<li></li>').html(arrReasons[i].sReason)
                        );
                    }
                }
                jqElts.validationSummary.html(ul).show();
                return false;
            }
            return true;
        };

        this.qkval = function (newVal) {
            if (newVal === undefined) { //Get
                if (this.validate()) {
                    return _handlers.cbGetData();
                }
                return undefined;
            } else { //Set
                _handlers.cbShowData(newVal);
                $('*[data-qkform-causesvalidation="true"]', this).removeClass('bg-warning');
                jqElts.validationSummary.empty().hide();
            }
        };
        return this;
    };
    function QkWizard(objOptions) {

        var jqElts = {
            wizard_frame: $(this.find('*[data-qkwizard-role="frame"]')[0]),
            wizard_frame_title: $(this.find('*[data-qkwizard-role="frame-title"]')[0]),
            wizard_nav_container: $(this.find('*[data-qkwizard-role="nav-container"]')[0]),
            btn_prev: $('<button></button>')
                        .addClass(objOptions.buttons.btnPrev.sCssClasses)
                        .addClass('float-left')
                        .addClass('btn')
                        .html(objOptions.buttons.btnPrev.sText)
                        .prop('tabindex', -1)
                        .on('click', fn_nav_prev),
            btn_next: $('<button></button>')
                        .addClass('float-right')
                        .addClass('btn')
                        .addClass(objOptions.buttons.btnNext.sCssClasses)
                        .html(objOptions.buttons.btnNext.sText)
                        .prop('tabindex', 0)
                        .on('click', fn_nav_next)
        };

        var arrData = [];

        jqElts.wizard_nav_container
                .empty()
                .append(jqElts.btn_prev)
                .append(jqElts.btn_next);
        //jqElts.wizard_frame.empty();
        var arrFormInfo = objOptions.arrForms;
        for (var i = 0; i < arrFormInfo.length; i++) {
            arrFormInfo[i].form.hide();
        }
        var jCurrFormIndex = 0;
        var this_wizard = this;
        function fn_show_form(jFormIndex) {
            arrFormInfo[jCurrFormIndex].form.hide();
            arrFormInfo[jFormIndex].form.show();
            jCurrFormIndex = jFormIndex;
            var formData = {};
            if (jFormIndex < arrData.length) {
                formData = arrData[jFormIndex];
            }
            else {
                let ref = objOptions.arrForms[jFormIndex].data;
                if (typeof ref === 'function') {
                    formData = ref();
                }
                else {
                    formData = ref;
                }
            }
            arrFormInfo[jFormIndex].form.qkval(formData);
            jqElts.wizard_frame_title.html(
				arrFormInfo[jFormIndex].title +
				' <small class="text-muted">[' + (jFormIndex+1) + '/' + arrFormInfo.length + ']</small>'
			);
			$(arrFormInfo[jFormIndex].form.find('input:enabled')[0]).focus();
        }
        function fn_nav_next() {
            var fDone = false;
            var formData = arrFormInfo[jCurrFormIndex].form.qkval();
            if (formData !== undefined) {
                arrData[jCurrFormIndex] = formData;
				if (jCurrFormIndex === arrFormInfo.length - 1) {
	                fDone = true;
	            }
                var jNextFormIndex = jCurrFormIndex + 1;
                if (jNextFormIndex < arrFormInfo.length) {
                    fn_show_form(jNextFormIndex);
                }
                else if (fDone) {
                    this_wizard.trigger('qkwizard:done', arrData);
                }
            }
        }
        function fn_nav_prev() {
            var formData = arrFormInfo[jCurrFormIndex].form.qkval();
            if (formData !== undefined) {
                arrData[jCurrFormIndex] = formData;
            }
            var jNextFormIndex = jCurrFormIndex - 1;
            if (jNextFormIndex >= 0) {
                fn_show_form(jNextFormIndex);
            }
        }

        fn_show_form(0);//init

        return this;
    }
    var QkDialog = function () {
        var timerID = null;
        var cbOnTimeout = null;
        var cbOnClose = null;
        var fShown = false;
        var jqElts = {
            dialog_title: $(this.find('.modal-title')[0]),
            dialog_close: $(this.find('.close')[0]),
            dialog_message: $(this.find('.modal-body')[0]),
            dialog_footer: $(this.find('.modal-footer')[0]),
            dialog_dialogForm: null
        };
        //evet handlers
        {
            var this_dialog = this;
            jqElts.dialog_close.on('click', function (e) {
                this_dialog.hide_dialog();
                e.preventDefault();
            });
            this_dialog.on('hidden.bs.modal', function () {
                jqElts.dialog_footer.empty();
                this_dialog.off('shown.bs.modal');
                $(document, jqElts.dialog).off('keyup');
                if (timerID !== null) {
                    clearTimeout(timerID);
                    timerID = null;
                }
                if (typeof cbOnClose === 'function') {
                    cbOnClose();
                    cbOnClose = null;
                }
            });
        }

        //members
        this.hide_dialog = function () {
            jqElts.dialog_footer.empty();
            if (jqElts.dialog_dialogForm instanceof $) {
                jqElts.dialog_dialogForm.hide().detach();
            }
            this_dialog.modal('hide');
        };
        this.show_dialog = function (sTitle, objMessage, objFormData, nTimeoutSec) {
            if (fShown) {
                this.hide_dialog();
            }
            jqElts.dialog_title.html(sTitle);
            if (jqElts.dialog_dialogForm instanceof $) {
                jqElts.dialog_dialogForm.hide().detach();
            }
            jqElts.dialog_dialogForm = null;
            if (typeof objMessage === 'string') {
                jqElts.dialog_dialogForm = $('<div></div>').append(objMessage).QkForm();
            } else if (objMessage instanceof $) {
                jqElts.dialog_dialogForm = objMessage.show();
            }
            $('*[data-qkform-causesvalidation="true"]', jqElts.dialog_dialogForm).removeClass('bg-warning');
            jqElts.dialog_message.html(jqElts.dialog_dialogForm);
            this_dialog.on('shown.bs.modal', function () {
                if (nTimeoutSec !== undefined) {
                    if (timerID !== null) {
                        clearTimeout(timerID);
                        timerID = null;
                    }
                    timerID = setTimeout(this_dialog.hide_dialog, nTimeoutSec * 1000 /*milliseconds*/);
                }
                if (objFormData !== undefined) {
                    jqElts.dialog_dialogForm.qkval(objFormData);
                }
                $(document, jqElts.dialog).keyup(function (e) {
                    if (e.keyCode === 27) { // escape key
                        this_dialog.hide_dialog();
                        e.preventDefault();
                    }
                });
                fShown = true;
            }).on('hidden.bs.modal', function () {
                if (timerID !== null) {
                    clearTimeout(timerID);
                    timerID = null;
                }
                $(document, jqElts.dialog).off('keyup');
                fShown = false;
            });

            this_dialog.modal({
                'backdrop': false,
                'keyboard': false,
                'show': true
            });
            return this;
        };
        this.buttons = function (arrButtons) {
            jqElts.dialog_footer.empty();
            arrButtons.forEach(function (btn) {
                $('<div></div>')
                    .addClass('btn').addClass(btn.cssClasses)
                    .html(btn.sText)
                    .attr('tabindex', 0)
                    .click(function (evt) {
                        var dialogState = {
                            fValid: jqElts.dialog_dialogForm.validate()
                        };
                        if (dialogState.fValid) {
                            dialogState.formData = jqElts.dialog_dialogForm.qkval();
                        }
                        btn.onClick(dialogState);
                    })
                    .keypress(function (e) {
                        if (e.key === "Enter" || e.char === "\n") { //Enter
                            $(e.target).click();
                        }
                    })
                    .appendTo(jqElts.dialog_footer);
            });
            return this;
        };
        this.detach();
        return this;
    };
    var QkOverlay = function () {
        function CreateOverlayElt(sMsgHtml, sImgHtml) {
            if (sMsgHtml === undefined) {
                sMsgHtml = '<h1>Loading... please wait!</h1>';
            }
            if (sImgHtml === undefined) {
                //sImgHtml = '<i class="fa fa-sync fa-spin fa-5x fa-fw" aria-hidden="true"></i>';
                sImgHtml = '<span class="fa-layers fa-fw fa-5x">' +
                            '<i class="fas fa-cogs"></i>' +
                            '<i class="fas fa-cog fa-inverse fa-spin" data-fa-transform="shrink-6 down-3"></i>' +
                            '<i class="fas fa-cog fa-inverse fa-spin" data-fa-transform="shrink-8 up-5.5 left-6"></i>' +
                            '<i class="fas fa-cog fa-inverse fa-spin" data-fa-transform="shrink-10 up-5.5 right-6"></i>' +
                          '</span>';
            }
            var eltOverlay = $('<div></div>');
            var eltWrapper = $('<div></div>');
            var eltImage = $('<div></div>').css({
                'filter': 'drop-shadow(5px 5px 4px #red)'
            }).html(sImgHtml);
            var eltText = $('<div></div>').html(sMsgHtml);
            eltWrapper.addClass('col').append(eltImage).append(eltText.addClass('text-light'));
            eltOverlay.addClass('row').append(eltWrapper);
            eltOverlay.css({
                'position': 'absolute',
                'top': '0px',
                'width': '100%',
                'height': '100%',
                'min-height': '200px',
                'padding': '5px',
                'background': 'rgba(0,0,0,0.7)',
                'display': 'flex',
                'align-items': 'center',
                'text-align': 'center'
            });
            return eltOverlay;
        }
        var eltOverlay = null;
        this.show_overlay = function (sMsgHtml, sImgHtml) {
            if (eltOverlay !== null) {
                eltOverlay.detach();
                eltOverlay = null;
            }
            eltOverlay = CreateOverlayElt(sMsgHtml, sImgHtml);
            this.append(eltOverlay);
        };
        this.hide_overlay = function () {
            eltOverlay.detach();
            eltOverlay = null;
        };
        return this;
    };
    var QkAlert = function () {
        function CreateAlertElt(msg, cssClass) {
            var elt = $('<div class="alert alert-dismissable"><span class="close" data-dismiss="alert" aria-label="close">&times;</span></div>');
            elt.addClass(cssClass);
            elt.append(msg);
            return elt;
        }
        var this_ = this;
        this_.show_alert = function (msg, cssClass, nTimeoutSec) {
            if (cssClass === undefined) {
                cssClass = 'alert-warning';
            }
            if (nTimeoutSec === undefined) {
                nTimeoutSec = 10;
            }
            var alertElt = CreateAlertElt(msg, cssClass);
            if (nTimeoutSec !== 0) {
                setTimeout(function () {
                    alertElt.toggle("fold", function () { alertElt.detach(); });
                }, nTimeoutSec * 1000 /* ms */);
            }
            $(this_).prepend(alertElt.hide());
            alertElt.toggle("fold");
        };
        return this_;
    };

    //Add functions to JQuery namespace
    $.fn.QkForm = QkForm;
    $.fn.QkWizard = QkWizard;
    $.fn.QkDialog = QkDialog;
    $.fn.QkOverlay = QkOverlay;
    $.fn.QkAlert = QkAlert;

    var initUI = function (thisApp, options) {
        var objOptionsDefault = {
            'eltDialog': $(document).find('*[data-qkapp-role="dialog"]')[0],
            'eltOverlayContainer': $(document).find('*[data-qkapp-role="overlay-container"]')[0],
            'eltAlertContainer': $(document).find('*[data-qkapp-role="alert-container"]')[0]
        };
        var objOptions = $.extend({}, objOptionsDefault, options);

        var _qk_alert = $(objOptions.eltAlertContainer).QkAlert();
        thisApp.alert = _qk_alert.show_alert.bind(_qk_alert);

        var _qk_dialog = $(objOptions.eltDialog).QkDialog();
        thisApp.show_dialog = _qk_dialog.show_dialog.bind(_qk_dialog);
        thisApp.hide_dialog = _qk_dialog.hide_dialog.bind(_qk_dialog);

        var _qk_overlay = $(objOptions.eltOverlayContainer).QkOverlay();
        thisApp.show_overlay = _qk_overlay.show_overlay.bind(_qk_overlay);
        thisApp.hide_overlay = _qk_overlay.hide_overlay.bind(_qk_overlay);
    };
    var initApiGateway = function (thisApp, options) {
        var _qk_api = new QkAPIGateway(options);
        thisApp.api_get = QkAPIGateway.prototype.GET.bind(_qk_api);
        thisApp.api_post = QkAPIGateway.prototype.POST.bind(_qk_api);
    };
    var initLoginManager = function (thisApp, options) {
        var _qk_loginmanager = new QkLoginManager(options);
        thisApp.login = QkLoginManager.prototype.login.bind(_qk_loginmanager);
        thisApp.logout = QkLoginManager.prototype.logout.bind(_qk_loginmanager);
        thisApp.validateSession = QkLoginManager.prototype.validateSession.bind(_qk_loginmanager);
        thisApp.isLoggedIn = QkLoginManager.prototype.isLoggedIn.bind(_qk_loginmanager);
        thisApp.getAccessToken = QkLoginManager.prototype.getAccessToken.bind(_qk_loginmanager);
        thisApp.getCurrentUserInfo = QkLoginManager.prototype.getCurrentUserInfo.bind(_qk_loginmanager);
    };
    //Initialize app
    initUI(this, objOptions.uiConfig);
    if (objOptions.hasOwnProperty('apiConfig')) {
        initApiGateway(this, objOptions.apiConfig);
    }
    if (objOptions.hasOwnProperty('loginConfig')) {
        initLoginManager(this, objOptions.loginConfig);
    }
};
