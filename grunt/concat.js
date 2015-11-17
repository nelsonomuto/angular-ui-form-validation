module.exports = {
    distsourcefile: {
        src: [
            '<%= yeoman.bower %>/lazy.js/lazy.js', //TODO: may move and rename this as it is modified to accept invalid JSOL
            '<%= yeoman.app %>/scripts/JSOL/jsol.js', //TODO: may move and rename this as it is modified to accept invalid JSOL
            '<%= yeoman.services %>/{,*}/*.js',
            '<%= yeoman.directives %>/{,*}/*.js',
            '!**/*spec.js'
            // '!<%= yeoman.directives %>/{,*}/*spec.js'
        ],
            dest: '<%= yeoman.dist %>/<%= pkg.name %>.js'
    }
};
