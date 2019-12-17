describe('The test percentage filter, this filter have 3 parameters: input,decimal and suffix ', function () {
    'use strict';

    var $filter;

    beforeEach(function () {
        module('percentage');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });


    it('if inptu equal to null', function () {
        // Arrange.
        var input = null;

        // Act.
        var filter = $filter('percentage')( input );

        // Assert.
        expect( filter ).toEqual( '0%' );
    });


    it('if inptu equal to 0, returns 0', function () {
        // Arrange.
        var input = 0;

        // Act.
        var filter = $filter('percentage')( input );

        // Assert.
        expect( filter ).toEqual( '0%' );
    });


    it('if inptu less to 0', function () {
        // Arrange.
        var input = -.11;

        // Act.
        var filter = $filter('percentage')( input );

        // Assert.
        expect( filter ).toEqual( '-11%' );
    });


    it('if input equal to .115, returns 11.5%', function () {
        // Arrange.
        var input = .115;

        // Act.
        var filter = $filter('percentage')( input );

        // Assert.
        expect( filter ).toEqual( '11.5%' );
    });


    it('if input equal to .1156766 and decimals equal to 3, returns 11.568%', function () {
        // Arrange.
        var input = .1156766;

        // Act.
        var filter = $filter('percentage')( input, 3 );

        // Assert.
        expect( filter ).toEqual( '11.568%' );
    });


    it('if input equal to .1156 and suffix equal to $, returns $11.56%', function () {
        // Arrange.
        var input = .1156;

        // Act.
        var filter = $filter('percentage')( input, 2, '$' );

        // Assert.
        expect( filter ).toEqual( '11.56$' );
    });


});
