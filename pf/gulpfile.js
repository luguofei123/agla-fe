/**
 * @description: {series}连续的/系列方法 {parallel}并发方法
 */
const { src, dest, series } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel'); //es6转译&压缩
const uglify = require('gulp-uglify'); //丑化
const del = require('del');
const log = require('fancy-log')

const conf = {
  output: 'dist',
  baseFileset: ['!dist/**','!node_modules/**', '!agla-trd/**', '!images/**', '!portal/**', '!pub/**', '!vue/**'],
  copyFileset: ['**', '!bg/**/*.js', '!cu/**/*.js', '!de/**/*.js', '!gl/**/*.js', '!lp/**/*.js', '!ma/**/*.js', '!prs/**/*.js', '!dist/**', '!node_modules/**'],
}
/**
 * @description: 清除方法
 */
function clean() {
  log('清除之前的dist文件夹...')
  return del([conf.output])
}
/**
 * @description: 复制其他文件方法
 */
function copy() {
  log('正在拷贝其他资源...')
  return src(conf.copyFileset).pipe(dest(conf.output))
}
/**
 * @description: 压缩JS方法
 */
function buildJS() {
  let fileset = conf.baseFileset
  fileset.unshift('**/*.js')
  log('开始处理js文件...')
  return src(fileset)
    .pipe(
      babel({presets: ['@babel/preset-env']})
    )
    .pipe(uglify())
    .pipe(dest(conf.output))
}
/**
 * @description: 压缩JS并附带js源码的sourcemap
 */
function buildJSWithSRC() {
  let fileset = conf.baseFileset
  fileset.unshift('**/*.js')
  log('开始处理js文件...')
  return src(fileset)
    .pipe(sourcemaps.init())
    .pipe(
      babel({presets: ['@babel/preset-env']})
    )
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(conf.output))
}

log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  log('以生产模式构建...')
  exports.default = series(clean, copy, buildJS);
} else if(process.env.NODE_ENV === 'devbuild') {
  log('以对比源码模式构建...')
  exports.default = series(clean, copy, buildJSWithSRC);
} else {
  log('以开发模式构建...')
  exports.default = series(clean, copy);
}