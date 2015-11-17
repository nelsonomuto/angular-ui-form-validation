
module.exports = {
    options: {
        data: {
            pluginDesc: 'angular-ui-form-validation',
            version: '<%= pkg.version =>',
            desc: '<%= pkg.description =>'
        }
    },
    dist: {
        files: {
            'dist/index.html': ['index.html']
        }
    }
};
