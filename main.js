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
            this.display = $(".display .value");
            $(".numbers").each(function(index, element){
                $(element).click(function(event){
                    event.preventDefault();
                    var value = $(event.currentTarget).html();

                    that.updateState(value);
                });
            });
            $(".functions").each(function(index, element){
                element = $(element);

                element.click(function(event){
                    event.preventDefault();
                    $(".functions").removeClass("selected");
                    element.addClass("selected");
                    var func = element.attr("id");

                    that.updateOperator(func);
                });
            });

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
            this.left = "0";
            this.right = "0";
            this.mode = "right";
            $(".functions").removeClass("selected");
            this.currentOperator = {};
            this.display.html("0");
        },
        execute: function(){
            var total = this.total || 0;
            total = this.currentOperator.call(this, parseInt(this.left), parseInt(this.right));
            this.left = Object.toString(total);
            this.display.html(total);
        }
    };

    var calculation = new Calculator();
});