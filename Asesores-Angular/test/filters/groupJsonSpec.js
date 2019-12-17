describe('The test groupJSON filter', function () {
    'use strict';

    var $filter;

    beforeEach(function () {


        module('actinver.filters');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });



    it('when array equal to null', function () {
        // Arrange.
        var init = null;
        var result =[];

        // Act.
        var filter = $filter('groupJSON')( init, 'market' );

        // Assert.
        expect( filter ).toEqual( result );
    });


    it('Group an array by key "market"', function () {
        // Arrange.
        var init = [ { id:1, market:'SD' }, { id:2, market:'SD' }, {id:3, market:'MC'}];
        var result ={
            SD:[
                { id:1, market:'SD' }, { id:2, market:'SD' }
            ],
            MC:[
                {id:3, market:'MC'}
            ]
        } ;

        // Act.
        var filter = $filter('groupJSON')( init, 'market' );

        // Assert.
        expect( filter ).toEqual( result );
    });


    it('Group an array by key "id"', function () {
        // Arrange.
        var init = [ { id:1, market:'SD' }, { id:2, market:'SD' }, {id:3, market:'MC'}];
        var result ={
            1:[
                { id:1, market:'SD' }
            ],
            2:[
                { id:2, market:'SD' }
            ],
            3:[
                {id:3, market:'MC'}
            ]
        } ;

        // Act.
        var filter = $filter('groupJSON')( init, 'id' );

        // Assert.
        expect( filter ).toEqual( result );
    });


});
