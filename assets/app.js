console.log("connected!");

$("#stockSearch").on("click", function() {
    var search = $("input").val();
    var stockURL = "https://api.iextrading.com/1.0//stock/" + search + "/batch?types=quote,news,chart&range=1m&last=7";
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

    function UpdateChart(chart) {
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
        chart.data.labels = data.labels
        chart.data.datasets = data.datasets
        chart.update()
    }
    })
})

