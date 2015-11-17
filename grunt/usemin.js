// Performs rewrites based on rev and the useminPrepare configuration
module.exports = {
    html: ['<%= config.path.dist %>/{,*/}*.html'],
        css: ['<%= config.path.dist %>/styles/{,*/}*.css'],
        options: {
        assetsDirs: ['<%= config.path.dist %>']
    }
};
