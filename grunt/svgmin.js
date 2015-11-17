// The following *-min tasks produce minified files in the dist folder
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                cwd: '<%= yeoman.app %>/images',
                src: '{,*/}*.svg',
                dest: '<%= yeoman.dist %>/images'
            }
        ]
    }
};
