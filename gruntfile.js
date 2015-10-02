module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/* <%= pkg.name %> v<%= pkg.version %> \n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> \n */\n',
    
    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/OI.offcanvas.css' : 'sass/OI.offcanvas.scss'
        }
      },
      production: {
        options: {
          style: 'compact',
          sourcemap: 'none',
          banner: '<%= banner %>'
        },
        files: {
          'dist/OI.offcanvas.min.css' : 'sass/OI.offcanvas.scss'
        }
      }
    },
    
    uglify: {
      production: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          'dist/OI.offcanvas.min.js': ['js/OI.offcanvas.js']
        }
      }
    },
    
    css_mqpacker: {
      production: {
        options: {
          map: false
        },

        expand: true,
        cwd: 'dist/',
        src: '*.css',
        dest: 'dist/'
      }
    },
    
    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer'),
        ]
      },
      production: {
        src: 'dist/*.css'
      }
    },
    
    watch: {
      default: {
        files: ['sass/**/*.scss', 'js/**/*.js'],
        tasks: ['default']
      },
      options: {
        interrupt: false,
        nospawn: true,
        event: 'all',
        interval: 1000,
        debounceDelay: 1000
      },
    }
    
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-css-mqpacker');

  // Default task(s).
  grunt.registerTask('default', [ 'sass:dev', 'sass:production', 'uglify:production', 'css_mqpacker', 'postcss:production' ] );

};
