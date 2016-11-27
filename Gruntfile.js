'use strict';

module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            default: {
                files: {
                    'bootstrap-formform.min.js': ['bootstrap-formform.js']
                }
            }
        }
    });
    
    //grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.registerTask('default', ['uglify']);

};