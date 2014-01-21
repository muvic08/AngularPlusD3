angular.module('d3', [])
  .factory('d3Service', ['$document', '$q', '$rootScope',
   	function($document, $q, $rootScope){
    	var d = $q.defer();
    	function onScriptLoad() {
    		$rootScope.$apply(function() { d.resolve(window.d3); });
    	}

    	var scriptTag = $document[0].createElement("script");
    	scriptTag.type = "text/javascript";
    	scriptTag.async = true;
    	scriptTag.src = 'http://d3js.org/d3.v3.min.js';
    	scriptTag.onreadystatechange = function() {
    		if (this.readystate == "complete") onScriptLoad();
    	}
    	scriptTag.onload = onScriptLoad;

    	var s = $document[0].getElementsByTagName('body')[0];
    	s.appendChild(scriptTag);

    	return {
    		d3: function() { return d.promise; }
    	}
  }]);

var app = angular.module('app', ['d3']);


app.controller('MainCtrl', ['$scope', function($scope){
  	$scope.clickedBar = function(item) {
    	$scope.$apply(function() {
    		item.score = 100;
      		if (!$scope.showDetailPanel)
        		$scope.showDetailPanel = true;
      		$scope.detailItem = item;
    	});
  	}

	$scope.greeting = "Resize the page to see the re-rendering";
	$scope.data = [
  		{name: "Greg", score: 98},
  		{name: "Ari", score: 96},
  		{name: 'Q', score: 75},
  		{name: "Loser", score: 48}
	];

}]);


	
app.directive('barChart', ['d3Service', '$window', function(d3Service, $window) {
	return {
		restrict: "EA",
		scope: {
			data: '=', // bi-directional data-binding
			onClick: "&" // parent execution binding
		},
  		link: function(scope, element, attrs) {
    		d3Service.d3().then(function(d3) {
    			var margin = parseInt(attrs.margin) || 20,
    				barHeight = parseInt(attrs.barHeight) || 20,
    				barPadding = parseInt(attrs.barPadding) || 5;

      			var svg = d3.select(element[0])
      				.append("svg")
      				.style("width", '100%');

      			window.onresize = function() {
      				scope.$apply();
      			}

      			// Watch for resize event
      			scope.$watch(function() {
      				return angular.element($window)[0].innerWidth;
      			}, function() {
      				scope.render(scope.data);
      			});

      			scope.$watch('data', function(newData) {
      				console.log(newData);
            		scope.render2(newData);
          		}, true);

      			scope.render = function(data) {
      				// remove all previous items before render
      				svg.selectAll('*').remove();

      				// if we don't pass any data, return out of the element
      				if (!data) return;

      				// setup variables
      				var width = d3.select(element[0]).node().offsetWidth - margin,
      					height = scope.data.length * (barHeight + barPadding),
      					color = d3.scale.category20(),
      					xScale = d3.scale.linear()
      						.domain([0, d3.max(data, function(d) {
      							return d.score;
      						})])
      						.range([0, width]);

      				// set the height based on the calculations above
      				svg.attr('height', height);

      				// create the rectangles for the bar chart
      				svg.selectAll('rect')
      					.data(data).enter()
      					.append('rect')
      					.attr('height', barHeight)
      					.attr('width', 140)
      					.attr('x', Math.round(margin/2))
      					.attr('y', function(d, i) {
      						return i * (barHeight + barPadding);
      					})
      					.attr('fill', function(d) { return color(d.score); })
      					.on('click', function(d, i) {
      						return scope.onClick({item: d});
      					})
      					.transition()
      						.duration(1000)
      						.attr('width', function(d) {
      							return xScale(d.score);
      						})
      			}

      			scope.render2 = function(data) {
      				// remove all previous items before render
      				//svg.selectAll('*').remove();

      				// if we don't pass any data, return out of the element
      				if (!data) return;

      				// setup variables
      				var width = d3.select(element[0]).node().offsetWidth - margin,
      					height = scope.data.length * (barHeight + barPadding),
      					color = d3.scale.category20(),
      					xScale = d3.scale.linear()
      						.domain([0, d3.max(data, function(d) {
      							return d.score;
      						})])
      						.range([0, width]);

      				// set the height based on the calculations above
      				svg.attr('height', height);

      				// create the rectangles for the bar chart
      				svg.selectAll('rect')
      					.data(data)
      					.attr('height', barHeight)
      					.attr('x', Math.round(margin/2))
      					.attr('y', function(d, i) {
      						return i * (barHeight + barPadding);
      					})
      					.attr('fill', function(d) { return color(d.score); })
      					.on('click', function(d, i) {
      						return scope.onClick({item: d});
      					})
      					.transition()
      						.duration(1000)
      						.attr('width', function(d) {
      							return xScale(d.score);
      						})
      			}

    		});
  		}
  	}
}]);
