console.log("connected!");

//Tradier API Key 7CtiDC68QadwoeHJbLRmQu5l7qaE

$("#tradier").on("click", function() {
    $(".imgToggle").css("display", "none");
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

        var companyName = response.quote.companyName;
        var arr = [];
        var dateArr = [];
        
        for(var i = 0; i < response.chart.length; i++) {
            arr.push(response.chart[i].close);
            dateArr.push(response.chart[i].date);
            companyDates = $.makeArray(dateArr);
            companyData = $.makeArray(arr);
        }

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

        $(".container2").fadeIn();
        var newHeader = $("<h2>");
        newHeader.text("Latest " + companyName + " Headlines");
        $("#articleDiv").prepend(newHeader);

    
    $(function () {
        var ctx = $("#myChart");
        var myChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [] } });
        
        UpdateChart(myChart)
    });

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

//Menu Queries

$("#menuAmazon").on("click", function() {
    var stockURL = "https://api.iextrading.com/1.0//stock/AMZN/batch?types=quote,news,chart&range=1m&last=7";
    $(".imgToggle").css("display", "none");

    $.ajax({
        method: "GET",
        url: stockURL
    })

    .then(function(response) {
        console.log(response);

        var companyName = response.quote.companyName;
        var arr = [];
        var dateArr = [];
        for(var i = 0; i < response.chart.length; i++) {
            arr.push(response.chart[i].close);
            dateArr.push(response.chart[i].date);
            companyDates = $.makeArray(dateArr);
            companyData = $.makeArray(arr);
        }

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

        $(".container2").fadeIn();
        var newHeader = $("<h2>");
        newHeader.text("Latest " + companyName + " Headlines");
        $("#articleDiv").prepend(newHeader);

    
    $(function () {
        var ctx = $("#myChart");
        var myChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [] } });
        
        UpdateChart(myChart)
    });

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
    })
var query2 = "AAPL"
var stockURL;

$("#menuApple").on("click", function() {
    var stockURL = "https://api.iextrading.com/1.0//stock/" + query2 + "/batch?types=quote,news,chart&range=1m&last=7";
    batch();
})







//Test Function

function batch() {
    var stockURL;// = "https://api.iextrading.com/1.0//stock/" + query2 + "/batch?types=quote,news,chart&range=1m&last=7";
    $(".imgToggle").css("display", "none");

    $.ajax({
        method: "GET",
        url: stockURL
    })

    .then(function(response) {
        console.log(response);

        var companyName = response.quote.companyName;
        var arr = [];
        var dateArr = [];
        for(var i = 0; i < response.chart.length; i++) {
            arr.push(response.chart[i].close);
            dateArr.push(response.chart[i].date);
            companyDates = $.makeArray(dateArr);
            companyData = $.makeArray(arr);
        }

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

        $(".container2").fadeIn();
        var newHeader = $("<h2>");
        newHeader.text("Latest " + companyName + " Headlines");
        $("#articleDiv").prepend(newHeader);

    
    $(function () {
        var ctx = $("#myChart");
        var myChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [] } });
        
        UpdateChart(myChart)
    });

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
})

