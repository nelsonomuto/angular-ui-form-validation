// ng-annotate adds and removes AngularJS dependency injection annotations.
module.exports = {
    options: {
        singleQuotes: true
    },
    release: {
        files: {
            '<%= config.path.dist %>/<%= pkg.name %>.js': '<%= config.path.dist %>/<%= pkg.name %>.js'
        }
    }
};
