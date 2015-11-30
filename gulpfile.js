var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var stripDebug = require('gulp-strip-debug');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var inject = require('gulp-inject');
var rev = require('gulp-rev');
var del = require('del');
var removeCode = require('gulp-remove-code');
var runSequence = require('run-sequence');
var sh = require('shelljs');
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var buildConfig = require('./build.json');
var argv = require('minimist')(process.argv.slice(2));

var paths = {
  sass: ['./scss/**/*.scss'],
  templatecache: ['./www/views/**/*.html'],
  ng_annotate: ['./www/js/*.js']
};
var targetDir = './dist/';

var build = !!(argv.dev || argv.qa || argv.qanew || argv.st || argv.prod || argv.prodnew);
var dev = !!argv.dev;
var qa = !!argv.qa;
var qanew = !!argv.qanew;
var st = !!argv.st;
var prod = !!argv.prod;
var prodnew = !!argv.prodnew;
var sharingHost = '';
var apiEnvname = '';
var apiEndpoint = '';
var instagramRedirectDomain = '';
var instagramClientId = '';
var facebookRedirectDomain = '';
var facebookRedirectUri = '';
var facebookClientId = '';
var facebookAppUrl = '';

if (dev) {
  sharingHost = buildConfig.dev.sharingHost;
  apiEnvname = buildConfig.dev.apiEnvname;
  apiEndpoint = buildConfig.dev.apiEndpoint;
  instagramRedirectDomain = buildConfig.dev.instagramRedirectDomain;
  instagramClientId = buildConfig.dev.instagramClientId;
  facebookRedirectDomain = buildConfig.dev.facebookRedirectDomain;
  facebookRedirectUri = buildConfig.dev.facebookRedirectUri;
  facebookClientId = buildConfig.dev.facebookClientId;
  facebookAppUrl = buildConfig.dev.facebookAppUrl;
  gutil.log(
    gutil.colors.red('---' + apiEnvname + ' building is in progress...')
  );
} else if (qa) {
  sharingHost = buildConfig.qa.sharingHost;
  apiEnvname = buildConfig.qa.apiEnvname;
  apiEndpoint = buildConfig.qa.apiEndpoint;
  instagramRedirectDomain = buildConfig.qa.instagramRedirectDomain;
  instagramClientId = buildConfig.qa.instagramClientId;
  facebookRedirectDomain = buildConfig.qa.facebookRedirectDomain;
  facebookRedirectUri = buildConfig.qa.facebookRedirectUri;
  facebookClientId = buildConfig.qa.facebookClientId;
  facebookAppUrl = buildConfig.qa.facebookAppUrl;
  gutil.log(
    gutil.colors.red('---' + apiEnvname + ' building is in progress...'),
    '(minified, debugs stripped)'
  );
} else if (qanew) {
  sharingHost = buildConfig.qanew.sharingHost;
  apiEnvname = buildConfig.qanew.apiEnvname;
  apiEndpoint = buildConfig.qanew.apiEndpoint;
  instagramRedirectDomain = buildConfig.qanew.instagramRedirectDomain;
  instagramClientId = buildConfig.qanew.instagramClientId;
  facebookRedirectDomain = buildConfig.qanew.facebookRedirectDomain;
  facebookRedirectUri = buildConfig.qanew.facebookRedirectUri;
  facebookClientId = buildConfig.qanew.facebookClientId;
  facebookAppUrl = buildConfig.qanew.facebookAppUrl;
  gutil.log(
    gutil.colors.red('---' + apiEnvname + ' building is in progress...'),
    '(minified, debugs stripped)'
  );
} else if (st) {
  sharingHost = buildConfig.st.sharingHost;
  apiEnvname = buildConfig.st.apiEnvname;
  apiEndpoint = buildConfig.st.apiEndpoint;
  instagramRedirectDomain = buildConfig.st.instagramRedirectDomain;
  instagramClientId = buildConfig.st.instagramClientId;
  facebookRedirectDomain = buildConfig.st.facebookRedirectDomain;
  facebookRedirectUri = buildConfig.st.facebookRedirectUri;
  facebookClientId = buildConfig.st.facebookClientId;
  facebookAppUrl = buildConfig.st.facebookAppUrl;
  gutil.log(
    gutil.colors.red('---' + apiEnvname + ' building is in progress...'),
    '(minified, debugs stripped)'
  );
} else if (prod) {
  sharingHost = buildConfig.prod.sharingHost;
  apiEnvname = buildConfig.prod.apiEnvname;
  apiEndpoint = buildConfig.prod.apiEndpoint;
  instagramRedirectDomain = buildConfig.prod.instagramRedirectDomain;
  instagramClientId = buildConfig.prod.instagramClientId;
  facebookRedirectDomain = buildConfig.prod.facebookRedirectDomain;
  facebookRedirectUri = buildConfig.prod.facebookRedirectUri;
  facebookClientId = buildConfig.prod.facebookClientId;
  facebookAppUrl = buildConfig.prod.facebookAppUrl;
  gutil.log(
    gutil.colors.red('---' + apiEnvname + ' building is in progress...'),
    '(minified, debugs stripped)'
  );
} else if (prodnew) {
  sharingHost = buildConfig.prodnew.sharingHost;
  apiEnvname = buildConfig.prodnew.apiEnvname;
  apiEndpoint = buildConfig.prodnew.apiEndpoint;
  instagramRedirectDomain = buildConfig.prodnew.instagramRedirectDomain;
  instagramClientId = buildConfig.prodnew.instagramClientId;
  facebookRedirectDomain = buildConfig.prodnew.facebookRedirectDomain;
  facebookRedirectUri = buildConfig.prodnew.facebookRedirectUri;
  facebookClientId = buildConfig.prodnew.facebookClientId;
  facebookAppUrl = buildConfig.prodnew.facebookAppUrl;
  gutil.log(
    gutil.colors.red('---' + apiEnvname + ' building is in progress...'),
    '(minified, debugs stripped)'
  );
} else {
  sharingHost = buildConfig.local.sharingHost;
  apiEnvname = buildConfig.local.apiEnvname;
  apiEndpoint = buildConfig.local.apiEndpoint;
  instagramRedirectDomain = buildConfig.local.instagramRedirectDomain;
  instagramClientId = buildConfig.local.instagramClientId;
  facebookRedirectDomain = buildConfig.local.facebookRedirectDomain;
  facebookRedirectUri = buildConfig.local.facebookRedirectUri;
  facebookClientId = buildConfig.local.facebookClientId;
  facebookAppUrl = buildConfig.local.facebookAppUrl;
  gutil.log(
    gutil.colors.red('---' + apiEnvname + ' building is in progress...')
  );
}

