;(function() {
  //    Variables
  //  *  this
  //  *  paths
  //  *    foo.bar
  //  *    ../baz
  //    HTML-escaped variables
  //    Helpers
  //  *  if
  //  *  unless
  //  *  else
  //  *  each
  //       @index
  //       @key
  //    User registered helpers
  //    Partials
  //    Comments
  //    Log
  //    (Utils)

  var TYPE_HTML = 'type_html',
      TYPE_VARIABLE = 'type_variable',
      TYPE_ELSE = 'type_else',
      TYPE_HELPER_OPEN = 'type_helper_open',
      TYPE_HELPER_CLOSE = 'type_helper_close';


  var MooseWing = {
    helpers: {},

    render: function(template, data) {
      var parts = MooseWing.parseParts(template);

      var scope = [data];

      var html = MooseWing.renderPart(scope, parts, 0);

      return html;
    },

    renderPart: function(scope, parts, start, end) {
      if (start >= parts.length || (typeof end !== 'undefined' && start >= end)) {
        return '';
      }

      var res = '';
      var part = parts[start];
      switch (part.type) {
        case TYPE_HTML:
          res = part.content;
          break;
        case TYPE_VARIABLE:
          res = MooseWing.getPathContent(scope, part.path);
          break;
        case TYPE_HELPER_OPEN:
          var closingIndex = MooseWing.getCloseIndex(parts, start + 1);
          res = MooseWing.renderHelper(scope, parts, start, closingIndex);
          start = closingIndex;
          break;
      }

      return res + MooseWing.renderPart(scope, parts, start + 1, end);
    },

    renderHelper: function(scope, parts, start, end) {
      if (end < start || parts[start].name !== parts[end].name) {
        throw 'Closing bracket does not match ' + parts[start].name;
      }

      var name = parts[start].name;
      var helper = MooseWing.helpers[name];
      var elseindex = MooseWing.getElseIndex(parts, start + 1, end);

      if (!helper) {
        throw 'No helper with name ' + name;
      }

      var ctx = scope[scope.length - 1];

      var f = function() {
        if (this !== ctx) {
          scope.push(this);
          var res = MooseWing.renderPart(scope, parts, start + 1, elseindex || end);
          scope.pop();
          return res;
        } else {
          return MooseWing.renderPart(scope, parts, start + 1, elseindex || end);
        }
      };

      var args = [f].concat(MooseWing.getPartArguments(scope, parts[start]));

      var res = helper.apply(ctx, args)
      if (res === null && elseindex) {
        res = MooseWing.renderPart(scope, parts, elseindex, end);
      }
      return res || '';
    },

    getPartArguments: function(scope, part) {
      var args = [];
      for (var i = 1; i < part.args.length; i++) {
        args.push(MooseWing.getPathContent(scope, part.args[i]));
      }
      return args;
    },

    getCloseIndex: function(parts, start) {
      var depth = 0;
      for (var i = start; i < parts.length; i++) {
        var type = parts[i].type;
        if (type === TYPE_HELPER_OPEN) {
          ++depth;
        } else if (type === TYPE_HELPER_CLOSE ) {
          if (depth-- === 0) {
            return i;
          }
        }
      }
      return -1;
    },

    getElseIndex: function (parts, start, end) {
      var depth = 0;
      for (var i = start, len = Math.min(end || Infinity, parts.length); i < len; i++) {
        var type = parts[i].type;
        switch (type) {
          case TYPE_HELPER_OPEN: ++depth; break;
          case TYPE_HELPER_CLOSE: --depth; break;
          case TYPE_ELSE:
            if (depth === 0) {
              return i;
            }
        }
      }
      return null;
    },

    parseParts: function(template) {
      var parts = [];
      var rgx = /(\{{2,3})([^\}]*)(\}{2,3})/g;

      var index = 0;
      var res;
      while ((res = rgx.exec(template)) !== null) {
        // add html part
        if (res.index > index) {
          parts.push({
            type: TYPE_HTML,
            content: template.substring(index, res.index),
            start: index,
            end: res.index
          });
        }

        var match = res[0],
            open = res[1],
            close = res[3],
            inside = res[2];

        var args = inside.split(' ');
        var action = args[0][0];

        var part = {
          match: match,
          start: res.index,
          end: res.index + match.length
        };

        switch (action) {
          case '#':
            part.type = TYPE_HELPER_OPEN;
            part.name = args[0].substr(1);
            part.args = args;
            break;
          case '/':
            part.type = TYPE_HELPER_CLOSE;
            part.name = args[0].substr(1);
             break;
          case '>':
            // partials
            break;
          default:
            if (args.length === 1) {
              if (args[0] === 'else') {
                part.type = TYPE_ELSE;
              } else {
                part.type = TYPE_VARIABLE;
                part.path = inside;
              }
            } else {
              part.type = TYPE_HELPER_OPEN;
            part.name = args[0];
            part.args = args;
            }
            break;
        }

        parts.push(part);

        index = res.index + match.length;
      }

      if (index < template.length) {
        parts.push({
          type: TYPE_HTML,
          content: template.substring(index),
          start: index,
          end: template.length
        });
      }

      return parts;
    },

    getPathContent: function(scope, selector) {
      var i = scope.length - 1;
      var rgx = /\.\.\//g;
      var res;
      var strI = 0;
      while ((res = rgx.exec(selector)) !== null) {
        --i;
        strI = res.index + 3;
      }

      var ctx = scope[i];
      if (!ctx) {
        throw 'Could not get ' + selector + ' from data passed in' ;
      }


      var parts = selector.substr(strI).split(/\.|\//);
      for (i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (part === 'this')
          continue;

        if (!ctx) {
          throw 'Could not get ' + selector + ' from data passed in' ;
        }

        ctx = ctx[parts[i]];
      }

      return ctx;
    },


    registerHelper: function(name, helper) {
      MooseWing.helpers[name] = helper;
    }

  };




  //////////////////////////
  // Add built-in helpers //
  //////////////////////////
  MooseWing.registerHelper('if', function(fn, flag) {
    if (flag) {
      return fn.call(this);
    }
    return null;
  });
  MooseWing.registerHelper('unless', function(fn, flag) {
    if (!flag) {
      return fn.call(this);
    }
    return null;
  });
  MooseWing.registerHelper('each', function(fn, collection) {
    if (!collection) {
      return null;
    }

    var res = '', i;
    if (collection.length === +collection.length) {
      for (i = 0; i < collection.length; i++) {
        res += fn.call(collection[i]);
      }
    } else {
      for (i in collection) {
        if (!collection.hasOwnProperty(i)) continue;
        res += fn.call(collection[i]);
      }
    }

    return res;
  });






  if (typeof define !== 'undefined' && define.amd)
    define([], function() { return MooseWing; });
  else if (typeof module !== 'undefined' && module.exports)
    module.exports = MooseWing;
  else
    window.MooseWing = MooseWing;
}());