// Copies remaining files to places other tasks can use
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.dist %>',
                src: [
                    '*.{ico,png,txt}',
                    '.htaccess',
                    'bower_components/**/*',
                    'images/{,*/}*.{webp}',
                    'fonts/*'
                ]
            },
            {
                expand: true,
                cwd: '.tmp/images',
                dest: '<%= yeoman.dist %>/images',
                src: [
                    'generated/*'
                ]
            }
        ]
    },
    styles: {
        expand: true,
            cwd: '<%= yeoman.app %>/styles',
            dest: '.tmp/styles/',
            src: '{,*/}*.css'
    }
};
