//   (function () {
//       'use strict';

//       function insuranceAgentSrv(URLS, $q, $http, $filter) {
//           /**
//            *  prospect service
//            */
//           function InsuranceAgentSrv() {}

//            InsuranceAgentSrv.prototype.getAgent = function () {
//               return $q(function (resolve, reject) {
//                   $http({
//                       method: 'POST',
//                       url: URLS.getAgentQuery,
//                       params: {
//                           language: 'SPA',
//                           operation: 'PARAMS'
//                       }
//                   }).then(function success(response) {
//                       var _response;
//                       console.log(response)
//                       if (response.data.return.status === 1) {
//                           _response = response.data;
//                           resolve({success: true, info: _response});
//                       } else {
//                           reject({success: false, info: response.data.return.message});
//                       }
//                   }, function error() {
//                       reject({success: false, type: 'not-found'});
//                   });
//               });
//           }

//           return new InsuranceAgentSrv();
//       }
//       angular
//           .module('actinver.controllers')
//           .service('insuranceAgentSrv', insuranceAgentSrv);
//   })()