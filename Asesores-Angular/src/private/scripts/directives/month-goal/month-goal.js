(function(){
    "use strict";

    function monthGoal($uibModal, $timeout){

        function link(scope, element){

            // Watch for changes
            scope.$watch('monthGoalWidget.details.data', function(){
                if(scope.monthGoalWidget.details.data){

                    $timeout(function(){
                        var widget = scope.monthGoalWidget.details.data,
                            bar = element.find('.percent'),
                            label = bar.find('> strong');

                        bar.removeClass('negative');
                        widget.label_pos = bar.find('> div').width() - ( label.width() / 2 );

                        if(widget.percentage <= 0){
                            bar.addClass('negative');
                        }

                        if(label.width() >= bar.find('> div').width()){
                            widget.label_pos = 0;
                        }

                        if(widget.label_pos + label.width() > bar.width()){
                            widget.label_pos = bar.width() - ( label.width() );
                        }
                    });

                }
            });

        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/month-goal/month-goal.html',
            link: link,
            controller: 'monthGoalCtrl',
            controllerAs: 'monthGoalWidget'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'monthGoal', monthGoal );

} )();