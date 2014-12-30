var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jsdoc = require('gulp-jsdoc');
var jsdocToMd = require('gulp-jsdoc-to-markdown');
var server = require('gulp-server-livereload');

var DIST = 'dist';
var KARMA_CONF = 'test/karma.conf.js';
var SRC_DIR = ['src/*.js', 'bower_components/mustache/mustache.js'];
var SRC_LINT = ['src/data-bind.js', 'src/object-observer.js'];
var TEST_DIR = 'src/*.js, bower_components/jquery/dist/jquery.js';
var JSHITRC = {
    'node': true,
    'esnext': true,
    'bitwise': true,
    'camelcase': true,
    'curly': true,
    'eqeqeq': true,
    'immed': true,
    'indent': 4,
    'latedef': false,
    'newcap': true,
    'noarg': true,
    'quotmark': 'single',
    'undef': true,
    'unused': true,
    'strict': false,
    'trailing': true,
    'smarttabs': true,
    'white': true,
    'globals': {
        'model': true,
        'DataBinder': true,

        'window': true,
        '$': true,
        'document': true,

        'describe': true,
        'it': true,
        'expect': true,
        'setFixtures': true,

        'Mustache': true,
        'HTMLElement': true
    }
};


gulp.task('test', function () {
    return gulp.src(TEST_DIR)
        .pipe(karma({
            configFile: KARMA_CONF,
            action: 'watch'
        }))
        .on('error', function (err) {
            throw err;
        });
});

gulp.task('server', function() {
    gulp.src('./')
        .pipe(server({
            livereload: false,
            directoryListing: true,
            open: false
        }));
});

gulp.task('lint', function () {
    gulp.src(SRC_LINT)
        .pipe(jshint(JSHITRC))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('docs', function () {
    gulp.src(SRC_DIR)
        .pipe(jsdoc.parser())
        .pipe(jsdoc.generator(DIST + '/docs', {
            path: 'ink-docstrap',
            systemName: 'data-binder',
            footer: '',
            copyright: '',
            navType: 'vertical',
            theme: 'flatly',
            linenums: true,
            collapseSymbols: false,
            inverseNav: false
        }, {
            showPrivate: false,
            monospaceLinks: false,
            cleverLinks: false,
            outputSourceFiles: true
        }));

    gulp.src(SRC_DIR)
        .pipe(concat('wiki-docs.md'))
        .pipe(jsdocToMd())
        .pipe(gulp.dest(DIST + '/wiki'));
});

gulp.task('build', ['lint', 'docs'], function () {
    gulp.src(SRC_DIR)
        .pipe(concat('data-binder.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(DIST));

    gulp.src(SRC_DIR)
        .pipe(concat('data-binder.js'))
        .pipe(gulp.dest(DIST));
});

gulp.task('default', ['build', 'server'], function () {
    gulp.watch(SRC_DIR, ['build']);
});
