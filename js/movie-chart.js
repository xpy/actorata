Vue.component('movie-chart', {
    // language=HTML
    template: `
        <div class="movie-chart">
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
            return {
                type: 'line',
                data: {
                    labels: this.years,
                    datasets: [
                        {
                            label: 'Ratings',
                            data: this.ratingData,
                            fill: false,
                            lineTension: 0,
                            borderColor: this.$cssProperties.get('font-color'),
                            spanGaps: true
                        },
                        {
                            label: 'Movies Per Year',
                            data: this.amountPerYearData,
                            fill: false,
                            lineTension: 0,
                            borderColor: this.$cssProperties.get('main-color'),
                            spanGaps: true
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                }
            }
        },
        chartData: function () {
            return Object.values(this.initialChartData);
        },
        amountPerYearData: function () {
            return this.movies.map(x => x.amount)
        },
        ratingData: function () {
            return this.movies.map(x => x.rating)
        },
        years: function () {
            return Array.from(new Set(this.movies.map(x => x.year))).sort()
        },
        movies: function () {
            let years = {},
                results = [],
                minMax = this.chartData.reduce((acc, movie) => ({
                        min: Math.min(acc.min, movie.release_year),
                        max: Math.max(acc.max, movie.release_year)
                    }), {min: Number.POSITIVE_INFINITY, max: 0}
                );

            for (let movie of this.chartData) {
                if (!years[movie.release_year]) {
                    years[movie.release_year] = [];
                }
                years[movie.release_year].push(movie.vote_average)
            }
            for (let i = minMax.min; i <= minMax.max; i++) {
                if (!years[i]) {
                    results.push({
                        year: i,
                        amount: null,
                        rating: null
                    })
                } else {
                    results.push({
                        year: i,
                        amount: years[i].length,
                        rating: (years[i].reduce((acc, rating) => acc + rating, 0) / years[i].length).toFixed(1)
                    });
                }
            }

            results.sort((a, b) => a.year - b.year);
            return results
        }
    }
});