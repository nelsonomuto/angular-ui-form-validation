// Renames files for browser caching purposes
module.exports = {
    dist: {
        files: {
            src: [
                '<%= config.path.dist %>/scripts/{,*/}*.js',
                '<%= config.path.dist %>/styles/{,*/}*.css',
                '<%= config.path.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                '<%= config.path.dist %>/styles/fonts/*'
            ]
        }
    }
};
