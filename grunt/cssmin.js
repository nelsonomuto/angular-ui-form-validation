// By default, your `index.html`'s <!-- Usemin block --> will take care of
// minification. These next options are pre-configured if you do not wish
// to use the Usemin blocks.
module.exports = {
    dist: {
        files: {
            '<%= config.path.dist %>/styles/main.css': [
                '.tmp/styles/main.css',
                '.tmp/styles/form.css'
            ]
        }
    }
};
