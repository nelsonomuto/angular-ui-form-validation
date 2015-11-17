// Run some tasks in parallel to speed up the build process
module.exports = {
    server: [
        'compass:server',
        'copy:styles'
    ],
        test: [
        'compass',
        'copy:styles'
    ],
        dist: [
        'compass:dist',
        'copy:styles',
        //'imagemin',
        'svgmin',
        'htmlmin'
    ],
        options: {
        limit: 10
    }
};
