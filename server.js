var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

app.post('/upload', function(req, res){

	// create an incoming form object
	var form = new formidable.IncomingForm();

	// specify that we want to allow the user to upload multiple files in a single request
	form.multiples = true;

	// store all uploads in the /uploads directory
	form.uploadDir = path.join(__dirname, '/public/uploads');

	// every time a file has been uploaded successfully,
	// rename it to it's orignal name
	form.on('file', function(field, file) {
		fs.rename(file.path, path.join(form.uploadDir, file.name));
	});

	// log any errors that occur
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', function() {
		res.end('success');
	});

	// parse the incoming request containing the form data
	form.parse(req);

});

app.get('/images', function(req, res) {

	var images = "/home/paulf/Desktop/gavin/public/uploads";
	var response = '';

	// Loop through all the files in the temp directory
	fs.readdir(images, function( err, files ) {
		if( err ) {
			console.error( "Could not list the directory.", err );
			process.exit( 1 );
		}

		files.forEach( function( file, index ) {
			console.log(file);
			console.log('resp',response)
			response = response  + '<img src="/uploads/' + file + '"/> <br>'
		} );

		console.log('response',response)
		res.send(response);
	});

});

var server = app.listen(3000, function(){
	console.log('Server listening on port 3000');
});
