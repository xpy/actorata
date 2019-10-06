Vue.component('actor-view', {
    data: function () {
        return {
            actor_data: {},
            actor_movies: [],
            actor_genre_rating: [],
            current_sorting_key: null,
            current_sorting_order: null
        }
    },
    mounted: function () {
        this.$bus.$on('search_form-submit', function (data) {
            var actor = data.actor;
            this.load_actor(actor.id);
        }.bind(this));
    },
    methods: {
        load_actor: function (actor_id) {
            this.$bus.$emit('loading');
            Promise.all([
                api.getActor(actor_id).then(data => {
                    this.actor_data = data;
                }),
                api.getGenres().then(data => {
                    this.genres = {};
                    for (let genre of data.genres) {
                        this.genres[genre.id] = genre.name;
                    }
                }),
                api.getActorMovies(actor_id).then(data => {
                    let today = new Date();
                    this.actor_movies = data.cast.filter(x =>
                        x.character
                        && !['himself', 'self', 'herself'].includes(x.character.toLowerCase())
                        && new Date(x.release_date) < today);
                    console.log(this.actor_movies);
                    for (let movie of this.actor_movies) {
                        movie['release_year'] = (movie.release_date || '').split('-')[0]
                    }
                }),
                // callApi(api_get.actor_genre_rating.replace('__id__', actor_id)).done(function (data) {
                //     this.actor_genre_rating = data;
                // }.bind(this))
            ]).then(
                function () {
                    this.calcGenres();
                    this.$bus.$emit('done-loading');
                    this.$bus.$emit('actor-loaded', this.actor_data);
                }.bind(this)
            )

        },
        calcGenres: function () {
            let genres = {};
            for (let movie of this.actor_movies) {
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

            this.actor_genre_rating = genres;
            console.log(genres)
        },
        // TODO add movie count as well
        average: function () {
            return this.actor_movies.reduce(function (total, movie) {
                return total + movie.vote_average
            }, 0) / this.actor_movies.length;
        },
        movie_count_by_bp: function (bp) {
            return this.actor_movies.filter((x) => Number(x.billing_position) <= bp).length
        },
        sort_movies: function (key) {
            if (['original_title', 'vote_count', 'release_year', 'character', 'billing_position', 'vote_average'].indexOf(key) >= 0) {
                var self = this;
                if (key === this.current_sorting_key) {
                    this.current_sorting_order *= -1;
                } else {
                    this.current_sorting_key = key;
                    this.current_sorting_order = 1;
                }
                this.actor_movies = this.actor_movies.sort(function (a, b) {
                    return (a[key] > b[key] ? 1 : -1) * self.current_sorting_order;
                })
            }
        },
        get_sorting_classes: function (key) {
            var sorting = this.current_sorting_order > 0 ? 'is-sorted_asc' : 'is-sorted_desc';
            return key === this.current_sorting_key ? 'is-active ' + sorting : ''
        },
        average_by_votes: function () {

            var sum = 0, amount = 0;
            this.actor_movies.forEach(function (movie) {
                sum += movie.vote_average * movie.vote_count;
                amount += movie.vote_count;
            });
            return sum / amount;
        },
        top_billing_average: function (position) {
            var movies = this.actor_movies.filter(function (movie) {
                var billingPosition = Number(movie.billing_position);
                return billingPosition > 0 && billingPosition <= position;
            });
            return movies.reduce(function (total, movie) {
                return total + movie.rating
            }, 0) / movies.length;
        }
    }

});

