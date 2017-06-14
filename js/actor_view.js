// TODO add sorting
var actor_view = new Vue({
    el: '#actor-view',
    data: {
        actor_data: {},
        actor_movies: [],
        actor_genre_rating: []
    },
    methods: {
        load_actor: function (actor_id) {
            app.$emit('loading');
            $.when(
                callApi(api_get.actor.replace('__id__', actor_id)).done(function (data) {
                    this.actor_data = data;
                }.bind(this)),
                callApi(api_get.actor_movies.replace('__id__', actor_id)).done(function (data) {
                    this.actor_movies = data;
                }.bind(this)),
                callApi(api_get.actor_genre_rating.replace('__id__', actor_id)).done(function (data) {
                    this.actor_genre_rating = data;
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
        average_by_votes: function () {

            var sum = 0, amount = 0;
            this.actor_movies.forEach(function (movie) {
                sum += movie.rating * movie.votes;
                amount += movie.votes;
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

app.$on('search_form-submit', function (data) {
    var actor = data.actor;
    actor_view.load_actor(actor.id);
});