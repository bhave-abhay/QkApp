$(function () {
	$('#btnRandomJoke').click(function(e){
		app.api_get('jokes/random')
			.done(function(rsp){
				app.show_dialog('Data', '<pre>' + JSON.stringify(rsp, null, '\t') + '</pre>');
			})
			.fail(alert);
		e.preventDefault();
	})
});
