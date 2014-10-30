(function(){

    function ChartInit(selector, url, options) {
        this.rawData = {};
        this.data = {};
        this.labels;
        this.datasets = [];
        this.parent = selector;
        this.canvas = this.parent.find('canvas').get(0).getContext('2d');
        this.colors = [
        {
            fillColor: "rgba(83, 83, 83, 0.2)",
            strokeColor: "rgb(114, 114, 114)",
            pointColor: "rgb(208, 208, 208)",
            pointStrokeColor: "#17222e",
            pointHighlightFill: "#000",
            pointHighlightStroke: "rgba(220,220,220,1)"
        },
        {
            fillColor: "rgba(236, 112, 112, 0.2)",
            strokeColor: "rgb(245, 98, 98)",
            pointColor: "rgb(246, 120, 120)",
            pointStrokeColor: "#530606",
            pointHighlightFill: "#940101",
            pointHighlightStroke: "rgb(242, 144, 144)"
        },
        {
            fillColor: "rgba(131, 239, 89, 0.2)",
            strokeColor: "rgb(55, 138, 0)",
            pointColor: "rgb(35, 233, 42)",
            pointStrokeColor: "#265205",
            pointHighlightFill: "#409400",
            pointHighlightStroke: "rgb(161, 245, 148)"
        },
        {
            fillColor: "rgba(227, 149, 24, 0.2)",
            strokeColor: "rgb(233, 223, 35)",
            pointColor: "rgb(199, 236, 36)",
            pointStrokeColor: "#a6b318",
            pointHighlightFill: "#c0c614",
            pointHighlightStroke: "rgb(233, 248, 150)"
        }];

        this.options = {
            scaleBeginAtZero: false,
            bezierCurve: true,
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
        if (this.parent.find('canvas').hasClass('line')) {
            this.drawLineChart(this.data);
            if (this.data.datasets.length > 1) {
                this.addFilters();
                this.addFiltersEvents();
            }
        }
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
        var index;
        jQuery.each(chart.rawData, function(key, value) {
            if (chart.arraySum(chart.rawData[key]) === 0) {
                return true;
            }
            chart.datasets.push({
                label: key.toUpperCase(),
                data: (chart.rawData[key].map(function(x) {
                    if (x>1000) {
                        return Math.trunc(x/1000);
                    } else {
                        return x;
                    }
                }))
            });
            index = chart.datasets.length-1;
            jQuery.extend(chart.datasets[index], chart.colors[index]);
        });
    }

    ChartInit.prototype.setLabels = function() {
        this.labels = this.rawData.date;
        delete this.rawData.date;
    }

    ChartInit.prototype.setData = function() {
        this.data = {
            'labels': this.labels,
            'datasets': this.datasets
        };
    }

    ChartInit.prototype.addFilters = function() {
        var chart = this;
        this.parent.prepend('<div class="chart-labels"></div>')
        this.labels = this.parent.find('.chart-labels');
        jQuery.each(this.datasets, function(key, value) {
            chart.labels.append('<label class="checkbox-inline"><input type="checkbox" checked="true" value="'+value.label+'">'+value.label+'</label>')
        });
    }

    ChartInit.prototype.addFiltersEvents = function() {
        var chart = this;
        this.allData = jQuery.extend(true, {}, this.data);
        this.labels.find('input').on('change', function() {
            var label = jQuery(this);
            if (label.prop('checked') === false) {
                jQuery.each(chart.data.datasets, function(key, value) {
                    if (value.label === label.val()) {
                        chart.data.datasets.splice(key, 1);
                        return false;
                    }
                });

            } else {
                jQuery.each(chart.allData.datasets, function(key, value) {
                    if (value.label === label.val()) {
                        chart.data.datasets.push(value);
                    }
                });
            }
            chart.chart.destroy();
            chart.drawLineChart(chart.data);
        })
    }

    ChartInit.prototype.drawLineChart = function(data) {
        this.chart = new Chart(this.canvas).Line(data, this.options);
    }

    ChartInit.prototype.arraySum = function (array) {
        return array.reduce(function(a, b) {
            return parseInt(a)+parseInt(b);
        });
    }

    jQuery('.chart').each(function() {
        var widget = jQuery(this);
        var url = widget.data('url');
        new ChartInit(widget, url);
    });

})()
