(function () {
    'use strict';

    angular
        .module('estimate')
        .controller('ResultController', ResultController);

    ResultController.$inject = ['$rootScope', '$scope', '$timeout', 'message'];

    function ResultController ($rootScope, $scope, $timeout, message) {
        $scope.flip = false;
        $scope.cards = [];

        message.subscribe($rootScope.user.room);
        message.listen("ANY", function() {
            $timeout(checkStats);
        });
        message.listen("USER_LEFT", function(username) {
            $scope.cards = $scope.cards.filter(function(card) {
                return card.user !== username;
            });
        });
        message.listen("USER_JOINED", function(username) {
            console.log("jött USER_JOINED: ", username);
            var card = {
                user: username,
                value: null
            };

            $scope.cards.push(card);
        });
        message.listen("USER_PICKED", function(data) {
            var card = $scope.cards.find(function(card) {
                return card.user === data.user;
            });

            if (card) {
                card.value = data.value;
            }
        });

        function checkStats() {
            $rootScope.$apply();
            var done = $scope.cards.every(function(card) {
                return card.value;
            });

            if (done) {
                var sum = $scope.cards.reduce(function(prev, curr) {
                    if (isNaN(curr.value)) {
                        return prev;
                    } else {
                        return prev + +curr.value;
                    }
                }, 0);

                $scope.averageScore = sum / $scope.cards.length;
                $scope.flip = true;

                $rootScope.$apply();
            } else {
                $scope.notChosenCount = $scope.cards
                    .filter(function(card) {
                        return !card.value;
                    })
                    .length;
            }
        }
    }

}());
