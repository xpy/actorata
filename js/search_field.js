// TODO use space for multiple matches
function match_one(search_term, actor_data) {

    var re = new RegExp('(^|\\s)(' + search_term + ')', 'i');
    var reResult = re.exec(actor_data.full_name);
    return reResult !== null
}

function getHighlightedMatch(string, match) {
    var re = new RegExp('(^' + match + ')', 'i'),
        re2 = new RegExp('(\\s' + match + ')', 'i'),
        res = string.replace(re, '<span class="matching">$1</span>');
    res = res.replace(re2, '<span class="matching">$1</span>');
    return res;
}

var search_field = new Vue({
    el: '#actor_search',
    data: {
        actor_list: [],
        search_term: null,
        search_results: [],
        selected_actor: null

    },
    created: function () {
        this.fetchData();
    },
    methods: {
        fetchData: function () {
            callApi(api_get.actor_list).done(function (data) {
                this.actor_list = data;
            }.bind(this));
        },
        changed: function (e) {
            if (['ArrowUp', 'ArrowDown'].indexOf(e.key) >= 0) {
                e.preventDefault();
            } else if (['Enter', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) < 0) {
                this.match(this.search_term);
            }
        },
        change_index: function (e) {
            if (['ArrowUp', 'ArrowDown'].indexOf(e.key) >= 0) {
                e.preventDefault();
                switch (e.key) {
                    case'ArrowUp':
                        this.goToPrevSearchIndex();
                        break;
                    case'ArrowDown':
                        this.goToNextSearchIndex();
                        break;
                }
            }
        },
        match: function (search_term) {

            var results = [];
            if (this.search_term !== '') {

                this.actor_list.forEach(function (actor_data) {
                    if (match_one(search_term, actor_data)) {
                        actor_data.highlighted_name = getHighlightedMatch(actor_data.full_name, search_term);
                        results.push(actor_data)
                    }
                });

                this.selected_actor = 0;

            }
            this.search_results = results;
        }, submit: function () {
            if (this.search_results[this.selected_actor] !== undefined) {
                app.$emit('search_form-submit', {
                    'actor': this.search_results[this.selected_actor]
                });
                this.closeResults();
            }
        }, goToSearchIndex: function (index) {
            this.selected_actor = Math.max(0, Math.min(index, this.search_results.length))
        }, goToNextSearchIndex: function () {
            this.goToSearchIndex(this.selected_actor + 1);
        }, goToPrevSearchIndex: function () {
            this.goToSearchIndex(this.selected_actor - 1);
        }, result_click: function (index) {
            this.goToSearchIndex(index);
            this.submit();
        },
        closeResults: function () {
            this.selected_actor = null;
            this.search_term = null;
            this.search_results = [];
        }


    }
});