"use strict";
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