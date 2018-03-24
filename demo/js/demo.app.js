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
	$('.usermenu').show();
	$('.visitormenu').hide();
});
$(document).on('QkLoginManager:SessionValidatationFailure', function (evt, resp) {
	$('.usermenu').hide();
	$('.visitormenu').show();
});

$(document).on('QkLoginManager:LoginSuccess', function (evt, resp) {
	$('.usermenu').show();
	$('.visitormenu').hide();
});
$(document).on('QkLoginManager:LogoutSuccess', function (evt, resp) {
    window.location.replace('Default.aspx');
	$('.usermenu').hide();
	$('.visitormenu').show();
});
app.validateSession();
*/
window.alert = app.alert.bind(app);
