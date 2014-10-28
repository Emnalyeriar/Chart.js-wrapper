(function(){

    function Chart(selector, url) {
        this.data = {};
        this.time = {};
        this.datasets = [];
        this.selector = selector

        this.selector = document.getElementById(selector);
        this.getData(url);
        this.createDatasets();
    }

    Chart.prototype.getData = function(url) {
        var chart = this;
        jQuery.ajax({
            url : url,
            dataType: 'json',
            async: false,
            success: function(returnedData) {
                jQuery.each(returnedData, function(index, element) {
                    jQuery.each(element, function(key, value) {
                        if (chart.data.hasOwnProperty(key) === false) {
                            chart.data[key] = [];
                        }
                        chart.data[key].push(value);
                    })
                });
            }
        });
    }

    Chart.prototype.createDatasets = function() {
        var chart = this;
        jQuery.each(chart.data, function(key, value) {
            chart.datasets.push({
                label: key,
                fillColor: "rgba(83, 83, 83, 0.2)",
                strokeColor: "rgb(114, 114, 114)",
                pointColor: "rgb(208, 208, 208)",
                pointStrokeColor: "#17222e",
                pointHighlightFill: "#000",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: (chart.arraySum(chart.data[key]) === 0) ? null : chart.data[key]
            })
        });
    }

    Chart.prototype.arraySum = function (array) {
        return array.reduce(function(a, b) {
            return parseInt(a)+parseInt(b);
        });
    }

    var chart = new Chart('paragon_chart', '');

})()
