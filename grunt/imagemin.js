// The following *-min tasks produce minified files in the dist folder
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                cwd: '<%= yeoman.app %>/images',
                src: '{,*/}*.{png,jpg,jpeg,gif}',
                dest: '<%= yeoman.dist %>/images'
            }
        ]
    }
};
