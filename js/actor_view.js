var actor_view = new Vue({
    el: '#actor-view',
    data: {
        actor_data: {},
        actor_movies: [],
        actor_genre_rating: []
    },
    methods: {
        load_actor: function (actor_id) {
            console.log(actor_id);
            app.$emit('loading');
            $.when(
                callApi(api_get.actor.replace('__id__', actor_id)).done(function (data) {
                    this.actor_data = data;
                    console.log('actor_data', this.actor_data.fname);
                }.bind(this)),
                callApi(api_get.actor_movies.replace('__id__', actor_id)).done(function (data) {
                    this.actor_movies = data;
                    console.log('actor_movies', this.actor_movies);
                }.bind(this)),
                callApi(api_get.actor_genre_rating.replace('__id__', actor_id)).done(function (data) {
                    this.actor_genre_rating = data;
                    console.log('actor_genre_rating', this.actor_genre_rating);
                }.bind(this))
            ).then(
                function () {
                    app.$emit('done-loading');
                    app.$emit('actor-loaded');
                }
            )

        },
        // TODO add movie count as well
        average: function () {
            return this.actor_movies.reduce(function (total, movie) {
                    return total + movie.rating
                }, 0) / this.actor_movies.length;
        },
        top_billing_average: function (position) {
            var movies = this.actor_movies.filter(function (movie) {
                var billingPosition = Number(movie.billing_position);
                return billingPosition > 0 && billingPosition <= position;
            });
            console.log(movies);
            return movies.reduce(function (total, movie) {
                    return total + movie.rating
                }, 0) / movies.length;

        }
    }

});

app.$on('search_form-submit', function (data) {
    var actor = data.actor;
    console.log('data', data);
    actor_view.load_actor(actor.id);
});