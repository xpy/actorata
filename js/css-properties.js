define(['Vue'], function (Vue) {
    let CssProperties = {
        install(Vue, options) {
            let bodyStyles = window.getComputedStyle(document.body);
            Vue.prototype.$cssProperties = {
                get(propertyName) {
                    return bodyStyles.getPropertyValue(`--${propertyName}`); //get
                }
            }
        }
    };
    Vue.use(CssProperties);
})