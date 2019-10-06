Vue.component('actor-chart', {
    // language=HTML
    template: `
        <div class="actor-chart">
            <div hidden>
                <span v-for="movie in movies">{{movie}}</span>
            </div>
            <canvas ref="ctx" width="900" height="200"></canvas>
        </div>`,
    props: ['actorMovies'],
    mounted: function () {

    }, methods: {
        createLineChart: function () {
            let ctx = this.$refs['ctx'],
                options = {};
            console.log('this.chartData', this.chartData);
            var myLineChart = new Chart(ctx, {
                type: 'line',

                data: {
                    labels: this.years,
                    datasets: [
                        {
                            label: 'Ratings',
                            data: this.ratingData,
                            fill: false,
                            lineTension: 0,
                            borderColor: '#3e5869',
                            spanGaps: true
                        },
                        {
                            label: 'Movies Per Year',
                            data: this.amountPerYearData,
                            fill: false,
                            lineTension: 0,
                            borderColor: '#74e6c1',
                            spanGaps: true


                        }

                    ]

                },
                options: options
            });
        }
    },
    watch: {
        actorMovies: function () {
            this.createLineChart()
        }
    },
    computed: {
        chartData: function () {
            return this.movies.map(x => {
                return {x: x.rating, y: x.year}
            });
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
                minMax = this.actorMovies.reduce((acc, movie) => ({
                        min: Math.min(acc.min, movie.release_year),
                        max: Math.max(acc.max, movie.release_year)
                    }), {min: Number.POSITIVE_INFINITY, max: 0}
                );

            for (let movie of this.actorMovies) {
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
                        rating: years[i].reduce((acc, rating) => acc + rating, 0) / years[i].length
                    });
                }
            }

            results.sort((a, b) => a.year - b.year);

            return results
        },
        maxAmount: function () {
            return this.movies.reduce((acc, movie) =>
                Math.max(acc, movie.amount), 0
            )
        }
    }
});