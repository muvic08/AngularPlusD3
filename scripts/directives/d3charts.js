(function() {
	"use strict";

	angular.module("app.directives")
		.directive("d3Chart", ["d3", "$window", 
			function(d3, $window) {
				return {
					restrict: "EA",
					scope: {
						data: '=', // bi-directional data-binding
						label: "@",
						onClick: "&" // parent execution binding
					},
					link: function(scope, element, attrs) {
						d3.d3().then(function(d3) {
							var margin = parseInt(attrs.margin) || 20,
								barHeight = parseInt(attrs.barHeight) || 20,
								barPadding = parseInt(attrs.barBadding) || 5,
								counter = 0;

							var svg = d3.select(element[0])
								.append("svg")
								.style("width", "100%");

							/*window.onresize = function() {
								scope.$apply();
							};*/

							scope.resize = function() {
								scope.$apply();
							};

							d3.select(window)
								.on("resize", scope.resize)

							// watch for the resize event
							scope.$watch(function() {
									return angular.element($window)[0].innerWidth;
								}, function() {
									scope.render(scope.data);
								} 
							);

							// watch the data
							scope.$watch("data", function(newData, oldData) {
								if (newData != oldData) {
									scope.render(newData);
								};
							}, true);

							scope.enter = function(data) {
								svg.selectAll("rect")
									.data(data)
									.enter()
									.append("rect")

								svg.selectAll("text")
					              	.data(data)
					              	.enter()
					                .append("text")
					                .attr("fill", "#fff")
					                .attr("y", function(d, i){
					                	return i * (barHeight + barPadding) + barHeight - barPadding;
					                })
					                .attr("x", 15)
					                .text(function(d){
					                	return d[scope.label];
					                });
							};

							scope.update = function(data) {
								var width = d3.select(element[0]).node().offsetWidth - margin,
									color = d3.scale.category20(),
									xScale = d3.scale.linear()
										.domain([0, d3.max(data, function(d) {
											return d.score;
										})])
										.range([0, width]);

								svg.selectAll("rect")
									.data(data)
									.attr("height", barHeight)
									//.attr("width", 140)
									.attr("x", Math.round(margin/2))
									.attr("y", function(d, i) {
										return i * (barHeight + barPadding);
									})
									.attr("fill", function(d) { return color(d.score); })
									.on("click", function(d, i) {
										return scope.onClick({item: d, index: i});
									})
									.transition()
										.duration(1000)
										.attr("width", function(d) {
											return xScale(d.score);
										})

								svg.selectAll("text")
					              	.data(data)
					                .attr("fill", "#fff")
					                .attr("y", function(d, i){
					                	return i * (barHeight + barPadding) + barHeight - barPadding;
					                })
					                .attr("x", 15)
					                .text(function(d){
					                	return d[scope.label];
					                });
							};

							scope.exit = function(data) {
								svg.selectAll("rect")
									.data(data)
									.exit()
									.remove()
							};

							scope.render = function(data) {
								if (!data) return;

								var	height = scope.data.length * (barHeight + barPadding);

								svg.attr("height", height);
								
								scope.enter(data);
								scope.exit(data);
								scope.update(data);
							};
						})
					}
				}
			}])
}());