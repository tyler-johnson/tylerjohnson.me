var NPMImporter = require("less-plugin-npm-import");

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: [ "dist/" ],
		browserify: {
			dist: {
				src: "lib/client.js",
				dest: "dist/client.js"
			},
			dev: {
				src: "lib/client.js",
				dest: "dist/client.dev.js",
				options: {
					browserifyOptions: { debug: true }
				}
			}
		},
		less: {
			dist: {
				src: "lib/styles.less",
				dest: "dist/client.css",
				options: {
					plugins: [ new NPMImporter({ prefix: "~" }) ]
				}
			},
			dev: {
				src: "lib/styles.less",
				dest: "dist/client.dev.css",
				options: {
					plugins: [ new NPMImporter({ prefix: "~" }) ],
					sourceMap: true,
					sourceMapFileInline: true
				}
			}
		},
		wrap2000: {
			"dist-js": {
				src: 'dist/client.js',
				dest: 'dist/client.js',
				options: {
					header: "/*!\n * TJ.me Client Scripts\n * (c) 2015 Tyler Johnson\n * MIT License\n * Version <%= pkg.version %>\n */\n"
				}
			},
			"dev-js": {
				src: 'dist/client.dev.js',
				dest: 'dist/client.dev.js',
				options: {
					header: "/*!\n * TJ.me Client Scripts (with Source Map)\n * (c) 2015 Tyler Johnson\n * MIT License\n * Version <%= pkg.version %>\n */\n"
				}
			},
			"dist-css": {
				src: 'dist/client.css',
				dest: 'dist/client.css',
				options: {
					header: "/*!\n * TJ.me Client Styles\n * (c) 2015 Tyler Johnson\n * MIT License\n * Version <%= pkg.version %>\n */\n"
				}
			},
			"dev-css": {
				src: 'dist/client.dev.css',
				dest: 'dist/client.dev.css',
				options: {
					header: "/*!\n * TJ.me Client Styles (with Source Map)\n * (c) 2015 Tyler Johnson\n * MIT License\n * Version <%= pkg.version %>\n */\n"
				}
			}
		},
		uglify: {
			dist: {
				src: "dist/client.js",
				dest: "dist/client.min.js",
				options: {
					preserveComments: (function() {
						var ran = false;
						return function() {
							var preserve = !ran;
							ran = true;
							return preserve;
						}
					})()
				}
			}
		},
		cssmin: {
			dist: {
				src: "dist/client.css",
				dest: "dist/client.min.css",
				options: {
					keepSpecialComments: 1
				}
			}
		},
		watch: {
			dev: {
				files: [ "lib/client.js", "lib/styles.less", "lib/vendor/**/*" ],
				tasks: [ 'dev' ],
				options: { spawn: false }
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-wrap2000');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('build-dev-js', [ 'browserify:dev', 'wrap2000:dev-js' ]);
	grunt.registerTask('build-dist-js', [ 'browserify:dist', 'wrap2000:dist-js', 'uglify:dist' ]);
	grunt.registerTask('build-dev-css', [ 'less:dev', 'wrap2000:dev-css' ]);
	grunt.registerTask('build-dist-css', [ 'less:dist', 'wrap2000:dist-css', 'cssmin:dist' ]);

	grunt.registerTask('build-dev', [ 'build-dev-js', 'build-dev-css' ]);
	grunt.registerTask('build-dist', [ 'build-dist-js', 'build-dist-css' ]);

	grunt.registerTask('dev', [ 'clean', 'build-dev' ]);
	grunt.registerTask('dist', [ 'clean', 'build-dist' ]);

	grunt.registerTask('default', [ 'clean', 'build-dev', 'build-dist' ]);

}
