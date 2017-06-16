
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCaDSSE_wszpWiAof7MTSthbn89BtGR-K0",
    authDomain: "traintimings-e4ea2.firebaseapp.com",
    databaseURL: "https://traintimings-e4ea2.firebaseio.com",
    storageBucket: "traintimings-e4ea2.appspot.com",
    messagingSenderId: "305858823657"
  };
  firebase.initializeApp(config);


//Initialize Firebase variable
var database = firebase.database();

var trainName = "";
var destination = "";
var frequency = "";
var firstTrain = "";
var timeUsed = "";
var timeNow = "";


$("#searchBtn").on("click", function() {


    //captures what is typed in form into a variable
	trainName = $("#trainName").val().trim();
	destination = $("#destination").val().trim();
	firstTrain = $("#firstTrain").val().trim();
	frequency = $("#frequency").val().trim();

    // First Train Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
        console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var train = moment(nextTrain).format("hh:mm")
        console.log("ARRIVAL TIME: " + train);

    //Pushing code into Database
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain.toString(),
        frequency: frequency.toString(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
        train: train.toString(),
        tMinutesTillTrain: tMinutesTillTrain.toString()
    });


    //clears form
    $("#trainName").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#firstTrain").val("");

    
	return false;

});



database.ref().on("child_added", function(childSnapshot) {

    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrain);
    console.log(childSnapshot.val().frequency);
    // console.log(childSnapshot.val().dateAdded);
    console.log(childSnapshot.val().tMinutesTillTrain);
    console.log(childSnapshot.val().nextTrain);

    $("#table").append("<tr> <td>" + childSnapshot.val().trainName + " </td> <td> " + childSnapshot.val().destination + "</td> <td>" + childSnapshot.val().frequency + " </td> <td>" + childSnapshot.val().train + "</td> <td> " + childSnapshot.val().tMinutesTillTrain + "</td> </tr>");

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });



//clears form when clean button is clicked
$("#clearBtn").on("click", function() {

    trainName = $("#trainName").val("");
    destination = $("#destination").val("");
    frequency = $("#frequency").val("");
    firstTrain = $("#firstTrain").val("");

    return false;

});



