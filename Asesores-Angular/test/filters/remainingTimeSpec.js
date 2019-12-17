describe('remainingTime filter', function () {
    'use strict';

    var $filter;

    beforeEach(function () {
        module('actinver.filters');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });


    it('if inptu equal to null', function () {
        // Arrange.
        var input = null;

        // Act.
        var filter = $filter('remainingTime')( input );

        // Assert.
        expect( filter ).toEqual( '00:00' );
    });


    it('if inptu equal to 1200', function () {
        // Arrange.
        var input = 1200;

        // Act.
        var filter = $filter('remainingTime')( input );

        // Assert.
        expect( filter ).toEqual( '20:00' );
    });


});
