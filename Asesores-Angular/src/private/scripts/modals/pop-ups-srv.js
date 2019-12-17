(function () {
    'use strict';
    function popups() {
        var states = {};

        $.notify.addStyle('error', {
            html: "<div> <span data-notify-text/> </div>",
            classes: {
                base: {
                    "background-color": "white",
                    "padding": "5px",
                    "border": "2px solid #FA596D",
                    "border-radius": "5px",
                    "max-width":"300px"
                    
                },
                superblue: {
                    "color": "white",
                    "background-color": "blue"
                }
            }
        });

        $.notify.addStyle('warning', {
            html: "<div> <span data-notify-text/> </div>",
            classes: {
                base: {
                    "background-color": "white",
                    "padding": "5px",
                    "border": "2px solid #ffba3a",
                    "border-radius": "5px",
                    "max-width":"300px"
                },
                superblue: {
                    "color": "white",
                    "background-color": "blue"
                }
            }
        });

        $.notify.addStyle('done', {
            html: "<div> <span data-notify-text/> </div>",
            classes: {
                base: {
                    "background-color": "white",
                    "padding": "5px",
                    "border": "2px solid #00be66",
                    "border-radius": "5px",
                    "max-width":"300px"
                },
                superblue: {
                    "color": "white",
                    "background-color": "blue"
                }
            }
        });

        $.notify.addStyle('info', {
            html: "<div> <span data-notify-text/> </div>",
            classes: {
                base: {
                    "background-color": "white",
                    "padding": "5px",
                    "border": "2px solid #337ab7",
                    "border-radius": "5px",
                    "max-width":"300px"
                },
                superblue: {
                    "color": "white",
                    "background-color": "blue"
                }
            }
        });


        states.warning = function (message, config) {
            config= config||{};
            config.style='warning';
            //config.className= 'superblue'
            $.notify(message,  config);
        };
        states.done = function (message, config) {
            config= config||{};
            config.style='done';
            //config.className= 'superblue'
            $.notify(message,  config);
        };

        states.info = function (message, config) {
            config= config||{};
            config.style='info';
            //config.className= 'superblue'
            $.notify(message,  config);
        };
        states.error = function (message, config) {
            config= config||{};
            config.style='error';
            //config.className= 'superblue'
            $.notify(message,  config);
        };
        return states;
    }
    angular.module( 'actinver.services' )
    .service( 'popupsSrv', popups );
})();