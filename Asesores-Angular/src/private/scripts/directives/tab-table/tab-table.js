(function(){
    "use strict";

    function tabTable( $compile ){

        function link( scope, element, attrs, ctrl, transclude ){


            var $table = null;
            var totalCols = null;
            var rate = 100;
            var lastClick = Date.now() - rate;


            function setup () {
                buildTemplate();
                setupVars();
            }


            function buildTemplate () {
                transclude(scope, function(clone, scope) {
                    if( !scope.order ) {
                        $(clone).find('tbody tr').attr("ng-repeat", "item in data");
                    }

                    if( scope.numberRowByPag ) {
                        $(clone).find('tbody tr').attr( 'ng-show', '$index >= ((currentPagination - 1) * numberRowByPag)  && $index < (numberRowByPag * currentPagination) ');

                    }
                    if( scope.order ) {
                        $(clone).find('tbody tr').attr("ng-repeat", "item in data | orderBy: groupOrder");
                        $(clone)
                            .find('thead th')
                            .each( function() {
                                $(this).attr('ng-click', "orderBy('" + $(this).attr('orderBy') + "')" );
                                $(this).append( "<span class='icon glyphicon glyphicon-triangle-bottom' ng-show='groupOrder.indexOf(&quot;" + $(this).attr('orderBy') + "&quot;) >= 0'></span>" );
                                $(this).append( "<span class='icon glyphicon glyphicon-triangle-top' ng-show='groupOrder.indexOf(&quot;-" + $(this).attr('orderBy') + "&quot;) >= 0'></span>" );
                            });
                    }


                    var templateTable = "";
                    clone.each( function( _index, _element) {
                        templateTable += _element.outerHTML || '';
                    });

                    element.find('.content-table').prepend( templateTable );
                    $compile( element.contents() )(scope);
                });
            }


            function setupVars () {
                $table = $(element).find('table');
                totalCols = $table.find('thead tr th').length;

                scope.data = [];
                scope.showTable = false;
                scope.order = scope.order || null;
                scope.groupOrder = [];

                scope.currentTab = 1;
                scope.numberColsByTab = scope.numberColsByTab || null;
                scope.labelButtonBackTab = scope.labelButtonBackTab || null;
                scope.labelButtonNextTab = scope.labelButtonNextTab || null;
                scope.totalTabs = Math.ceil(totalCols / scope.numberColsByTab );


                scope.currentPagination = 1;
                scope.numberRowByPag = scope.numberRowByPag || null;
                scope.totalPaginations = null;

            }

            scope.setData = function ( _data ) {

                if( scope.numberRowByPag ) {
                    scope.totalPaginations = Math.ceil( _data.length / scope.numberRowByPag );
                }

                if( scope.numberColsByTab ) {
                    setFormatTable();
                }

                scope.data = _data;
                scope.showTable = true;
            };


            function setFormatTable ( ) {

                setTimeout( function () {

                    $table
                        .find('thead tr th')
                        .filter( function ( _index ) {
                            return isVisibleElement(_index);
                        })
                        .show();


                    $table
                        .find('thead tr th')
                        .filter( function ( _index ) {
                            return !isVisibleElement(_index);
                        })
                        .hide();

                    var elementsShowBody = [];
                    var elementsHideBody = [];

                    $table
                        .find('tbody tr')
                        .each( function () {
                            $(this)
                                .find('td')
                                .each( function ( _index, _element ) {
                                    isVisibleElement(_index) ? elementsShowBody.push(_element) : elementsHideBody.push(_element);
                                });
                        });

                    $(elementsShowBody).show();
                    $(elementsHideBody).hide();
                });
            }


            function isVisibleElement ( _index ) {
                return ((scope.numberColsByTab * ( scope.currentTab - 1) ) <= _index  && _index < (scope.numberColsByTab * scope.currentTab ));
            }



            scope.backTab = function () {
                if( Date.now() - lastClick >= rate ) {
                    scope.currentTab--;
                    setFormatTable();
                    lastClick = Date.now();
                }
            };


            scope.nextTab = function () {
                if( Date.now() - lastClick >= rate ) {
                    scope.currentTab++;
                    setFormatTable();
                    lastClick = Date.now();
                }
            };

            scope.nextPagination = function () {
                scope.goPagination( scope.currentPagination + 1 );
            };

            scope.backPagination = function () {
                scope.goPagination( scope.currentPagination - 1 );
            };


            scope.goPagination = function ( _pagination ) {
                scope.currentPagination = _pagination;
            };


            scope.orderBy = function ( _property ) {
                if( scope.groupOrder.indexOf( _property ) >= 0 ) {
                    scope.groupOrder[ scope.groupOrder.indexOf( _property ) ] = '-' + _property;
                    return;
                }

                if( scope.groupOrder.indexOf( '-' + _property ) >= 0 ) {
                    scope.groupOrder[ scope.groupOrder.indexOf( '-' + _property ) ] = _property;
                    return;
                }

                scope.groupOrder.push( _property );

                if( scope.groupOrder.length >= 3 ) {
                    scope.groupOrder.shift();
                }
            };


            setup();
        }


        return {
            restrict: 'EA',
            transclude: true,
            // replace: true,
            template:   "<div class='container-tab-table' ng-show='showTable'> " +
                            "<div class='button-back-tab' ng-click='backTab()' ng-show='numberColsByTab && currentTab > 1'>" +
                                "<span class='icon glyphicon glyphicon-triangle-left'></span>" +
                                "<span class='text' ng-if='labelButtonBackTab'>{{labelButtonBackTab}}</span>" +
                            "</div> " +
                            "<div class='content-table'>" +
                                "<div class='no-results' ng-show='data.length === 0'>" +
                                    "<img src='img/bg/binnacle-empty-state.svg' />" +
                                    "<p><strong> No se encontraron </strong>resultados con esta<br/>búsqueda. Vuelve a intentar otro dato.</p>" +
                                "</div>" +
                            "</div> " +
                            "<div class='button-next-tab' ng-click='nextTab()' ng-show='numberColsByTab && currentTab < totalTabs'>" +
                                "<span class='text' ng-if='labelButtonNextTab'>{{labelButtonNextTab}}</span>" +
                                "<span class='icon glyphicon glyphicon-triangle-right'></span>" +
                            "</div>" +
                            "<div class='pagination' ng-if='numberRowByPag'>" +
                                "<button class='back-pagination' ng-click='backPagination()' ng-disabled='currentPagination <= 1'><span class='glyphicon glyphicon-chevron-left'></span></button>" +
                                "<span class='list-pagination' ng-repeat='i in [] | range:totalPaginations' ng-click='goPagination(i+1)' ng-class='{active: $index + 1 === currentPagination}'>{{i + 1}}</span>" +
                                "<button class='next-pagination' ng-click='nextPagination()' ng-disabled='currentPagination >= totalPaginations'><span class='glyphicon glyphicon-chevron-right'></span></button>" +
                            "</div>" +
                            "<span class='note-tabs' ng-if='numberColsByTab && totalTabs > 1'>* Para <strong> VER el resto </strong> de la tabla, da clic en <strong class='text-button-next-tab'> <span class='icon glyphicon glyphicon-triangle-right' ng-if='!labelButtonNextTab'></span>{{labelButtonNextTab}}. </strong> </span>" +
                        "</div>",
            scope: {
                labelButtonBackTab: '@',
                labelButtonNextTab: '@',
                numberColsByTab: '=?',
                numberRowByPag: '=?',
                setData: '=',
                order: "=?"
            },
            link:link
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'tabTable', tabTable );


} )();
