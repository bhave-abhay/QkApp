$(function () {
	$('#btnRandomJoke').click(function(e){
		app.api_get('jokes/random', {}, 'value')
			.done(function(value){
				$('#divJokeText').html(value.joke);
			})
			.fail(alert);
		e.preventDefault();
	})
});
