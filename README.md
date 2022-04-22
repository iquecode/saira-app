# saira-app



~~~javascript
const file = new Parse.File("myfile.zzz", fileData, "image/png");
// In a browser, you’ll want to use an html form with a file upload control. To do this, create a file input tag which allows the user to pick a file from their local drive to upload:

//<input type="file" id="profilePhotoFileUpload">
//Then, in a click handler or other function, get a reference to that file:

const fileUploadControl = $("#profilePhotoFileUpload")[0];
if (fileUploadControl.files.length > 0) {
  const file = fileUploadControl.files[0];
  const name = "photo.jpg";

  const parseFile = new Parse.File(name, file);
}


//Next you’ll want to save the file up to the cloud. As with Parse.Object, there are many variants of the save method you can use depending on what sort of callback and error handling suits you.

parseFile.save().then(function() {
  // The file has been saved to Parse.
}, function(error) {
  // The file either could not be read, or could not be saved to Parse.
});


//SERVER SIDE WITH CLOUD CODE
//In Cloud Code you can fetch images or other files and store them as a Parse.File.

const request = require('request-promise');
const Parse = require('parse/node');

....

const options = {
  uri: 'https://bit.ly/2zD8fgm',
  resolveWithFullResponse: true,
  encoding: null, // <-- this is important for binary data like images.
};

request(options)
  .then((response) => {
    const data = Array.from(Buffer.from(response.body, 'binary'));
    const contentType = response.headers['content-type'];
    const file = new Parse.File('logo', data, contentType);
    return file.save();
  })
  .then((file => console.log(file.url())))
  .catch(console.error);

//Embedding files in other objects

//Finally, after the save completes, you can associate a Parse.File with a Parse.Object just like any other piece of data:

const jobApplication = new Parse.Object("JobApplication");
jobApplication.set("applicantName", "Joe Smith");
jobApplication.set("applicantResumeFile", parseFile);
jobApplication.save();

~~~

