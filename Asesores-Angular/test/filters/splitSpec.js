describe('split filter', function () {
    'use strict';

    var $filter;

    beforeEach(function () {
        module('actinver.filters');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });


    it('if inptu equal to null then the filter rerunt ""', function () {
        // Arrange.
        var input = null;

        // Act.
        var filter = $filter('split')( input );

        // Assert.
        expect( filter ).toEqual( '' );
    });


    it('if inptu equal to "hola como estas" and splitChar equalt to " " and splitIndex equal to "1" then the filter return "como"', function () {
        // Arrange.
        var input = 'hola como estas';

        // Act.
        var filter = $filter('split')( input, ' ', 1 );

        // Assert.
        expect( filter ).toEqual( 'como' );
    });




});
