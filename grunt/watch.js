// Watches files for changes and runs tasks based on the changed files
module.exports = {
    js: {
        files: ['{.tmp,<%= config.path.app %>}/scripts/**/*.js', '.jshintrc'],
            tasks: ['newer:jshint:all']
    },
    jsTest: {
        files: ['test/spec/{,*/}*.js'],
            tasks: ['newer:jshint:test', 'karma']
    },
    compass: {
        files: ['<%= config.path.app %>/styles/{,*/}*.{scss,sass}'],
            tasks: ['compass:server', 'autoprefixer']
    },
    styles: {
        files: ['<%= config.path.app %>/styles/{,*/}*.css'],
            tasks: ['newer:copy:styles', 'autoprefixer']
    },
    gruntfile: {
        files: ['Gruntfile.js']
    },
    livereload: {
        options: {
            livereload: '<%= connect.options.livereload %>'
        },
        files: [
            '<%= config.path.app %>/**/*.html',
            '.tmp/styles/{,*/}*.css',
            '<%= config.path.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
    }
};
