describe('The test capitalize filter', function () {
    'use strict';

    var $filter;

    beforeEach(function () {


        module('actinver.filters');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should capitalize a string', function () {
        // Arrange.
        var word = null;
        var result;

        // Act.
        result = $filter('capitalize')( word );

        // Assert.
        expect( result ).toEqual( '' );
    });


    it('should capitalize a string', function () {
        // Arrange.
        var word = 'hello world', result;

        // Act.
        result = $filter('capitalize')( word );

        // Assert.
        expect( result ).toEqual('Hello world');
    });
});
