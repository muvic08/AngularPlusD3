(function () {
    'use strict';

    // create the angular app
    angular.module('app', [
        'app.controllers',
        'app.directives'
    ]);

    // setup dependency injection
    angular.module('d3', []);
    angular.module('app.controllers', []);
    angular.module('app.directives', ['d3']);


}());