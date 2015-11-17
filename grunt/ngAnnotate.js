// ng-annotate adds and removes AngularJS dependency injection annotations.
module.exports = {
    options: {
        singleQuotes: true
    },
    release: {
        files: {
            '<%= yeoman.dist %>/<%= pkg.name %>.js': '<%= yeoman.dist %>/<%= pkg.name %>.js'
        }
    }
};
