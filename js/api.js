define(function () {
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

    return Api

})
