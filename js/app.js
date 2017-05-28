var api_root = 'http://dellicius:5000/api/';
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


var app = new Vue({
    el: '#app',
    created: function () {
        this.$on('search_form-submit', function (data) {

        });
    }
});