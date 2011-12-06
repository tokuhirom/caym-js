(function () {
    var global = this;

    var Caym;
    if (typeof exports !== 'undefined') {
        Caym = exports;
    } else {
        Caym = global.Caym = {};
    }


    var namedParam    = /:([\w\d]+)/g;
    var splatParam    = /\*([\w\d]+)/g;
    var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

    var toString = Object.prototype.toString;

    function Dispatcher() {
        this.routes = [];
    }
    Dispatcher.prototype = {
        register: function(route, callback) {
            if (!toString.call(route) == '[object regexp]') {
                route = this._routeToRegExp(route);
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
        _routeToRegExp : function(route) {
            route = route.replace(escapeRegExp, "\\$&")
                         .replace(namedParam, "([^\/]*)")
                         .replace(splatParam, "(.*?)");
            return new RegExp('^' + route + '$');
        }
    };
    Caym.Dispatcher = Dispatcher;

})();
