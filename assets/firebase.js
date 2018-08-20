var app_firebase = {};

(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC4FnvjiTE7vANDTnOJCii_iYQShe505dI",
    authDomain: "stock-charts-91d00.firebaseapp.com",
    databaseURL: "https://stock-charts-91d00.firebaseio.com",
    projectId: "stock-charts-91d00",
    storageBucket: "",
    messagingSenderId: "1048504771299"
  };
  firebase.initializeApp(config);

  app_firebase = firebase;

})()

