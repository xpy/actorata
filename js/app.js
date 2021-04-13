class Api {
    root = null;
    endPoints = {
        person_list: 'person/popular',
        person: 'person/__id__',
        person_movies: 'person/__id__/movie_credits',
        movie_genres: 'genre/movie/list',
        person_genre_rating: 'person/__id__/genre_rating',
        search_person: 'search/person'
    };

    constructor(url) {
        this.root = url
    }

    callApi(url, query_params) {
        url = new URL(this.root + url);
        for (let q in query_params || {}) {
            url.searchParams.set(q, query_params[q]);
        }
        return fetch(url, {
            mode: 'cors'
        }).then(response => response.json())
    }

    getPerson(id) {
        return this.callApi(this.endPoints.person.replace('__id__', id))
    }

    getPersonMovies(id) {
        return this.callApi(this.endPoints.person_movies.replace('__id__', id))
    }

    getGenres() {
        return this.callApi(this.endPoints.movie_genres)
    }

    searchPeople(searchString) {
        return this.callApi(this.endPoints.search_person, {query: searchString})
    }
}

let api = new Api('https://pe2cfd0whb.execute-api.us-west-2.amazonaws.com/');
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
            'is-not-loaded': true,
            'is-loading': false,
            'is-loaded': false
        }
    },
    created: function () {
        this.$bus.$on('loading', function () {
            this.contentClasses['is-loading'] = true;
        }.bind(this));
        this.$bus.$on('done-loading', function () {
            this.contentClasses['is-loading'] = false;
        }.bind(this));
        this.$bus.$on('person-loaded', function (data) {
            this.contentClasses['is-not-loaded'] = false;
            this.contentClasses['is-loaded'] = true;
            this.changeHash(data);
        }.bind(this));

    }, methods: {
        getHashName: function (name) {
            return name.replace(' ', '-');
        },
        changeHash: function (data) {
            window.location.hash = this.getHashName(data.name);
        },
    }
});