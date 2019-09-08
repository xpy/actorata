let api = {
    root: 'https://api.themoviedb.org/3/',
    endPoints: {
        actor_list: 'person/popular',
        actor: 'person/__id__',
        actor_movies: 'person/__id__/movie_credits',
        movie_genres: 'genre/movie/list',
        actor_genre_rating: 'actor/__id__/genre_rating',
        search_person: 'search/person'
    },
    callApi: function (url, query_params) {
        url += '?api_key=b0e628aceae4399d1032199a4bfb5894';
        query_params = query_params || {};
        for (let q in query_params) {
            url += `&${q}=${query_params[q]}`
        }
        return fetch(this.root + url, {
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => response.json())
    },
    getActor: function (actorId) {
        return this.callApi(this.endPoints.actor.replace('__id__', actorId))
    },
    getActorMovies: function (actorId) {
        return this.callApi(this.endPoints.actor_movies.replace('__id__', actorId))
    },
    getGenres: function () {
        return this.callApi(this.endPoints.movie_genres)
    },
    searchPeople: function (searchString) {
        return this.callApi(this.endPoints.search_person, {query: searchString})
    }
};

Vue.prototype.$bus = new Vue({});

Vue.filter('round', function (value, decimals) {
    return Number(value).toFixed(decimals);
});

let app = new Vue({
    el: '#app',
    data: {
        contentClasses: new Set(['skata'])
    },
    created: function () {
        this.$bus.$on('loading', function () {
            this.contentClasses.add('is-loading');
        }.bind(this));
        this.$bus.$on('done-loading', function () {
            this.contentClasses.delete('is-loading');
        }.bind(this));
        this.$bus.$on('actor-loaded', function (actor_data) {
            this.contentClasses.add('is-not-actor-loaded');
            this.contentClasses.add('is-actor-loaded');
            this.changeHash(actor_data);
        }.bind(this));

    }, methods: {
        getActorHashName: function (actor) {
            return actor.name.replace(' ', '-');
        },
        changeHash: function (actor) {
            window.location.hash = this.getActorHashName(actor);
        },
    }
});