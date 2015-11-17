// Empties folders to start fresh
module.exports = {
    dist: {
        files: [
            {
                dot: true,
                src: [
                    '.tmp',
                    '<%= config.path.dist %>/*',
                    '!<%= config.path.dist %>/.git*'
                ]
            }
        ]
    },
    server: '.tmp'
};
