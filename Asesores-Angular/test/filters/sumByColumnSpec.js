describe('sumByColumn filter', function () {
    'use strict';

    var $filter;

    beforeEach(function () {
        module('actinver.filters');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });


    it('if collection equal to null then the filter return null', function () {
        // Arrange.
        var collection = null;

        // Act.
        var filter = $filter('sumByColumn')( collection );

        // Assert.
        expect( filter ).toEqual( null );
    });


    it('if collection equal to array and column equal to null then the filter return some number', function () {
        // Arrange.
        var collection = [
            {
                value: 50,
            },
            {
                value: 100,
            },
            {
                value: 150,
            },
        ];
        var column = null

        // Act.
        var filter = $filter('sumByColumn')( collection,  column );

        // Assert.
        expect( filter ).toEqual( null );
    })


    it('if collection equal to array and column equal to "value" then the filter return some number', function () {
        // Arrange.
        var collection = [
            {
                value: 50,
            },
            {
                value: 100,
            },
            {
                value: 150,
            },
        ];
        var column = 'value';

        // Act.
        var filter = $filter('sumByColumn')( collection, column );

        // Assert.
        expect( filter ).toEqual( 300 );
    })





});
