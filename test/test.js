
var MooseWing = (typeof window !== 'undefined') ? window.MooseWing : require('../moosewing.js');

function runTests() {
  // Simple html
  getTemplate('html', output);

  // Variables
  getTemplate('variables', function(template) {

    output(template, {
      header: 'Variable header',
      paragraph: 'Variable paragraph'
    });

  });

  getTemplate('paths', function(template) {

    output(template, {
      header: 'Article unikum',
      article: {
        content: 'Bacon lorem majonäsum',
        date: '2014-05-18',
        author: {
          firstname: 'Hektor',
          lastname: 'Wallin'
        }
      }
    });    

  });

  getTemplate('if', function(template) {
    output(template, {
      flag: true
    });
    output(template, {
      flag: false
    });
  });

  getTemplate('unless', function(template) {
    output(template, {
      flag: true
    });
    output(template, {
      flag: false
    });
  });


  getTemplate('each', function(template) {
    output(template, {
      items: [{
        name: 'Name 1'
      }, {
        name: 'Name 2'
      }]
    });
  });

  getTemplate('nestedeach', function(template) {
    output(template, {
      items: [{
        name: 'Sub 1',
        subitems: [{
          name: 'Sub 1.1'
        }, {
          name: 'Sub 1.2'
        }]
      }, {
        name: 'Sub 2',
        subitems: [{
          name: 'Sub 2.1'
        }, {
          name: 'Sub 2.2'
        }]
      }]
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

    xhr.open('get', url, false);
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