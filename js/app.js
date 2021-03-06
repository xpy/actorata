let api = {
    root: 'https://pe2cfd0whb.execute-api.us-west-2.amazonaws.com/',
    endPoints: {
        actor_list: 'person/popular',
        actor: 'person/__id__',
        actor_movies: 'person/__id__/movie_credits',
        movie_genres: 'genre/movie/list',
        actor_genre_rating: 'actor/__id__/genre_rating',
        search_person: 'search/person'
    },
    callApi: function (url, query_params) {
        query_params = query_params || {};
        let urlParams = new URLSearchParams();
        for (let q in query_params) {
            urlParams.set(q, query_params[q]);
        }
        if (query_params) {
            url += '?' + urlParams;
        }
        return fetch(this.root + url, {
            mode: 'cors'
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
        return this.callApi(this.endPoints.search_person, { query: searchString })
    }
};

Vue.prototype.$bus = new Vue({});

Vue.filter('round', function (value, decimals) {
    return Number(value).toFixed(decimals);
});

Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
});

let app = new Vue({
    el: '#app',
    data: {
        contentClasses: {
            'is-not-actor-loaded': true,
            'is-loading': false,
            'is-actor-loaded': false
        }
    },
    created: function () {
        this.$bus.$on('loading', function () {
            this.contentClasses['is-loading'] = true;
        }.bind(this));
        this.$bus.$on('done-loading', function () {
            this.contentClasses['is-loading'] = false;
        }.bind(this));
        this.$bus.$on('actor-loaded', function (actor_data) {
            this.contentClasses['is-not-actor-loaded'] = false;
            this.contentClasses['is-actor-loaded'] = true;
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