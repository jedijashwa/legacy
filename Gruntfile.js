module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'client/css/styles.css': 'client/css/styles.scss'
        }
      }
    },

    watch: {
      sass: {
        files: [
          'client/css/**/*.scss'
        ],
        tasks: [
          'sass'
        ]
      }
    }

});

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-sass');



};
