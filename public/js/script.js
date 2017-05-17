(function(){

    var fileNames = [];



	$('body').on('click', '.remove-file', function(){

		var file = $(this).prev('.file-name').text();

		var index = fileNames.indexOf(file);

		if (index > -1) {
			fileNames.splice(index, 1);
		}

		$('.files-uploaded').empty();

		fileNames.forEach(function(item){
			$('.files-uploaded').append("<li><p class='file-name'>" + item + "</p><i class='fa fa-times remove-file' aria-hidden='true'></i></li>");
		});


	});



	$('.upload-btn').on('click', function (){

		$('.progress-bar').text('0%');
		$('.progress-bar').width('0%');
		$('#upload-input').click();

	});

	$('form').submit(function(e){

		e.preventDefault();

		var description = $('.auction-description').val();

		var data = {
			description,
			fileNames
		};

		$.ajax({
			url: '/upload',
			type: 'POST',
			data,
			success: function(data){
				console.log(data)
			}
		});
	});

    $('#upload-input').on('change', function(){

		var files = $(this).get(0).files;

		if (files.length > 0){
			// create a FormData object which will be sent as the data payload in the
			// AJAX request
			var formData = new FormData();

			// loop through all the selected files and add them to the formData object
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				fileNames.push(file.name);

				// add the files to formData object for the data payload
				formData.append('uploads[]', file, file.name);
			}

			$.ajax({
				url: '/upload-photos',
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(data){
					$('.files-uploaded').empty();

					fileNames.forEach(function(item){
						$('.files-uploaded').append("<li><p class='file-name'>" + item + "</p><i class='fa fa-times remove-file' aria-hidden='true'></i></li>");
					});

					console.log('upload successful!\n' + data);
				},
				xhr: function() {

				// create an XMLHttpRequest
				var xhr = new XMLHttpRequest();

				// listen to the 'progress' event
				  xhr.upload.addEventListener('progress', function(evt) {

					if (evt.lengthComputable) {
					// calculate the percentage of upload completed
						var percentComplete = evt.loaded / evt.total;
						percentComplete = parseInt(percentComplete * 100);

						// update the Bootstrap progress bar with the new percentage
						$('.progress-bar').text(percentComplete + '%');
						$('.progress-bar').width(percentComplete + '%');

						// once the upload reaches 100%, set the progress bar text to done
						if (percentComplete === 100) {
							$('.progress-bar').html('Done');
						}

					}

				  }, false);

				  return xhr;
				}
			});
		}
	});


})();
