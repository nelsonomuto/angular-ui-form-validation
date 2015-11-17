module.exports = {
    distsourcefile: {
        src: [
            '<%= config.path.bower %>/lazy.js/lazy.js', //TODO: may move and rename this as it is modified to accept invalid JSOL
            '<%= config.path.app %>/scripts/JSOL/jsol.js', //TODO: may move and rename this as it is modified to accept invalid JSOL
            '<%= config.path.services %>/{,*}/*.js',
            '<%= config.path.directives %>/{,*}/*.js',
            '!**/*spec.js'
            // '!<%= config.path.directives %>/{,*}/*spec.js'
        ],
            dest: '<%= config.path.dist %>/<%= pkg.name %>.js'
    }
};
