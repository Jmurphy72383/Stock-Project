console.log("connected!");

$("button").on("click", function() {

    var stockURL = "https://api.iextrading.com/1.0//stock/msft/batch?types=quote,news,chart&range=1m&last=7";

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

