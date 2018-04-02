$(function () {
	$('#btnRandomJoke').click(function(e){
		app.api_get(
			'jokes/random',
			{
				'firstName': 'Thalaiva',
				'lastName': 'Rajinikanth',
			},
			'value'
		)
		.done(function(value){
			$('#divJokeText').html(value.joke);
		})
		.fail(alert);

		e.preventDefault();
	})
});
