var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var bodyParser = require('body-parser');

var auctionItems = require('./auction-items.json');

console.log(auctionItems)

app.use(bodyParser.urlencoded());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'public/views/index.html'));
});


app.post('/upload', function(req, res){

	console.log(req.body)

	savePost(Date.now(), auctionItems, {
	  images:req.body.fileNames,
	  description: req.body.description
	});

	res.send('yeah!');

});

app.post('/upload-photos', function(req, res){

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


var server = app.listen(3000, function(){
	console.log('Server listening on port 3000');
});





function saveJSONToFile(filename, json) {
  // Convert the blogPosts object into a string and then save it to file
  fs.writeFile(filename, JSON.stringify(json, null, '\t') + '\n', function(err) {
    // If there is an error let us know
    // otherwise give us a success message
    if (err) {
      throw err;
    } else {
      console.log('It\'s saved!');
    }
  });
}

function savePost(id, object, data) {
  // Update object with new data
  object[id] = data;
  // Save the updated object to file
  saveJSONToFile('auction-items.json', object);
}
