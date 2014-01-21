(function(){
	"use strict";

	angular.module("app.directives")
		.directive("d3Circle", ["d3", "$window",
			function(d3, $window) {
				return {
					restrict: "EA",
					scope: {
						data: "=",
						onClick: "&"
					},
					link: function(scope, element, attrs) {
						d3.d3().then(function(d3) {
							scope.resize = function() {
								scope.$apply();
							};

							d3.select(window)
								.on("resize", scope.resize)

							scope.$watch(function() {
									return angular.element($window)[0].innerWidth;
								}, function() {
									scope.render(scope.data);
								} 
							);

							scope.$watch("data", function(newData, oldData) {
								if (newData != oldData) {
									scope.render(newData);
								};
							}, true);


							var color = d3.scale.category20()

							var svg = d3.select(element[0])
								.append("svg")
								.style("width", "100%")
								.style("height", "500px")

							var group = svg.append("g")
								.attr("transform", "translate(100, 100)")
								.style("background-color", "green")

							var r = 90,
								p = Math.PI * 2

							var arc = d3.svg.arc()
								.innerRadius(10)
								.outerRadius(r)
							
							var pie = d3.layout.pie()
								.value(function(d) { 
									return d.score;
								})
								.sort(null)

							scope.enter = function(data) {
								/*var arcs = group.selectAll(".arc")
									.data(pie(scope.data))
									.enter()
									.append("g")
									.attr("class", "arc")

								arcs.append("path")
									.attr("d", arc) */
									//.attr("fill", function(d) {
										//return color(d.data.score);
									//})

								var path = group.datum(data).selectAll("path")
									.data(pie(data))
									.enter()
									.append("path")
									/*.attr("fill", function(d, i) {
										return color(i);
									})
									.attr("d", arc)*/
							}

							scope.exit = function(data) {
								var path = group.datum(data).selectAll("path")
									.data(pie(data))
									.exit()
									.remove
							}

							scope.update = function(data) {
								/*var arcs = group.selectAll(".arc")
									.data(pie(scope.data))

								arcs.append("path")
									.attr("d", arc)
									.attr("fill", function(d) {
										return color(d.data.score);
									})*/

								var path = group.datum(data).selectAll("path")
									.data(pie(data))
									.attr("fill", function(d, i) {
										return color(i);
									})
									.attr("d", arc)
									/*.transition()
									.duration(1000)
									.call(arcTween, )*/

							}

							scope.render = function(data) {
								if (!data) return;

								scope.enter(data);
								scope.exit(data);
								scope.update(data);

							};

						});
					}
				}
			}
		]);
}());