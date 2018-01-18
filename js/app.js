// var api_root = 'https://actorata-xpy.rhcloud.com/api/';
var api_root = 'http://actorata-ms-actorata-ms.193b.starter-ca-central-1.openshiftapps.com/api/';

var api_get = {
    actor_list: 'actor/list',
    actor: 'actor/__id__',
    actor_movies: 'actor/__id__/movies',
    actor_genre_rating: 'actor/__id__/genre_rating'
};

var callApi = function (url) {
    return $.ajax({
        crossDomain: true,
        dataType: 'json',
        url: api_root + url
    })
};

var $content = $('.content');
Vue.filter('round', function (value, decimals) {
    return Number(value).toFixed(decimals);
});

let app = new Vue({
    el: '#app',
    created: function () {
        this.$on('loading', function () {
            $content.addClass('is-loading');
        });
        this.$on('done-loading', function () {
            $content.removeClass('is-loading');
        });
        this.$on('actor-loaded', function () {
            $content.removeClass('is-not-actor-loaded');
            $content.addClass('is-actor-loaded');
            this.changeHash(actor_view.actor_data);
        });

    }, methods: {
        getActorHashName: function (actor) {
            return actor.fname + '-' + actor.lname;
        },
        changeHash: function (actor) {
            window.location.hash = this.getActorHashName(actor);
        },
        getFromHash: function () {
            let hash = window.location.hash.replace('#', '');
            for (let actor of search_field.actor_list) {
                if (hash === this.getActorHashName(actor)) {
                    return actor;
                } else if (hash === String(actor.id)) {
                    this.changeHash(actor);
                    return actor;
                }
            }
            return null;
        }
    }
});
