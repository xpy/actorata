define(['Vue', 'Chart'], function (Vue, Chart) {
    Vue.component('genre-chart', {
        template: `
            <div class="genre-chart">
                <div hidden>
                    <span v-for="row in initialChartData">{{row}}</span>
                </div>
                <canvas ref="ctx"></canvas>
            </div>`,
        props: ['initialChartData'],
        data: function () {
            return {
                chart: null
            }
        },
        mounted: function () {

        }, methods: {
            createChart: function () {
                if (this.chart) {
                    this.chart.destroy()
                }
                let ctx = this.$refs['ctx'];
                this.chart = new Chart(ctx, this.chartConfig);
            }
        },
        watch: {
            initialChartData: function () {
                this.createChart()
            }
        },
        computed: {
            chartConfig: function () {
                console.log(this.ratingData);

                return {
                    type: 'polarArea',
                    data: {
                        labels: this.labels,
                        datasets: [
                            // {
                            //     label: 'Number of movies',
                            //     data: this.ratingData,
                            //     backgroundColor: 'rgba(62,88,105,0.51)',
                            //     lineTension: 0,
                            //     borderColor: false,
                            //     spanGaps: true
                            // },
                            {
                                label: 'Average rating',
                                data: this.genresPerYear,
                                backgroundColor: ['#003f5c', '#3e5869', '#365f72', '#296679', '#156d7e', '#007481', '#007b82', '#008280', '#00897c', '#008f76', '#00956e', '#1e9b64', '#3ca058', '#54a44c', '#6ba83e', '#82ab2f', '#99ac1e', '#b2ad07', '#cbac00', '#e5aa00', '#ffa600'],
                                lineTension: 0,
                                // borderColor: false,
                                spanGaps: true
                            }
                        ]
                    },
                    options: {
                        maintainAspectRatio: false,
                        elements: {
                            arc: {
                                angle: this.ratingData
                            }
                        },
                        legend: {
                            position: 'right',
                        },
                    }
                };
            },

            chartData: function () {
                return Object.values(this.initialChartData).sort((a, b) => {
                    return b.filmCount - a.filmCount
                });
            },
            ratingData: function () {
                let genreData = this.chartData.map(x => x.filmCount),
                    sum = genreData.reduce((a, b) => a + b, 0);
                return genreData.map(x => (x / sum) * Math.PI * 2)
            },
            labels: function () {
                return this.chartData.map(x => x.name);
            },
            genresPerYear: function () {
                return this.chartData.map(x => x.rating.toFixed(1));
            }
        }
    });
})

function* makeRangeIterator() {
    let nextIndex = 0;
    let iterationCount = 0;
    let colors = ['red', 'blue'];
    while (true) {
        nextIndex += 1;
        iterationCount++;
        yield colors[nextIndex % colors.length];
    }
}