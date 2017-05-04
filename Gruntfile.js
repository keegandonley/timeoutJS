module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');

    grunt.initConfig({
        jshint: {
            all: ['src/timeout.js', 'Gruntfile.js', 'test/spec.js', 'package.json']
        },
        uglify: {
            timeoutjs: {
                files: {
                    'src/timeout.min.js': ['src/timeout.js']
                }
            }
        },
        mocha_phantomjs: {
          test: {
            src: ['test/**/*.html'],
            options: {
                run: true
            }
          }
        }
    });

    grunt.registerTask('default', ['jshint', 'uglify', 'mocha_phantomjs']);

};
