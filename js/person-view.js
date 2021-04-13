define(['Vue'], function (Vue) {
    Vue.component('person-view', {
        data: function () {
            return {
                loaded: false,
                data: {},
                movies: [],
                genre_rating: [],
                current_sorting_key: null,
                current_sorting_order: null,
                sorting: {
                    'title': {defaultSorting: 'asc'},
                    'vote_count': {defaultSorting: 'desc'},
                    'release_year': {defaultSorting: 'desc'},
                    'character': {defaultSorting: 'asc'},
                    'billing_position': {defaultSorting: 'asc'},
                    'vote_average': {defaultSorting: 'desc'}
                }
            }
        },
        mounted: function () {
            this.$bus.$on('search_form-submit', function (data) {
                this.load(data.id);
            }.bind(this));
        },
        methods: {
            load: function (id) {
                this.$bus.$emit('loading');
                Promise.all([
                    this.$api.getPerson(id).then(data => {
                        this.data = data;
                    }),
                    this.$api.getGenres().then(data => {
                        this.genres = {};
                        for (let genre of data.genres) {
                            this.genres[genre.id] = genre.name;
                        }
                    }).then(
                        function () {
                            return this.$api.getPersonMovies(id)
                        }.bind(this)
                    ).then(data => {
                        let today = new Date(),
                            themSelves = new RegExp(/\b(himself|self|herself|voice)\b/),
                            genres = this.genres;
                        this.movies = data.cast.filter(x =>
                            x.character
                            && !x.genre_ids.includes(99)
                            && x.genre_ids.length > 0
                            && !themSelves.exec(x.character.toLowerCase())
                            && x.vote_count > 1
                            && new Date(x.release_date) < today);
                        for (let movie of this.movies) {
                            movie.release_year = (movie.release_date || '').split('-')[0];
                            movie.genres = movie.genre_ids.map(x => genres[x])
                        }
                    }),

                ]).then(
                    function () {
                        this.calcGenres();
                        this.$bus.$emit('done-loading');
                        this.$bus.$emit('person-loaded', this.data);
                        this.loaded = true;
                    }.bind(this)
                )

            },
            calcGenres: function () {
                let genres = {};
                for (let movie of this.movies) {
                    for (let genreId of movie.genre_ids) {
                        genres[genreId] = genres[genreId] || [];
                        genres[genreId].push({voteAverage: movie.vote_average, voteCount: movie.vote_count})
                    }
                }
                for (let genre in genres) {
                    genres[genre] = {
                        name: this.genres[genre],
                        rating: genres[genre].reduce((a, b) => a + b.voteAverage, 0) / genres[genre].length,
                        filmCount: genres[genre].length
                    }
                }

                this.genre_rating = genres;
            },
            // TODO add movie count as well
            average: function () {
                return this.movies.reduce(function (total, movie) {
                    return total + movie.vote_average
                }, 0) / this.movies.length;
            },
            movie_count_by_bp: function (bp) {
                return this.movies.filter((x) => Number(x.billing_position) <= bp).length
            },
            sort_movies: function (key) {
                if (key in this.sorting) {
                    if (key === this.current_sorting_key) {
                        this.current_sorting_order *= -1;
                    } else {
                        this.current_sorting_key = key;
                        this.current_sorting_order = this.sorting[key].defaultSorting === 'asc' ? 1 : -1;
                    }
                }
            },
            get_sorting_classes: function (key) {
                var sorting = this.current_sorting_order > 0 ? 'is-sorted_asc' : 'is-sorted_desc';
                return key === this.current_sorting_key ? 'is-active ' + sorting : ''
            },
            average_by_votes: function () {
                var sum = 0, amount = 0;
                this.movies.forEach(function (movie) {
                    sum += movie.vote_average * movie.vote_count;
                    amount += movie.vote_count;
                });
                return sum / amount;
            },
            top_billing_average: function (position) {
                var movies = this.movies.filter(function (movie) {
                    var billingPosition = Number(movie.billing_position);
                    return billingPosition > 0 && billingPosition <= position;
                });
                return movies.reduce(function (total, movie) {
                    return total + movie.rating
                }, 0) / movies.length;
            },
        },
        computed: {
            sortedMovies: function () {
                var self = this;
                return this.movies.concat().sort(function (a, b) {
                    return (a[self.current_sorting_key] > b[self.current_sorting_key] ? 1 : -1) * self.current_sorting_order;
                })
            }
        }
    });
})

