// Test settings
module.exports = {
    unit: {
        configFile: 'karma.conf.js',
            autoWatch: true,
            singleRun: false
    },
    unitSingleRun: {
        configFile: 'karma.conf.js'
    },
    firefox: {
        configFile: 'karma.conf.js',
            browsers: ['Firefox']
    }
};
