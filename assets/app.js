console.log("connected!");

//Firebase user login Authentication
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

var mainApp = {};

(function() {
    //var firebase = app_fireBase;
    var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          uid = user.uid;
        } else {
            //Redirect to the login page.
            uid = null;
            window.location.replace("login.html");
        }
      });

    function logOut() {
        firebase.auth().signOut();
    }

    mainApp.logOut = logOut;
})()

//Tradier API Key 7CtiDC68QadwoeHJbLRmQu5l7qaE

//Global Chart variables so the .destroy() method works when calles
var ctx = $("#myChart");
myChart = new Chart(ctx, {});

//Global Chart data variables
var companyName;
var companySymbol;
var companyDates;
var companyData;

$("#tradier").on("click", function() {
    //Changes background from image to gradient
    $("body").css("background", "linear-gradient(to right, #e0eafc, #cfdef3)");
    //Empties div displaying quote information from old search
    $("#latestQuote").empty();
    //Destroys chart data from old chart so it doesnt repopulate when chart us hovered over
    myChart.destroy();
    
    var companySearch = $("#companySearch").val();
    var tradierURL = "https://sandbox.tradier.com/v1/markets/search?q=" + companySearch;
    
    //Goes first to the Tradier API to match a company name to a stock symbol
    $.ajax({
        method: "GET",
        url: tradierURL,
        headers: {
            'Authorization' : 'Bearer 7CtiDC68QadwoeHJbLRmQu5l7qaE',
            'Accept' : 'application/json'
        }
    })

    .then(function(response) {
        console.log(response);
        console.log(response.securities.security.symbol);
        var companySymbol = response.securities.security.symbol;
        //If the search brings back many matches, it takes the first company and stores it in the variable
        if(companySymbol == null) {
            companySymbol = response.securities.security[0].symbol;
        }
    
        //Takes the companySymbol variable and includes it in the search to the IEX API to search for charts and news on the company    
        var stockURL = "https://api.iextrading.com/1.0//stock/" + companySymbol + "/batch?types=quote,news,chart&range=1m&last=7";
            $.ajax({
            method: "GET",
            url: stockURL
        })

        .then(function(response) {
            console.log(response);
            console.log(response.quote.latestPrice);

            var companyName = response.quote.companyName;
            var arr = [];
            var dateArr = [];

            //Change h1 to company name of chart being displayed and empty the search input field
            $("h1").text(companyName);
            $("#companySearch").val("");
            //Creates an array that stores price data and one that stores the dates.
            for(var i = 0; i < response.chart.length; i++) {
                arr.push(response.chart[i].close);
                dateArr.push(response.chart[i].date);
                companyDates = $.makeArray(dateArr);
                companyData = $.makeArray(arr);
            }
            //Grabs the latest news articles and writes them to the div and displays on the page
            for(var i = 0; i <response.news.length; i++) {
                var articleHeadline = response.news[i].headline;
                var articleURL = response.news[i].url;
                var newDiv = $("<div>");
                newDiv.attr("id", "articleDiv");
                var newHeadline = $("<a>");
                newHeadline.attr("href", articleURL);
                newHeadline.attr("target", "_blank");
                newHeadline.text(articleHeadline);
                $(".container2").prepend(newDiv);
                $("#articleDiv").prepend(newHeadline);
            }
            //Compiling Data for the Latest Quote Div and appending it to the page
            $("#latestQuote").fadeIn();
            $("#latestQuote").css("display", "inline-block");
            var quoteHeader = $("<h2>");
            quoteHeader.text("Up to the Minute Quote...");
            $("#latestQuote").prepend(quoteHeader);
            //Lists the exchange the stock is listed in
            var marketHeader = $("<h3>");
            marketHeader.text("Market: " + response.quote.primaryExchange);
            $("#latestQuote").append(marketHeader);
            //Lists the last time the stock price was updated
            var timeHeader = $("<h3>");
            timeHeader.text("Time: " + response.quote.latestTime);
            $("#latestQuote").append(timeHeader)
            //Lists the latest price of the stock
            var priceHeader = $("<h3>");
            priceHeader.attr("id", "price");
            priceHeader.text("Latest Price: " + response.quote.latestPrice);
            $("#latestQuote").append(priceHeader);
            //Lists the 52 week high of the stock price
            var highHeader = $("<h3>");
            highHeader.text("52 Week High: " + response.quote.week52High);
            $("#latestQuote").append(highHeader);
            //Lists the 52 week low of the stock price
            var lowHeader = $("<h3>");
            lowHeader.attr("id", "low");
            lowHeader.text("52 Week Low: " + response.quote.week52Low);
            $("#latestQuote").append(lowHeader);

            //Making the News Articles Div appear on the page and prepending a header
            $(".container2").fadeIn();
            $(".container2").css("display", "inline-block");
            var newHeader = $("<h2>");
            newHeader.text("Latest " + companyName + " Headlines");
            $("#articleDiv").prepend(newHeader);

            //Styling the footer to appear on the page
            $("footer").fadeIn();

            //Function that creates chart
            $(function () {
                var ctx = $("#myChart");
                myChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [] } });
                UpdateChart(myChart)
            });

            //Function that populates chart with search data
            function UpdateChart(myChart) {
                
                var data =  {
                            labels: companyDates,
                            datasets: [{
                                label: companyName,
                                data: companyData,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255,99,132,1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                }
                myChart.data.labels = data.labels
                myChart.data.datasets = data.datasets
                myChart.update()
            }
        })
    })
    .fail(function() {
        $(".modal").css("display", "block");
        $(".closeBtn").on("click", function() {
            $(".modal").css("display", "none");
        })
    })
})

