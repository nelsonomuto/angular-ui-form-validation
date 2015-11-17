'use strict';

module.exports = function (grunt) {
    var path = require('path');
    // Load grunt tasks automatically

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        // path to task.js files, defaults to grunt dir
        configPath: path.join(process.cwd(), 'grunt'),

        // auto grunt.initConfig
        init: true,

        // data passed into config.  Can use with <%= test %>
        data: {
            // Project settings
            pkg: grunt.file.readJSON('package.json'),

            config: require('./grunt-config')
        },

        // use different function to merge config files
        //mergeFunction: require('recursive-merge'),

        // can optionally pass options to load-grunt-tasks.
        // If you set to false, it will disable auto loading tasks.
        loadGruntTasks: {

            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        },

        //can post process config object before it gets passed to grunt
        postProcess: function(config) {},

        //allows to manipulate the config object before it gets merged with the data object
        preMerge: function(config, data) {}
    });
};
