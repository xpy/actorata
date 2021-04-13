define(['Vue', 'Api', 'genre-chart', 'movie-chart', 'person-search', 'person-view'], function (Vue, Api) {
    Vue.prototype.$bus = new Vue({});
    Vue.prototype.$api = new Api('https://pe2cfd0whb.execute-api.us-west-2.amazonaws.com/');


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

})