// gulp.task('default', ['clean', 'sass', 'templatecache', 'vendor', 'scripts', 'images', 'index']);
gulp.task('default', function(done) {
  runSequence(
    'clean',
    'templatecache',
    'buildversion',
    [
      'fonts',
      'sass',
      'images',
      'vendor',
      'scripts'
    ],
    'index',
    'removecode',
    done
  );
});

gulp.task('clean', function(done) {
  del([targetDir + '**/*'], done);
});

gulp.task('removecode', function() {
  return gulp.src(targetDir + 'index.html')
    .pipe(removeCode({ production: true }))
    .pipe(gulp.dest(targetDir));
});

gulp.task('buildversion', function() {
  return gulp.src('./www/js/config.js')
    .pipe(replace(/sharingHost: '[A-Za-z0-9_:/.#]+'/, 'sharingHost: \'' + sharingHost + '\''))
    .pipe(replace(/apiEnvname: '\w+'/, 'apiEnvname: \'' + apiEnvname + '\''))
    .pipe(replace(/apiEndpoint: '[A-Za-z0-9_:/.]+'/, 'apiEndpoint: \'' + apiEndpoint + '\''))
    .pipe(replace(/instagramRedirectDomain: '[A-Za-z0-9_:/.]+'/, 'instagramRedirectDomain: \'' + instagramRedirectDomain + '\''))
    .pipe(replace(/instagramClientId: '\w+'/, 'instagramClientId: \'' + instagramClientId + '\''))
    .pipe(replace(/facebookRedirectDomain: '[A-Za-z0-9_:/.]+'/, 'facebookRedirectDomain: \'' + facebookRedirectDomain + '\''))
    .pipe(replace(/facebookClientId: '\w+'/, 'facebookClientId: \'' + facebookClientId + '\''))
    .pipe(replace(/facebookAppUrl: '[A-Za-z0-9_:/.]+'/, 'facebookAppUrl: \'' + facebookAppUrl + '\''))
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('index', function() {
  return gulp.src('./www/index.html')
    .pipe(inject(gulp.src('style.min-*.css', {cwd: targetDir}), {starttag: '<!-- inject:styles:{{ext}} -->', addRootSlash: false, read: false}))
    .pipe(inject(gulp.src('vendor.min-*.js', {cwd: targetDir}), {starttag: '<!-- inject:vendor:{{ext}} -->', addRootSlash: false, read: false}))
    .pipe(inject(gulp.src('xapp.min-*.js', {cwd: targetDir}), {starttag: '<!-- inject:xapp:{{ext}} -->', addRootSlash: false, read: false}))
    .pipe(gulp.dest(targetDir));
});

gulp.task('fonts', function() {
  return gulp.src('./www/font/*.*')
    .pipe(gulp.dest(targetDir + 'font'));
});

gulp.task('ng_annotate', function(done) {
  gulp.src('./www/js/**/*.js')
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest(targetDir + 'app/'))
    .on('end', done);
});

gulp.task('templatecache', function(done) {
  gulp.src(['./www/views/*.html', './www/views/templates/*.html'])
    .pipe(templateCache({standalone:true}))
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

gulp.task('scripts', function() {
  return gulp.src(['./www/js/*.js', './www/js/controllers/*.js', './www/js/**/*.js'])
    .pipe(concat('xapp.js'))
    // .pipe(gulp.dest(targetDir))
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(rev())
    .pipe(gulp.dest(targetDir));
});

gulp.task('vendor', function() {
  var vendorFiles = require('./vendor.json');

  return gulp.src(vendorFiles)
    .pipe(concat('vendor.js'))
    // .pipe(gulp.dest(targetDir))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(rev())
    .pipe(gulp.dest(targetDir));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/'))
    .pipe(gulpif(build, minifyCss({
      keepSpecialComments: 0
    })))
    .pipe(rename({basename: 'style', extname: '.min.css'}))
    .pipe(gulpif(build, rev()))
    .pipe(gulp.dest(targetDir))
    .on('end', done);
});

gulp.task('images', function() {
  return gulp.src('./www/img/*')
    .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
    .pipe(gulp.dest(targetDir + 'img'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templatecache, ['templatecache']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
