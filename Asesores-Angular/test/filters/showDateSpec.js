describe('show date filter', function () {
    'use strict';

    var $filter;

    beforeEach(function () {


        module('actinver.filters');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });


    it('data equal to null', function () {
        var date = null;
        var result= '';

        // Act.
        var filter = $filter('showAsDate')( date );

        // Assert.
        expect( filter ).toEqual(  result );
    });

    it('date equal to 20150618', function () {
        var date = '20150618';
        var result= '18/06/2015';

        // Act.
        var filter = $filter('showAsDate')( date );

        // Assert.
        expect( filter ).toEqual(  result );
    });

});
