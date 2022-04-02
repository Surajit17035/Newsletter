const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { options, post } = require("request");


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;


    // email_address and status is needed in mailchamp server to store data
    var data = {
        members: [
            {
                email_address: email,   //email_address should be match email which we enter from the website.
                status: "subscribed",
                merge_fields : {    // it will merged the first name and the last name to visual the username in mailchamp
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // our Java script object is converting to a JSON format to send a JSON data
    var jsonData = JSON.stringify(data);

    // options part is taking the mailchamp list id url, POST method is for we are submiting data to mailchamp server, 
    // header part is used to authrization and it's was taking any random string + API key to Authenticate.
    // body part is taking a JsonData which should store in mailchamp server.

    var options = {
        url: "https://us20.api.mailchimp.com/3.0/lists/<list_id>",
        method: "POST",
        headers: {
            "Authorization" : "Test <add ur API Key>"
        },
        body: jsonData
    };


    request(options, function(error, response, body){
        if (error){
            res.sendFile(__dirname + "/failure.html"); //sending the failure html file if any error occure.
        }
        else{
            if (response.statusCode === 200){
                res.sendFile(__dirname + "/success.html"); // sending the success html file if our request get successfull.
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        }
    });

    console.log(firstName, lastName, email);
});

// when user tap on the try again button then it will redirect to the home route.
app.post("/failure", function(req, res){
    res.redirect("/");
});

app.post("/success", function(request, response){
    response.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});






// https://git.heroku.com/boiling-tundra-36782.git
