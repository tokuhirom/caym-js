(function( Caym ) {
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

})( Caym );
