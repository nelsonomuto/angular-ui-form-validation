module.exports = {
    dist: {
        src: '.tmp/concat/scripts/**/*.js'
    },
    distsourcefile: {
        src: '<%= yeoman.dist %>/<%= pkg.name %>.js'
    },
    //jshint ignore:start
    options: {
        namespace: ['console', 'window.console', '\\\$log']
    }
    //jshint ignore:end
};
