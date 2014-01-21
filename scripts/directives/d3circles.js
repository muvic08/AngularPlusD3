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

							var r = 90,
								p = Math.PI * 2

							var arc = d3.svg.arc()
								.innerRadius(30)
								.outerRadius(r)
							
							var pie = d3.layout.pie()
								.value(function(d) { 
									return d.score;
								})
								.sort(null)							

							var svg = d3.select(element[0])
								.append("svg")
								.style("width", "100%")
								.style("height", "500px")

							var group = svg.append("g")
								.attr("transform", "translate(100, 100)")

							scope.arcTween = function(a) {
								console.log(a)
								var i = d3.interpolate(this._current, a);
								this._return = i(0);
								return function(t) {
									return arc(i(t));
								}
							}

							scope.change = function(data) {
								console.log(data.length)
								var path = group.selectAll("path")
									.data(pie(data));

								path.transition()
									.duration(1000)
									.attrTween("d", scope.arcTween); // redraw the arcs
							}

							scope.render = function(data) {
								if (!data) return;

								var path = group.selectAll("path")
									.data(pie(data))
									.enter()
									.append("path")
									.attr("fill", "#rgba(250,250,250,1)");

								path.attr("fill", function(d, i) {
										return color(d.data.score);
									})
									.attr("d", arc)
									.each(function(d) {
										this._current = d; // store the initial angles
										scope.change(data)
 									})

							};

						});
					}
				}
			}
		]);
}());