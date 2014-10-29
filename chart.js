(function(){

    function ChartInit(selector, url, options) {
        this.rawData = {};
        this.data = {};
        this.labels;
        this.datasets = [];
        this.selector = selector;
        this.options = {
            scaleBeginAtZero: false,
            bezierCurve: false,
            responsive: true,
            scaleBackdropPaddingY: 25,
            scaleBackdropPaddingX: 25,
            multiTooltipTemplate: "<%= datasetLabel %>: <%= value %>"
        };

        jQuery.extend(this.options, options);

        this.getData(url);
        this.setLabels();
        this.createDatasets();
        this.setData();
        this.drawChart();
    }

    ChartInit.prototype.getData = function(url) {
        var chart = this;
        jQuery.ajax({
            url : url,
            dataType: 'json',
            async: false,
            success: function(returnedData) {
                jQuery.each(returnedData, function(index, element) {
                    jQuery.each(element, function(key, value) {
                        if (chart.rawData.hasOwnProperty(key) === false) {
                            chart.rawData[key] = [];
                        }
                        chart.rawData[key].push(value);
                    })
                });
            }
        });
    }

    ChartInit.prototype.createDatasets = function() {
        var chart = this;
        jQuery.each(chart.rawData, function(key, value) {
            chart.datasets.push({
                label: key.replace('paragons', ''),
                fillColor: "rgba(83, 83, 83, 0.2)",
                strokeColor: "rgb(114, 114, 114)",
                pointColor: "rgb(208, 208, 208)",
                pointStrokeColor: "#17222e",
                pointHighlightFill: "#000",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: (chart.arraySum(chart.rawData[key]) === 0) ? null : chart.rawData[key]
            })
        });
    }

    ChartInit.prototype.setLabels = function() {
        this.labels = this.rawData.date;
        delete this.rawData.date
    }

    ChartInit.prototype.setData = function() {
        this.data = {
            'labels': this.labels,
            'datasets': this.datasets
        };
    }

    ChartInit.prototype.drawChart = function() {
        this.selector = document.getElementById(this.selector).getContext('2d');
        new Chart(this.selector).Line(this.data, this.options);
    }

    ChartInit.prototype.arraySum = function (array) {
        return array.reduce(function(a, b) {
            return parseInt(a)+parseInt(b);
        });
    }


    //var chart = new ChartInit('', '');

})()
