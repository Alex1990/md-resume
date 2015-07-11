var fs = require('fs');
var path = require('path');
var vfs = require('vinyl-fs');
var through = require('through2');
var marked = require('marked');
var fm = require('front-matter');
var _ = require('lodash');
var template = _.template;

function renderMarkdown(content, opts) {
  var renderer = new marked.Renderer();
  renderer.heading = function(text, level) {
    var escapedText = encodeURIComponent(text);
    return '<h' + level + '><a id="' + escapedText +
        '" class="anchor" href="#' + escapedText +
        '"><span class="header-link"></span></a>' +
        text + '</h' + level + '>\n';
  };
  return marked(content, _.assign({}, { renderer: renderer }, opts));
}

function parsePath(filePath) {
  var extname = path.extname(filePath);
  return {
    dirname: path.dirname(filePath),
    basename: path.basename(filePath, extname),
    extname: extname
  };
}

function rename(file, opts) {
  var parsedPath = parsePath(file.relative);
  var newPath;

  if (typeof opts === 'string' && opts !== '') {
    newPath = opts;
  }
  else if (typeof opts === 'object' && opts != null) {
    var dirname = 'dirname' in opts ? opts.dirname : parsedPath.dirname;
    var basename = 'basename' in opts ? opts.basename : parsedPath.basename;
    var extname = 'extname' in opts ? opts.extname : parsedPath.extname;

    newPath = path.join(dirname, basename + extname);
  } else {
    throw 'Unsupported options';
  }

  file.path = newPath;
  return file;
}

function copyStatic(theme) {
  var themeDir = './theme/' + theme;

  vfs.src([themeDir + '/*/*.*'])
    .pipe(vfs.dest('./public/' + theme));
}

exports.render = function(options) {
  options = _.assign({}, options);

  vfs.src('./source/*.md')
    .pipe(through.obj(function(file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      if (file.isStream()) {
        cb(new Error('Streaming not supported'));
        return;
      }

      try {
        var content = fm(String(file.contents));
        var theme = content.attributes.theme || 'default';
        var themePath = path.join('./theme', theme, 'index.html');
        var that = this;

        copyStatic(theme);

        fs.readFile(themePath, function(err, themeFile) {
          if (err) throw err;

          var tpl = template(themeFile.toString());
          var data = _.assign({}, file.data, content.attributes, { content: renderMarkdown(content.body) });

          file.contents = new Buffer(tpl(data, options));
          file = rename(file, _.assign({}, { dirname: './public', extname: '.html' }, options));

          that.push(file);
        });

      } catch (err) {
        throw err;
      }
    }))
    .pipe(vfs.dest('./public'));
};
