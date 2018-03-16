var app = new SillyApp($, {

    apiConfig: {
        'sUrlBase': 'https://api.chucknorris.io/',
        'cbDecorateRequestData': function (objRequestData) { // DecorateRequestData callback
            objDefault = { };
            var decorateRequestData = $.extend({ }, objDefault, objRequestData);
            return decorateRequestData;
        },
        'cbResponseSuccessTest': function (rsp) { //Repsponse success test callback
            return true;
        }
    }/*,
    loginConfig: {
        'cbLoginProm': function (objLoginCreds) {
            return false; //app.api_post('Auth/Login', objLoginCreds);
        },
        'cbLogoutProm': function () {
            return false; //app.api_post('Auth/Logout');
        },
        'cbValidateSessionProm': function () {
            return false; //app.api_post('Auth/ValidateSession');
        },
        'sessionRefKey': '',
        'userInfoKey': '',
        'cbUserInfo': function (userInfo) { }
    }
    */
});
/*
$(document).on('SillyLoginManager:SessionValidatationSuccess', function (evt, resp) {

});
$(document).on('SillyLoginManager:SessionValidatationFailure', function (evt, resp) {

});

$(document).on('SillyLoginManager:LoginSuccess', function (evt, resp) {
    window.location.replace('CPUsers.aspx');
});
$(document).on('SillyLoginManager:LogoutSuccess', function (evt, resp) {
    window.location.replace('Default.aspx');
});
app.validateSession();
*/
window.alert = app.alert.bind(app);