//Search Query via the dropdown menu on page
$("#menuAmazon").on("click", function() {
    companySymbol = "AMZN";
    setSearch();
})
$("#menuApple").on("click", function() {
    companySymbol = "AAPL";
    setSearch();
})
$("#menuFacebook").on("click", function() {
    companySymbol = "FB";
    setSearch();
})
$("#menuGoogle").on("click", function() {
    companySymbol = "GOOGL";
    setSearch();
})
$("#menuMicrosoft").on("click", function() {
    companySymbol = "MSFT";
    setSearch();
})
$("#menuSpotify").on("click", function() {
    companySymbol = "SPOT";
    setSearch();
})
$("#menuTwitter").on("click", function() {
    companySymbol = "TWTR";
    setSearch();
})

//Function to make API calls from clicking company from dropdown button
function setSearch() {
    //Changes background from image to gradient
    $("body").css("background", "linear-gradient(to right, #e0eafc, #cfdef3)");
    //Empties div displaying quote information from old search
    $("#latestQuote").empty();
    //Destroys chart data from old chart so it doesnt repopulate when chart us hovered over
    myChart.destroy();
    var stockURL = "https://api.iextrading.com/1.0//stock/" + companySymbol + "/batch?types=quote,news,chart&range=1m&last=7";
            $.ajax({
            method: "GET",
            url: stockURL
        })
    .then(function(response) {
        console.log(response);
        console.log(response.quote.latestPrice);

        var companyName = response.quote.companyName;
        var arr = [];
        var dateArr = [];

        //Change h1 to company name of chart being displayed and empty the search input field
        $("h1").text(companyName);
        $("#companySearch").val("");
        //Creates an array that stores price data and one that stores the dates.
        for(var i = 0; i < response.chart.length; i++) {
            arr.push(response.chart[i].close);
            dateArr.push(response.chart[i].date);
            companyDates = $.makeArray(dateArr);
            companyData = $.makeArray(arr);
        }
        //Grabs the latest news articles and writes them to the div and displays on the page
        for(var i = 0; i <response.news.length; i++) {
            var articleHeadline = response.news[i].headline;
            var articleURL = response.news[i].url;
            var newDiv = $("<div>");
            newDiv.attr("id", "articleDiv");
            var newHeadline = $("<a>");
            newHeadline.attr("href", articleURL);
            newHeadline.attr("target", "_blank");
            newHeadline.text(articleHeadline);
            $(".container2").prepend(newDiv);
            $("#articleDiv").prepend(newHeadline);
        }
        //Compiling Data for the Latest Quote Div and appending it to the page
        $("#latestQuote").fadeIn();
        $("#latestQuote").css("display", "inline-block");
        var quoteHeader = $("<h2>");
        quoteHeader.text("Up to the Minute Quote...");
        $("#latestQuote").prepend(quoteHeader);
        //Lists the exchange the stock is listed in
        var marketHeader = $("<h3>");
        marketHeader.text("Market: " + response.quote.primaryExchange);
        $("#latestQuote").append(marketHeader);
        //Lists the last time the stock price was updated
        var timeHeader = $("<h3>");
        timeHeader.text("Time: " + response.quote.latestTime);
        $("#latestQuote").append(timeHeader)
        //Lists the latest price of the stock
        var priceHeader = $("<h3>");
        priceHeader.attr("id", "price");
        priceHeader.text("Latest Price: " + response.quote.latestPrice);
        $("#latestQuote").append(priceHeader);
        //Lists the 52 week high of the stock price
        var highHeader = $("<h3>");
        highHeader.text("52 Week High: " + response.quote.week52High);
        $("#latestQuote").append(highHeader);
        //Lists the 52 week low of the stock price
        var lowHeader = $("<h3>");
        lowHeader.attr("id", "low");
        lowHeader.text("52 Week Low: " + response.quote.week52Low);
        $("#latestQuote").append(lowHeader);

        //Making the News Articles Div appear on the page and prepending a header
        $(".container2").fadeIn();
        $(".container2").css("display", "inline-block");
        var newHeader = $("<h2>");
        newHeader.text("Latest " + companyName + " Headlines");
        $("#articleDiv").prepend(newHeader);

        //Styling the footer to appear on the page
        $("footer").fadeIn();

        //Function that creates chart
        $(function () {
            var ctx = $("#myChart");
            myChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [] } });
            UpdateChart(myChart)
        });

        //Function that populates chart with search data
        function UpdateChart(myChart) {
            
            var data =  {
                        labels: companyDates,
                        datasets: [{
                            label: companyName,
                            data: companyData,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
            }
            myChart.data.labels = data.labels
            myChart.data.datasets = data.datasets
            myChart.update()
        }
    })
}