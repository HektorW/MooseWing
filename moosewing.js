;(function() {
  // Variables
  //  this
  //  paths
  //    foo.bar
  //    ../baz
  // HTML - escaped variables
  // Helpers
  //  if
  //  ifnot
  //  else
  //  each
  //    @index
  //    @key
  // User registered helpers
  // Comments
  // Log
  // (Utils)


  var MooseWing = {
    helpers: {}
  };


  MooseWing.registerHelper = function(name, helper) {
    MooseWing.helpers[name] = helper;
  };

  MooseWing.render = function(template, data) {
    var rgx = /[^{]{{()}}/g;
    var endrgx = / /;


    var res;
    while (res = rgx.exec(template)) {

    }

    /*var html = template.replace(/{{(.*)}}/g, function(match, group, offset, str) {
      return data[group] || 'could not match ' + group;
    });*/

    return html;
  };





  if (typeof define !== 'undefined' && define.amd)
    define([], function() { return MooseWing; });
  else if (typeof module !== 'undefined' && module.exports)
    module.exports = MooseWing;
  else
    window.MooseWing = MooseWing;
}());