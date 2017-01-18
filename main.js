$(document).ready(function(){
    function Calculator(){
        this.left = "";
        this.right = "";
        this.total = 0;
        this.mode = "right";
        this.display = {};
        this.currentOperator = {};
        this.init();
    }

    Calculator.prototype = {
        init: function() {
            var that = this;

            // Get the display element (that's out screen)
            // We will need it for later.
            this.display = $(".display .value");

            // jQuery attempts to find the class selector .numbers first.
            // Then for each element it finds, the each function executes
            // the anonymous function I hand it.
            $(".numbers").each(function(index, element){
                $(element).click(function(event){
                    // This prevents the browser from doing the action
                    // that this button would do. For example,
                    // if this button was in a form, it would submit
                    // the form if you did not have preventDefault.
                    event.preventDefault();

                    // The event is the browser telling us something
                    // happened. We set the event onClick above.
                    // Current Target would be what thing that
                    // got clicked since the function has
                    // no idea which of the many click handlers
                    // Were actually clicked.
                    var value = $(event.currentTarget).html();

                    that.updateState(value);
                });
            });
            $(".functions").each(function(index, element){
                element = $(element);

                element.click(function(event){
                    event.preventDefault();
                    // This will remove the pretty border on
                    // any of the functions. Since
                    // there is more than one function button,
                    // jQuery runs remove calls on all of the
                    // returned elements.
                    $(".functions").removeClass("selected");
                    element.addClass("selected");
                    var func = element.attr("id");

                    that.updateOperator(func);
                });
            });

            // jQuery Proxy resets the execution scope
            // to whatever I had it. I handed it the
            // current scope, so this will contain all
            // the functions we are outlining.
            $(".equals").click($.proxy(function(event){
                event.preventDefault();
                this.execute();
            }, this));

            $(".clear").click($.proxy(function(event){
                event.preventDefault();
                this.clear();
            }, this));
        },
        updateState: function(newState){
            // When you use the || (OR) operator during
            // variable assignment, it will evaluate it automagically
            // to an if statement. || operators short circuit starting from the left.
            // If newState evaluates to false (which undefined would set it to false)
            // then value would be set to 0.
            var value = newState || 0;
            var mode = this.mode;
            this[mode] = this[mode] + value.toString();
            this.mode = mode;
            this.display.html(this[mode]);
        },
        updateOperator: function(newOperator){
            switch(newOperator) {
                case "add":
                    this.currentOperator = function(left, right) {
                        return (left + right);
                    };
                    break;
                case "multiply":
                    this.currentOperator = function(left, right) {
                        return (left * right);
                    };
                    break;
                case "divide":
                    this.currentOperator = function(left, right) {
                        return (left / right);
                    };
                    break;
                case "substract":
                    this.currentOperator = function(left, right) {
                        return (left - right);
                    };
                    break;
            }
            this.mode = this.mode === "left" ? "right" : "left";
        },
        clear: function() {
            this.left = "";
            this.right = "";
            this.mode = "right";
            $(".functions").removeClass("selected");
            this.currentOperator = {};
            this.display.html("0");
        },
        execute: function(){
            var total = this.total || 0;

            // Call is a really interesting thing. What that did was set the execution scope to
            // Calculator and executed the function that was set in currentOperator with the arguments Left
            // and right.
            total = this.currentOperator.call(this, parseInt(this.left), parseInt(this.right));
            this.left = total.toString();
            this.display.html(total);
        }
    };

    var calculation = new Calculator();
});