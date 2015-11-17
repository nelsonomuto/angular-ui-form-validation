// The actual grunt server settings
module.exports = {
    options: {
        port: 9010,
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: 'localhost',
            livereload: 35739
    },
    livereload: {
        options: {
            open: true,
                base: [
                '.tmp',
                '<%= config.path.app %>'
            ]
        }
    },
    test: {
        options: {
            port: 9001,
                base: [
                '.tmp',
                'test',
                '<%= config.path.app %>'
            ]
        }
    },
    dist: {
        options: {
            base: '<%= config.path.dist %>'
        }
    }
};
