(function() {
	"use strict";

	angular.module("app.controllers")
		.controller("MainCtrl", ["$scope", function($scope) {
			$scope.clickedBar = function(item, index) {
		    	$scope.$apply(function() {
		    		var random = Math.random()*6;
		      		$scope.detailItem = item;
		      		$scope.data.push({
		      			name: $scope.randomNames[parseInt(random)],
		      			score: Math.random()*400
		      		})

		      		$scope.data.splice(index, 1);
		    	});
		  	}

			$scope.randomNames = ["Charles", "John", "Philip", "Alex", "Bush", "Mutai"];
			$scope.data = [
		  		{name: "Greg", score: 98},
		  		{name: "Ari", score: 96},
		  		{name: 'Q', score: 75},
		  		{name: "Loser", score: 48}
			];
		}]);
}());