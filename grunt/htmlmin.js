// The following *-min tasks produce minified files in the dist folder
module.exports = {
    dist: {
        options: {
            // Optional configurations that you can uncomment to use
            removeCommentsFromCDATA: true,
                // collapseBooleanAttributes: true,
                // removeAttributeQuotes: true,
                // removeRedundantAttributes: true,
                // useShortDoctype: true,
                // removeEmptyAttributes: true,
                removeOptionalTags: true
        },
        files: [
            {
                expand: true,
                cwd: '<%= config.path.app %>',
                src: ['*.html', 'views/*.html'],
                dest: '<%= config.path.dist %>'
            }
        ]
    }
};
