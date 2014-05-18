
var MooseWing = (typeof window !== 'undefined') ? window.MooseWing : require('../moosewing.js');

function runTests() {
  // Simple html
  getTemplate('html', output);

  // Variables
  getTemplate('variables', function(template) {

    output(template, {
      header: 'Data-header',
      paragraph: 'Data-paragraph'
    });

  });
}





var output = (function() {

  var count = 0;

  return function(template, data) {
    var html = MooseWing.render(template, data);

    // browser
    if (typeof window !== 'undefined') {
      var elem = document.createElement('div');
      elem.id = 'test' + count;
      elem.className = 'testcase'
      elem.innerHTML = html;
      document.body.appendChild(elem);
    }
    // node
    else {
      if (count++ > 0) {
        console.log('==========================')
      }
      console.log(html);
    }
  };
}());


function getTemplate(name, callback) {
  // browser
  if (typeof window !== 'undefined') {
    var url = 'templates/' + name + '.tpl';
    var xhr = new XMLHttpRequest();

    xhr.onerror = function() {
      throw url + ' could not be loaded';
    }
    xhr.onload = function() {
      callback(xhr.responseText);
    };

    xhr.open('get', url);
    xhr.send();
  }
  // node
  else {
    var fs = require('fs');
    var file = fs.readFileSync('templates/' + name + '.tpl', 'utf8');
    callback(file);
  }
}







runTests();