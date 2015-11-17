// Performs rewrites based on rev and the useminPrepare configuration
module.exports = {
    html: ['<%= yeoman.dist %>/{,*/}*.html'],
        css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
        options: {
        assetsDirs: ['<%= yeoman.dist %>']
    }
};
