// Reads HTML for usemin blocks to enable smart builds that automatically
// concat, minify and revision files. Creates configurations in memory so
// additional tasks can operate on them
module.exports = {
    html: '<%= config.path.app %>/index.html',
        options: {
        dest: '<%= config.path.dist %>'
    }
};
