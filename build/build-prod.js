const { src, dest, parallel, watch } = require("gulp");
const less = require("gulp-less");
const minifyCSS = require("gulp-csso");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const clean = require("gulp-clean");

const output = "../lib/";

const fileSuffix = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "ico",
  "bmp",
  "webm",
  "avi",
  "mp4",
  "mp3",
  "flv",
  "mov",
];

function html() {
  return src("../src/**/*.wxml").pipe(dest(output));
}

function json() {
  return src("../src/**/*.json").pipe(dest(output));
}

function assets() {
  return src(`../src/**/*.{${fileSuffix.join(",")}}`).pipe(dest(output));
}

function css() {
  return src("../src/**/*.less")
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({ extname: ".wxss" }))
    .pipe(dest(output));
}

function js() {
  return src("../src/**/*.js").pipe(uglify()).pipe(dest(output));
}

exports.default = parallel(html, css, js, json, assets);
