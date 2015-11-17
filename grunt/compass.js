// Compiles Sass to CSS and generates necessary files if requested
module.exports = {
    options: {
        sassDir: '<%= config.path.app %>/styles',
            cssDir: '.tmp/styles',
            generatedImagesDir: '.tmp/images/generated',
            imagesDir: '<%= config.path.app %>/images',
            javascriptsDir: '<%= config.path.app %>/scripts',
            fontsDir: '<%= config.path.app %>/styles/fonts',
            importPath: '<%= config.path.app %>/bower_components',
            httpImagesPath: '/images',
            httpGeneratedImagesPath: '/images/generated',
            httpFontsPath: '/styles/fonts',
            relativeAssets: false,
            assetCacheBuster: false
    },
    dist: {
        options: {
            generatedImagesDir: '<%= config.path.dist %>/images/generated'
        }
    },
    server: {
        options: {
            debugInfo: true
        }
    }
};
