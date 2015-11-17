// Copies remaining files to places other tasks can use
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                dot: true,
                cwd: '<%= config.path.app %>',
                dest: '<%= config.path.dist %>',
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
                dest: '<%= config.path.dist %>/images',
                src: [
                    'generated/*'
                ]
            }
        ]
    },
    styles: {
        expand: true,
            cwd: '<%= config.path.app %>/styles',
            dest: '.tmp/styles/',
            src: '{,*/}*.css'
    }
};
