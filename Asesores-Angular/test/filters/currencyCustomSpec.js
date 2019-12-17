describe('currencyCustom filter, this filter cut the size of the number to 2, 3 or n decimals, its parameters are value and size', () => {
    'use strict';

    var $filter;

    beforeEach(function () {


        module('actinver.filters');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('If value is equal to null, this filter returns null', () => {
        // Arrange.
        let word = null, result;

        // Act.
        result = $filter('currencyCustom')( word );

        // Assert.
        expect( result ).toEqual( null );
    });


    it('If value is equal to text, this filter returns null', () => {
        // Arrange.
        let word = 'hello world', result;

        // Act.
        result = $filter('currencyCustom')( word );

        // Assert.
        expect( result ).toEqual( null );
    });


    it('If value is equal to 11700, this filter returns the same value', () => {
        let word = 11700, result;

        // Act.
        result = $filter('currencyCustom')( word );


        // Assert.
        expect( result ).toEqual( '11700' );
    });



    it('If value is equal to 11700.5296, this filter returns 11700.52', () => {
        let word = 11700.5296, result;

        // Act.
        result = $filter('currencyCustom')( word );


        // Assert.
        expect( result ).toEqual( '11700.52' );
    });


    it('If value is equal to 11700.5296 and size equal to 3, this filter returns 11700.529', () => {
        let word = 11700.5296, result;

        // Act.
        result = $filter('currencyCustom')( word, 3 );


        // Assert.
        expect( result ).toEqual( '11700.529' );
    });



});
