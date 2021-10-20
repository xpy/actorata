define(function () {
    class Api {
        root = null;
        imageRootPath = 'https://image.tmdb.org/t/p/w500/';
        endPoints = {
            person_list: 'person/popular',
            person: 'person/__id__',
            person_movies: 'person/__id__/movie_credits',
            person_images: 'person/__id__/images',
            movie_genres: 'genre/movie/list',
            person_genre_rating: 'person/__id__/genre_rating',
            search_person: 'search/person'
        };

        constructor(url) {
            this.root = url
        }

        callApi(url, query_params) {
            const newUrl = new URL(this.root);
            newUrl.pathname += url;
            for (let q in query_params || {}) {
                newUrl.searchParams.set(q, query_params[q]);
            }
            return fetch(newUrl, {
                mode: 'cors'
            }).then(response => response.json())
        }

        getPerson(id) {
            return this.callApi(this.endPoints.person.replace('__id__', id));
        }

        async getImages(id) {
            let images = await this.callApi(this.endPoints.person_images.replace('__id__', id));
            return await images.profiles.map(image => this.imageRootPath + image.file_path)
        }

        getPersonMovies(id) {
            return this.callApi(this.endPoints.person_movies.replace('__id__', id));
        }

        getGenres() {
            return this.callApi(this.endPoints.movie_genres);
        }

        searchPeople(searchString, page = 1) {
            return this.callApi(this.endPoints.search_person, {query: searchString, page: page});
        }
    }

    return Api

})
