Vue.component('actor-chart', {
    // language=HTML
    template: `
        <div class="actor-chart">
            <div hidden>
                <span v-for="movie in movies">{{movie}}</span>
            </div>

            <svg viewBox="0 0 100 20">
                <g transform="translate(0 0)">
                    <text v-for="index in maxAmount" class="small" v-bind:y="(maxAmount - index)*13/maxAmount">{{index}}
                    </text>
                </g>
                <g transform="translate(95 0)">
                    <text v-for="index in 12" 
                          text-anchor="middle"
                          class="small" v-bind:y="(10 - (index-2))*13/10">{{index-1}}</text>
                </g>
                <g transform="translate(5 0)">
                    <g v-for="(movie,index) in movies"
                       v-bind:transform="'translate('+ (((index)*90)/(movies.length-1)) + ' 0)'">
                        <circle v-if="movie.amount"
                                v-bind:cy="(10 - movie.rating)*13/10" r=".5">
                        </circle>
                        <circle v-if="movie.amount"
                                fill="green"
                                v-bind:cy="(maxAmount - movie.amount)*13/maxAmount" r=".25">
                        </circle>
                        <text text-anchor="middle"
                              y="15" class="small">{{String(movie.year).slice(-2)}}
                        </text>
                        <line y1="0" y2="13" stroke="rgba(0,0,0,0.125)" stroke-width=".125%"/>
                    </g>
                </g>
            </svg>
        </div>`,
    props: ['actorMovies'],
    computed: {
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
                        amount: 0,
                        rating: 0
                    })
                } else {
                    results.push({
                        year: i,
                        amount: years[i].length,
                        rating: years[i].reduce((acc, rating) => acc + rating, 0) / years[i].length
                    });
                }
            }

            results.sort((a, b) => {
                a.year - b.year
            });

            return results
        },
        maxAmount: function () {
            return this.movies.reduce((acc, movie) =>
                Math.max(acc, movie.amount), 0
            )
        }
    }
});