var api_root = 'http://actorata-xpy.rhcloud.com/api/';

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

var app = new Vue({
    el: '#app',
    created: function () {
        this.$on('loading', function (data) {
            $content.addClass('is-loading');
        });
        this.$on('done-loading', function (data) {
            $content.removeClass('is-loading');
        });
        this.$on('actor-loaded',function (data) {
            $content.removeClass('is-not-actor-loaded');
            $content.addClass('is-actor-loaded');
        })
    }
});