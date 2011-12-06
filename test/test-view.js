module('view');

var is = equals;

var testwin = function(name, html, fn) {
	testwin[name] = load_offset_fixture(name);
	var interval = setInterval(function() {
		if (testwin[name] && testwin[name].$ && testwin[name].jQuery.isReady) {
			clearInterval(interval);
			test(name, function () {
                fn.call(this, testwin[name]);
            });
		}
	}, 0);
	
	function load_offset_fixture(name) {
		var win = window.open( "./" + html + ".html?num"+parseInt(Math.random()*1000), name, 'left=0,top=0,width=500,height=500,toolbar=1,resizable=0' );
		if ( !win ) { 
			alert("Please disable your popup blocker for the offset test suite");
			throw "Please disable your popup blocker for the offset test suite";
		}
		return win;
	}
};

test('new', function () {
    var View = Caym.View.extend({
    });
    var c = new View();
    ok(c instanceof View);
});
test('init', function () {
    var ret;
    var View = Caym.View.extend({
        init: function (x) {
            ret = 'initialized: ' + x;
        }
    });
    var c = new View('xxy');
    is(ret, 'initialized: xxy');
});
test('methods', function () {
    var View = Caym.View.extend({
        mymethod: function () { }
    });
    var c = new View('xxy');
    ok(c.mymethod instanceof Function);
});
testwin('$', 'view', function (win) {
    with ({'$':win.$}) {
        var ret;
        is($('body').length, 1);
        var View = Caym.View.extend({
            el: $('body')
        });
        var c = new View();
        ok(c.$);
        is(c.$().length, 1);
        is(c.$()[0].tagName.toLowerCase(), 'body');
        is(c.$('div')[0].tagName.toLowerCase(), 'div');
        win.close();
    }
});
testwin('events', 'view', function (win) {
    with ({'$': win.$}) {
        var ret = [];
        is($('body').length, 1);
        var View = Caym.View.extend({
            el: $('body'),
            events: {
                '.btn': {
                    click: 'onClickBtn'
                }
            },
            onClickBtn: function (e) {
                ret.push([this, e]);
            }
        });
        var c = new View();
        $('.btn').click();
        is(ret.length, 1);
        ok(ret[0][0] instanceof View, 'bind');
        is(ret[0][1].type, 'click');
        is(ret[0][1].target.tagName.toLowerCase(), 'div');
        win.close();
    }
});
testwin('elements', 'view', function (win) {
    with ({'$':win.$}) {
        var ret = [];
        var View = Caym.View.extend({
            el: $('body'),
            elements: {
                '.btn': 'btn'
            }
        });
        var c = new View();
        is(c.btn.data('foo'), 'bar');
        win.close();
    }
});
