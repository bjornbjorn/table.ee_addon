module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['Gruntfile.js', 'system/expressionengine/third_party/table/**/*.js']
        },

        phplint: {
            all: [
                'system/expressionengine/third_party/table/**/*.php'
            ]
        },

        sass: {                              // Task
            table: {                            // Target
                options: {                       // Target options
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'system/expressionengine/third_party/table/sass/*.scss',
                    dest: 'themes/third_party/table/css',
                    ext: '.min.css'
                }]
            }
        },

        changelog: {
          options: {
              repository: 'https://bitbucket.org/lastfriday/table.ee_addon',
              dest: 'CHANGELOG.md'
          }
        },

        uglify: {
            all: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    'themes/third_party/table/js/table.min.js': 'system/expressionengine/third_party/table/js/table.js'
                }
            }
        },


        watch: {
            options: {
                atBegin: true
            },
            php: {
                files: ['system/expressionengine/third_party/table/**/*.php'],
                tasks: ['phplint']
            },
            scripts: {
                files: ['system/expressionengine/third_party/table/js/*.js'],
                tasks: ['jshint','uglify']
            },
            css: {
                files: 'system/expressionengine/third_party/table/sass/*/**.scss',
                tasks: ['sass']
            }
        },


    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-phplint');
    grunt.loadNpmTasks('grunt-conventional-changelog');
};