require.config(
    {
        paths: {
            Vue: 'vendor/vue',
            Chart: '//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min',
            Api: 'base-api'
        }
    },
);

require(['app']);