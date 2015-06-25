module.exports = function(grunt) {

  grunt.initConfig({
    'jslint'  : {
      all     : {
        src : [ 'magic/*.js' ],
        directives : {
          browser : true,
          indent : 2
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jslint');
  grunt.registerTask('default',  ['jslint']);
};
