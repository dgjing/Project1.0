// Source: public/js/config/config.js
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-03-23 13:55:52
 * @version $Id$
 */
var app = angular.module('myApp', ['ui.router']);

 app.controller("CommonCtrl",function($rootScope , $scope){

 })
 .controller('monitorCtrl',function($rootScope,$scope,$state){
 	$scope.$state = $state;
 })
 .controller('sidebarCtrl',function($rootScope,$scope,$state){
 	$scope.$state = $state;
 })
 .controller('chartsCtrl',function($rootScope,$scope){
 	$scope.hasLink = true;
 })
.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/monitor/data/conf");
    $stateProvider
    .state('monitor', {
            url: '/monitor',
            template: '<div ui-view></div>',
    })
    .state('monitor.data',{
    	url: '/data',
        template: '<div ui-view></div>',
    })
    .state("monitor.data.conf",{
        url:"/conf",
        templateUrl:"/startMonitor.html",
    })
    .state('monitor.data.overview',{
    	url: '/overview',
        templateUrl: 'monitor.html',
    })
    .state('monitor.data.overview.charts', {
            url: '/charts',
            templateUrl: 'datacharts.html',
    })
    .state('monitor.data.overview.list', {
            url: '/list',
            templateUrl: 'datalist.html',
    })        
 
})





// Source: public/js/controller/charts.link.ctrl.js
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-03-24 22:31:49
 * @version $Id$
 */
app.controller('chartlinkCtrl',function($rootScope,$scope,$interval){
$scope.conf = {};
$scope.getData = function(){
	$http({
		url:'nodes.json',
		type:'GET'
	});
};
$scope.conf.link = [
{'src':'openflow:1','desc':'openflow:2 '},
{'src':'openflow:1','desc':'openflow:3 '},
{'src':'openflow:2','desc':'openflow:4 '},
{'src':'openflow:2','desc':'openflow:3 '}
];
$scope.getLinkSpeed = function(){
	$scope.getData().success(function(pre){
		var pre = pre.nodes;
		$setTimeout(function(){
			$scope.getData().success(function(next){
				var next = next.nodes;
			})
		}, 1);
	})

};
$scope.produceCharts = function(){
	var charts = [];
	$scope.conf.link.map(function(_item,_i){
		var data = [], time = (new Date()).getTime();  
		for(var i = -19 ; i < 0 ; i++){
			data.push({x: time + i * 5000,y: 0})
		}                                                        																				                                                                                                                                                    
		var chart = {                                                              
			name: _item.src + ' ' + _item.desc ,                                                
			data: data                                                               
		};
		charts.push(chart);
	});
	return charts;
};
$scope.initChartslink = function(){
	Highcharts.setOptions({                                                     
		global: {                                                               
			useUTC: false                                                       
		}                                                                       
	});                                                                 
	$('#charts-link').highcharts({                                                
		chart: {                                                                
			type: 'spline',                                                     
			animation:true,                                                             
			events: {                                                           
				load: function() {                                              																				            
					var series = this.series;                                
					series.map(function(_item,_i){
						$interval(function() {                                    
							var x = (new Date()).getTime(),         
								y = Math.random();                                  
							_item.addPoint([x, y], true, true);                  
						}, 5000);  
					})					                                                 
				}                                                               
			},
			style:{'border-radius':'0 0 5px 5px','width':'100%','height':400 }
			                                                                 
		},                                                                      
		title: {                                                                
				text: '链路实时速率--5秒'                                            
		},                                                                      
		xAxis: {                                                                
			type: 'datetime',                                                   
			tickPixelInterval: 100                                             
		},                                                                      
		yAxis: {                                                                
			title: {                                                            
				text: '速率'                                                   
			},                                                                  
			plotLines: [{                                                       
				value: 0,                                                       
				width: 1,                                                       
				color: '#808080'                                                
			}]                                                                  
		},                                                                      
		tooltip: {                                                              
			formatter: function() {                                             
					return '<b> 链路：'+ this.series.name +'</b><br/>时间：'+                
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>速率：'+
					Highcharts.numberFormat(this.y, 2);                         
			}                                                                   
		},                                                                      
		legend: {                                                               
			enabled: true                                                      
		},                                                                      
		exporting: {                                                            
			enabled: true                                                      
		},                                                                      
		series: $scope.produceCharts()                                                                      
	});  
}
$scope.initChartslink();
});


// Source: public/js/controller/start-monitor.ctrl.js
app.controller("startMonitorCtrl", function ($scope, $http) {
    $scope.topologyData = null;
    $scope.getSourceNode = function () {
        $http({
            method: "get",
            url: "topology.json"
        }).then(function successFun(res) {
            if (!res.data["network-topology"].topology[0].link) {
                return;
            }
            $scope.topologyData = $scope.filterData(res.data["network-topology"].topology[0].link);
            console.log($scope.topologyData);
        }, function errorFun(res) {
            console.log(res);
        });
    };

    $scope.filterData = function (data) {
        if (!data) {
            return;
        }
        var des, source;
        var reg = /^openflow:/;
        var nodeArr = {};
        data.map(function (item) {
            des = item.destination["dest-node"] || "";
            source = item.source["source-node"] || "";
            if (reg.test(des) && reg.test(source)) {
                if (!nodeArr[source]) {
                    nodeArr[source] = [];
                    nodeArr[source].push(des);
                } else {
                    if($.inArray(des, nodeArr[source]) == -1){
                        nodeArr[source].push(des);
                    }
                }
            }
        });
        return nodeArr;
    };
    $scope.getSourceNode();
});