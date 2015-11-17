// The following *-min tasks produce minified files in the dist folder
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                cwd: '<%= config.path.app %>/images',
                src: '{,*/}*.svg',
                dest: '<%= config.path.dist %>/images'
            }
        ]
    }
};
