define(['base-api'], function (BaseApi) {
    class Api extends BaseApi {
        searchPeople(searchString) {
            let promise = super.searchPeople(searchString);
            return new Promise(function (resolve) {
                promise.then(function (data) {
                    resolve({results: data.results.filter(x => x.known_for_department === 'Acting')});
                });
            }.bind(this));
        }

        getPersonMovies(id) {
            let promise = super.getPersonMovies(id);
            return new Promise(function (resolve) {
                let today = new Date(),
                    themSelves = new RegExp(/\b(himself|self|herself|voice)\b/);
                promise.then(function (data) {
                    data.cast = data.cast.filter(x =>
                        x.character
                        && !x.genre_ids.includes(99)
                        && x.genre_ids.length > 0
                        && !themSelves.exec(x.character.toLowerCase())
                        && x.vote_count > 1
                        && new Date(x.release_date) < today)
                    resolve(data)
                });

            })
        }
    }

    return Api
})