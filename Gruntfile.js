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
				path: "assets/",
				cssPath: "assets/css/",
				scssPath: "assets/scss/",
				jsPath: "assets/js/",
				jsPathVendor: "assets/js/vendor/",
				jsPathPlugins: "assets/js/plugins/",
				imagePath: "assets/images/",
				fontsPath: "assets/fonts/"
			},
			dist:{
				path: "dist/",
				cssPath: "dist/css/",
				jsPath: "dist/js/",
				jsPathVendor: "dist/js/vendor/",
				jsPathPlugins: "dist/js/plugins/",
				imagePath: "dist/images/",
				fontsPath: "dist/fonts/"
			}
		},

		jshint: {
			jshintrc: ".jshintrc",
			all:{
				src: ["Gruntfile.js", "<%= fileDir.src.jsPath %>*.js", "!<%= fileDir.src.jsPathVendor %>", "!<%= fileDir.dist.jsPathPlugins %>"]
			}
		},

		/*
		Available only in sass 3.4.x version (grunt-contrib-sass)
		*/
		/*
		sass: {
			compile: {
				options: {
					sourcemap: "none",
					style: "expanded",
					compass: false,
					trace: false,
					update: false,
					cacheLocation: "<%= fileDir.tempPath %>.scss_cache/"
				},
				files: [{
					expand: true,
					cwd: 'styles',
					src: ["<%= fileDir.src.scssPath %>*.scss"],
					dest: "<%= fileDir.tempPath %>css/",
					ext: ".min.css"
				}]
			}
		},*/

		/*
		Supports lower version of sass
		*/
		sass: {
			options: {
				sourceMap: false
			},
			dist: {
				files: {
					"<%= fileDir.tempPath %>css/style.css": "<%= fileDir.src.scssPath %>*.scss"
				}
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
				src: "*.html",
				dest: "<%= fileDir.dist.path %>",
				options: {
					mode: true
				}
			}
		}

	});

	grunt.registerTask('default', ["sass_version", "jshint", "clean", "concat", "min", "sass", "cssmin", "copy", "clean:tempDir", "watch"]);

	matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks);
};