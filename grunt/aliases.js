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
        'concat', //concatenating into dist/angular-ui-form-validation.js
        'removelogging', //remove logging from angular-ui-form-validation.js
        'ngmin', //TODO: fix ngmin src and dest is .tmp folder
        'ngAnnotate', //dist/angular-ui-form-validation.js -> dist/angular-ui-form-validation.js
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
