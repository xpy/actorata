Vue.component('actor-search',
    {
        template:
            `
            <form v-on:submit.prevent="submit" @keydown="change_index">
                <input id="search_field" type="text" v-model="search_term" @keyup="changed" autocomplete="off">
                <label for="search_field">Search</label>
                <div class="results">
                    <ul>
                        <li v-for="(actor, index) in search_results"
                            v-bind:class="{ 'is-active': index==selected_actor }"
                            v-on:click="result_click(index)"
                            v-on:mouseover="goToSearchIndex(index)"
                        >
                            <div class="actor-result" v-html="actor.highlighted_name"></div>
                        </li>
                    </ul>
                </div>
            </form>`,

        data: function () {
            return {
                actor_list: [],
                search_term: null,
                search_results: [],
                selected_actor: null
            }
        },
        created: function () {
            this.fetchHashActor();
        },
        methods: {
            getFromHash: function () {
                let hash = window.location.hash.replace('#', '');
                return api.searchPeople(hash).then(people => {
                        if (people.results && people.results.length > 0) {
                            return people.results[0]
                        }
                        throw "No actor found with this hash"
                    }
                );
            },
            fetchHashActor: function () {
                this.getFromHash().then(activeActor => {
                    this.$bus.$emit('search_form-submit', {'actor': activeActor});
                }).catch(e => console.log(e));
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
                search_term = search_term || '';
                var results = [];
                search_term = search_term.trim();

                if (search_term !== '') {
                    api.searchPeople(search_term).then(data => {
                        let actors = data.results.filter(x => x.known_for_department === 'Acting');
                        actors.forEach(x => x.highlighted_name = this.getHighlightedMatch(x.name, search_term));
                        this.search_results = actors;
                        console.log('Actors', actors);
                    });
                    this.selected_actor = 0;
                }
                this.search_results = results;
            }, submit: function () {
                if (this.search_results[this.selected_actor] !== undefined) {
                    this.$bus.$emit('search_form-submit', {
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
            },
            getHighlightedMatch: function (string, match) {
                var re = new RegExp('(^' + match + '|\\s' + match + ')', 'ig');
                return string.replace(re, '<span class="matching">$1</span>');
            }
        }
    });