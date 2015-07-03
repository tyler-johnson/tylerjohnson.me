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
			scripts: {
				files: [{
					expand: true,
					cwd: "dist/",
					src: [ "*.js" ],
					dest: "dist/",
					isFile: true
				}],
				options: {
					header: "/*!\n * (c) 2015 Tyler Johnson\n * Version <%= pkg.version %>\n */\n"
				}
			},
			styles: {
				files: [{
					expand: true,
					cwd: "dist/",
					src: [ "*.css" ],
					dest: "dist/",
					isFile: true
				}],
				options: {
					header: "/*!\n * (c) 2015 Tyler Johnson\n * Version <%= pkg.version %>\n */\n"
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
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-wrap2000');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('build-dev-js', [ 'browserify:dev' ]);
	grunt.registerTask('build-dist-js', [ 'browserify:dist', 'uglify:dist' ]);
	grunt.registerTask('build-dev-css', [ 'less:dev' ]);
	grunt.registerTask('build-dist-css', [ 'less:dist', 'cssmin:dist' ]);

	grunt.registerTask('build-dev', [ 'build-dev-js', 'build-dev-css']);
	grunt.registerTask('build-dist', [ 'build-dist-js', 'build-dist-css' ]);

	grunt.registerTask('dev', [ 'clean', 'build-dev', 'wrap2000'  ]);
	grunt.registerTask('dist', [ 'clean', 'build-dist', 'wrap2000'  ]);

	grunt.registerTask('default', [ 'clean', 'build-dev', 'build-dist', 'wrap2000'  ]);

}
