
describe('MainCtrl test', () => {

    beforeEach(module('actinver.controllers'))
    // beforeEach(angular.mock.module("app"))

    var MainCtrl, scope;

    beforeEach( () =>{

        module('ngStorage');
        inject( ($controller, $rootScope) => {
           scope = $rootScope.$new();
           MainCtrl = $controller('mainCtrl', {
               $scope: scope
           });
       })

   });

    describe('$scope', () => {

        it('init controller', () => {
            var obj = {}

            expect( scope.modelForView ).toEqual( obj );
        });

    });


});
