$(document).ready(function() {
	$('#app-name').focus();
	$('form').on('submit', function(e) {
		$('#loading').show();
		e.preventDefault();
		$.ajax({
			url: '/',
			method: 'POST',
			data: { app: $('#app-name').val() },
			success: function(response) {
				$('#app-name').val("");
				$('#loading').hide();
				$('#success').text(response);
				$('#success').show();
			},
			error: function(response) {
				$('#loading').hide();
				$('#error').text(response.responseText);
				$('#error').show();	
			}
		})
	});

	$('#app-name').on('input', function() {
		$('#success').hide();
		$('#error').hide();
	})
});