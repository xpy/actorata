define(['Vue'], function (Vue) {
    Vue.component('person-search',
        {
            template:
                `
            <form v-on:submit.prevent="submit" @keydown="change_index">
                <input id="search_field" type="text" v-model="search_term" @keyup="changed" autocomplete="off" v-focus>
                <label for="search_field">Search</label>
                <div class="results">
                    <ul>
                        <li v-for="(result, index) in search_results"
                            v-bind:class="{ 'is-active': index==selected }"
                            v-on:click="result_click(index)"
                            v-on:mouseover="goToSearchIndex(index)"
                        >
                            <div class="result" v-html="result.highlighted_name"></div>
                        </li>
                    </ul>
                </div>
            </form>`,

            data: function () {
                return {
                    person_list: [],
                    search_term: null,
                    search_results: [],
                    selected: null
                }
            },
            created: function () {
                this.getFromHash().then(active => {
                    this.$bus.$emit('search_form-submit', active);
                }).catch(e => console.log(e));
            },
            methods: {
                getFromHash: function () {
                    let hash = window.location.hash.replace('#', '');
                    if (!hash) {
                        return Promise.reject('Empty hash');
                    }
                    return this.$api.searchPeople(hash).then(people => {
                            if (people.results && people.results.length > 0) {
                                return people.results[0]
                            }
                            throw "No person found with this hash"
                        }
                    );
                },
                changed: function (e) {
                    if (['ArrowUp', 'ArrowDown'].indexOf(e.key) >= 0) {
                        e.preventDefault();
                    } else if (['Enter', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) < 0) {
                        this.filterResults(this.search_term);
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
                filterResults: function (search_term) {
                    search_term = search_term || '';
                    var results = [];
                    search_term = search_term.trim();

                    if (search_term !== '') {
                        this.$api.searchPeople(search_term).then(data => {
                            let results = data.results.filter(x => x.known_for_department === 'Acting');
                            results.forEach(x => x.highlighted_name = this.getHighlightedMatch(x.name, search_term));
                            this.search_results = results;
                        });
                        this.selected = 0;
                    }
                    this.search_results = results;
                }, submit: function () {
                    if (this.search_results[this.selected] !== undefined) {
                        this.$bus.$emit('search_form-submit', this.search_results[this.selected]);
                        this.closeResults();
                    }
                }, goToSearchIndex: function (index) {
                    this.selected = Math.max(0, Math.min(index, this.search_results.length))
                }, goToNextSearchIndex: function () {
                    this.goToSearchIndex(this.selected + 1);
                }, goToPrevSearchIndex: function () {
                    this.goToSearchIndex(this.selected - 1);
                }, result_click: function (index) {
                    this.goToSearchIndex(index);
                    this.submit();
                },
                closeResults: function () {
                    this.selected = null;
                    this.search_term = null;
                    this.search_results = [];
                },
                getHighlightedMatch: function (string, match) {
                    var re = new RegExp('(^' + match + '|\\s' + match + ')', 'ig');
                    return string.replace(re, '<span class="matching">$1</span>');
                }
            }
        });
})
