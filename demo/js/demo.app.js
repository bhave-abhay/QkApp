var app = new QkApp($, {

    apiConfig: {
        'sUrlBase': 'https://api.icndb.com/',
        'cbDecorateRequestData': function (objRequestData) { // DecorateRequestData callback
            objDefault = {
				'firstName': 'Suhas',
				'lastName': 'Palkar',
				'limitTo': ['nerdy']
			};
            var decorateRequestData = $.extend({ }, objDefault, objRequestData);
            return decorateRequestData;
        },
        'cbResponseSuccessTest': function (rsp) { //Repsponse success test callback
            return rsp.type==='success';
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
$(document).on('QkLoginManager:SessionValidatationSuccess', function (evt, resp) {

});
$(document).on('QkLoginManager:SessionValidatationFailure', function (evt, resp) {

});

$(document).on('QkLoginManager:LoginSuccess', function (evt, resp) {
    window.location.replace('CPUsers.aspx');
});
$(document).on('QkLoginManager:LogoutSuccess', function (evt, resp) {
    window.location.replace('Default.aspx');
});
app.validateSession();
*/
window.alert = app.alert.bind(app);
