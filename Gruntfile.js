module.exports = function (grunt) {

	var pkg = grunt.file.readJSON("package.json"), matchdep = require("matchdep");

	grunt.initConfig({
		pkg: pkg,

		sass_version: {
			options: {
				ignorePatch : true,
				ignoreMinor : false
			},
			your_target: {
				version: "3.2.8"
			}
		},

		fileDir: {
			tempPath: ".temp/",
			src:{
				path: "src/",
				cssPath: "src/assets/css/",
				scssPath: "src/assets/scss/",
				jsPath: "src/assets/js/",
				jsPathVendor: "src/assets/js/vendor/",
				jsPathPlugins: "src/assets/js/plugins/",
				imagePath: "src/assets/images/",
				fontsPath: "src/assets/fonts/"
			},
			dist:{
				path: "dist/",
				cssPath: "dist/assets/css/",
				jsPath: "dist/assets/js/",
				jsPathVendor: "dist/assets/js/vendor/",
				jsPathPlugins: "dist/assets/js/plugins/",
				imagePath: "dist/assets/images/",
				fontsPath: "dist/assets/fonts/"
			}
		},

		jshint: {
			options: {
				jshintrc: ".jshintrc"
			},
			all:{
				src: ["<%= fileDir.src.jsPath %>*.js", "!<%= fileDir.src.jsPathVendor %>", "!<%= fileDir.dist.jsPathPlugins %>"]
			}
		},

		sass: {
			compile: {
				options: {
					style: "compressed",
					unixNewlines: true,
					check: false,
					precision: 10,
					quiet: true,
					compass: false,
					debugInfo: false,
					lineNumbers: false,
					trace: true,
					noCache: false,
					update: false,
					cacheLocation: "<%= fileDir.tempPath %>.scss_cache/"
				},
				files: [{
					expand: true,
					cwd: "<%= fileDir.src.scssPath %>",
					src: ["*.scss"],
					dest: "<%= fileDir.tempPath %>css",
					ext: ".min.css"
				}]
			}
		},

		watch: {
			sass: {
				files: ["<%= fileDir.src.scssPath %>**/*.{scss,sass}"],
				tasks: ["sass", "cssmin", "copy:cssUpdate"]
			},
			jssrc: {
				files: ["<%= fileDir.src.jsPath %>**/*.js"],
				tasks: ["jshint", "concat:app", "min:app", "copy:appjs"],
				options: {
					interrupt: true
				}
			},
			html: {
				files: ["<%= fileDir.src.path %>**/*.{html,htm}"],
				tasks: ["copy:htmlfiles"]
			},
			reload: {
				files: ["<%= fileDir.dist.path %>**/*.*"],
				options: {
					livereload: true
				}
			}
		},

		concat: {
			options: {
				stripBanners: true
			},
			plugins: {
				src: ["<%= fileDir.src.jsPathPlugins %>*.min.js"],
				dest: "<%= fileDir.tempPath %>js/plugins.min.js"
			},
			app: {
				files: {
					"<%= fileDir.tempPath %>js/app.concat.js" : ["<%= fileDir.src.jsPath %>*.js", "!<%= fileDir.src.jsPathVendor %>",  "!<%= fileDir.src.jsPathPlugins %>"]
				}
			}
		},

		min: {
			app: {
				src: ["<%= fileDir.tempPath %>js/app.concat.js"],
				dest: "<%= fileDir.tempPath %>js/app.min.js"
			}
		},

		cssmin: {
			sassCompiled: {
				src: ["<%= fileDir.tempPath %>css/*.css"],
				dest: "<%= fileDir.src.cssPath %>style.min.css"
			}
		},

		clean: {
			tempDir: ["<%= fileDir.tempPath %>css/", "<%= fileDir.tempPath %>js/", "<%= fileDir.tempPath %>*.*"],
			dist: ["<%= fileDir.dist.path %>"]
		},

		copy: {
			main: {
				files: [
					{expand: true, cwd: "<%= fileDir.src.cssPath %>",src: "*", dest: "<%= fileDir.dist.cssPath %>"},
					{expand: true, cwd: "<%= fileDir.src.imagePath %>",src: "*", dest: "<%= fileDir.dist.imagePath %>"},
					{expand: true, cwd: "<%= fileDir.src.fontsPath %>",src: "*", dest: "<%= fileDir.dist.fontsPath %>"},
					{expand: true, cwd: "<%= fileDir.src.jsPathVendor %>",src: "*", dest: "<%= fileDir.dist.jsPathVendor %>"},
					{expand: true, cwd: "<%= fileDir.tempPath %>js/",src: "plugins.min.js", dest: "<%= fileDir.dist.jsPathPlugins %>"}
				]
			},
			cssUpdate: {
				expand: true,
				cwd: "<%= fileDir.src.cssPath %>",
				src: "style.min.css",
				dest: "<%= fileDir.dist.cssPath %>",
				options: {
					mode: true
				}
			},
			appjs: {
				expand: true,
				cwd: "<%= fileDir.tempPath %>js/",
				src: "app.min.js",
				dest: "<%= fileDir.dist.jsPath %>",
				options: {
					mode: true
				}
			},
			htmlfiles: {
				expand: true,
				cwd: "<%= fileDir.src.path %>",
				src: "**/**.html",
				dest: "<%= fileDir.dist.path %>",
				options: {
					mode: true
				}
			}
		},

		// Live Reload
		browserSync: {
			default_options: {
				bsFiles: {
					src: "<%= fileDir.src.path %>"
				},
				options: {
					watchTask: true,
					port: 8080,
					server: {
						baseDir: "./<%= fileDir.dist.path %>"
					}
				}
			}
		}

	});

	grunt.registerTask('default', ["sass_version", "jshint", "clean", "concat", "min", "sass", "cssmin", "copy", "clean:tempDir", "browserSync", "watch"]);

	matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks);
};