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
            $scope.filterData(res.data["network-topology"].topology[0].link);
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
        data = data.filter(function (item) {
            des = item.destination["dest-node"] || "";
            source = item.source["source-node"] || "";
            console.log(des);
            console.log(source);
            return reg.test(des) && reg.test(source);
        });
        console.log(data);
    };
    $scope.getSourceNode();
});