module.exports = {
    default: [
        'newer:jshint',
        'test',
        'build'
    ],
    test: [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ],
    build: [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'removelogging',
        'ngmin',
        'ngAnnotate',
        'copy:dist',
        'cdnify',
        'cssmin:dist',
        'uglify',
        'usemin'
    ],
    serve: [
        'clean:server',
        'concurrent:server',
        'autoprefixer',
        'connect:livereload',
        'watch'
    ],
    servedist: [
        'build',
        'connect:dist:keepalive'
    ]
};
