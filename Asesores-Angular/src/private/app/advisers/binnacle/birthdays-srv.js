(function () {
    'use strict';

    function binnacleBirthdaysSrv(URLS, $q, $http, $filter, moment, ErrorMessagesSrv, csrfSrv) {

        function getListaFechas() {
            var listaDates = {
                today: [],
                nextWeek: [],
                lastWeek: []
            };
            //rellenamos la lista de Hoy
            listaDates.today.push({
                fecha: moment().valueOf(),
                records: [{ isHeader: true, fecha: moment().valueOf() }]
            });

            for (var i = 1; i < 8; i++) {
                //Rellenamos la Lista de 7 dias despues y
                listaDates.nextWeek.push({
                    fecha: moment().add(i, 'days').valueOf(),
                    records: [{ isHeader: true, fecha: moment().add(i, 'days').valueOf() }]
                });
                //Rellenamos la lista de 7 dias antes
                listaDates.lastWeek.push({
                    fecha: moment().subtract(i, 'days').valueOf(),
                    records: [{ isHeader: true, fecha: moment().subtract(i, 'days').valueOf() }]
                });
            }

            return listaDates;
        }

        var obj = {

            /**
             * Get binnacle birthday list
             * @param {string} employee - ID of current employee             
             * @return  {object}
             */
            getInfo: function (employee) {

                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getBirthDays + employee,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {                        
                        if (typeof response !== 'undefined' && response.data.status === 1) {
                            resolve({ success: true, data: obj.setBirthday(getListaFechas(), response.data.result), finish: true });
                        } else {
                            reject({ success: false, data: obj.setBirthday(getListaFechas(), []), finish: true });
                        }
                    }, function error() {
                        reject({ success: false, data: obj.setBirthday(getListaFechas(), []), finish: true });
                    });
                });
            },

            /**
             * Set birthday information in a single date object
             * @param {array} info - Birthdays information
             * @param {object} dates - Object with range of dates
             * @return  {object}
             */
            setBirthday: function (listaDates, listBirthday) {
                var i = 0, j = 0;
                var flag = { hasBirhtdayToday: false, hasBirthdayLastweek: false, hasBirthdayNextweek: false };
                //dia actual                
                for (i = 0; (angular.isArray(listBirthday.currentWeek)) && (i < listBirthday.currentWeek.length); i++) {
                    for (j = 0; j < listaDates.today.length; j++) {
                        if (moment(listBirthday.currentWeek[i].birthDate).format('DD/MM') === moment(listaDates.today[j].fecha).format('DD/MM')) {
                            listaDates.today[j].records.push(Object.assign(listBirthday.currentWeek[i], { isHeader: false }));
                            flag.hasBirhtdayToday = true;
                        }
                    }
                }
                //Semana pasada                
                for (i = 0; (angular.isArray(listBirthday.lastWeek)) && (i < listBirthday.lastWeek.length); i++) {
                    for (j = 0; j < listaDates.lastWeek.length; j++) {
                        if (moment(listBirthday.lastWeek[i].birthDate).format('DD/MM') === moment(listaDates.lastWeek[j].fecha).format('DD/MM')) {
                            listaDates.lastWeek[j].records.push(Object.assign(listBirthday.lastWeek[i], { isHeader: false }));
                            j = listaDates.lastWeek.length;
                            flag.hasBirthdayLastweek = true;
                        }
                    }
                }
                //Semana Siguiente                
                for (i = 0; (angular.isArray(listBirthday.nextWeek)) && (i < listBirthday.nextWeek.length); i++) {
                    for (j = 0; j < listaDates.nextWeek.length; j++) {
                        if (moment(listBirthday.nextWeek[i].birthDate).format('DD/MM') === moment(listaDates.nextWeek[j].fecha).format('DD/MM')) {
                            listaDates.nextWeek[j].records.push(Object.assign(listBirthday.nextWeek[i], { isHeader: false }));
                            j = listaDates.nextWeek.length;
                            flag.hasBirthdayNextweek = true;
                        }
                    }
                }
                return { lista: listaDates, flag: flag };
            },


            /**
             * Send congratulations
             * @param {object} info - message information
             * @return  {object}
             */
            sendMessage: function (_info) {
                return $q(function (resolve, reject) {

                    console.info("MODEL:", _info);

                    csrfSrv.csrfValidate()
                        .then(successCsrf)
                        .catch(errorCsrf);

                    function successCsrf() {
                        $http({
                            method: 'POST',
                            url: URLS.sendMessangeBirthday,
                            data: $.param(_info),
                        }).then(function (_res) {
                            resolve(_res.data);
                        });
                    }

                    function errorCsrf(error) {
                        reject(error);
                    }
                });

            }

        };

        return obj;

    }

    angular.module('actinver.services')
        .service('binnacleBirthdaysSrv', binnacleBirthdaysSrv);

})();
