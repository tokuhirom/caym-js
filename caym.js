(function () {
    var global = this;

    var Caym;
    if (typeof exports !== 'undefined') {
        Caym = exports;
    } else {
        Caym = global.Caym = {};
    }

    Caym.version = '1.0.0';


    var namedParam    = /:([\w\d]+)/g;
    var splatParam    = /\*([\w\d]+)/g;
    var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

    // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
    var toString = Object.prototype.toString;
    function isRegExp(obj) {
        return toString.call(obj)=='[object RegExp]';
    }

    function Dispatcher() {
        this.routes = [];
    }
    Dispatcher.prototype = {
        register: function(route, callback) {
            if (!isRegExp(route)) {
                route = this._compileRoute(route);
            }
            this.routes.push([route, callback]);
        },
        dispatch: function (path) {
            var routes = this.routes;
            for (var i=0, l=routes.length; i<l; i++) {
                var route = this.routes[i][0];
                var callback = this.routes[i][1];
                var matched = route.exec(path);
                if (matched) {
                    var args = matched.slice(1);
                    callback.apply(this, args);
                }
            }
        },
        _compileRoute : function(route) {
            route = route.replace(escapeRegExp, "\\$&").replace(namedParam, "([^\/]*)").replace(splatParam, "(.*?)");
            return new RegExp('^' + route + '$');
        }
    };
    Caym.Dispatcher = Dispatcher;


    // @requires=jquery

    function View() {
        var self = this;
        if (this.elements) {
            $.each(this.elements, function (selector, key) {
                self[key] = self.$(selector);
            });
        }
        if (this.events) {
            $.each(this.events, function (selector, inner) {
                $.each(inner, function (eventName, method_name) {
                    self.$(selector).bind(eventName, $.proxy(self[method_name], self));
                });
            });
        }
        this.init.apply(this, arguments);
    }
    View.extend = function (c) {
        function inherit(parent, c) {
            var f = function (){
                parent.apply(this, arguments);
            };
            $.extend(f.prototype, parent.prototype);
            if (c) {
                $.extend(f.prototype, c);
            }
            f.prototype.__super__ = parent.prototype;
            f.prototype.__super__.constructor = parent;
            f.prototype.constructor = c;
            return f;
        }
        return inherit(this, c);
    };
    View.prototype = {
        init: function () { }, /* placeholder */
        $: function (selector) {
            return (arguments.length === 0 || selector === null) ? $(this.el) : $(selector, this.el);
        }
    };
    Caym.View = View;


})();
