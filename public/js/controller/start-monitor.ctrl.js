"use strict";
app.controller("startMonitorCtrl", function ($scope, $http) {
    $scope.topologyData = null;
    $scope.linkType = "single";
    $scope.allLinkArr = [];
    $scope.chooseLinkArr = [];
    $scope.moreParas = false;

    //拓扑数据请求接口
    $scope.getSourceNode = function () {
        $http({
            method: "get",
            url: "topology.json"
        }).then(function successFun(res) {
            if (!res.data["network-topology"].topology[0].link) {
                return;
            }
            $scope.topologyData = $scope.filterData(res.data["network-topology"].topology[0].link);
        }, function errorFun(res) {
            console.log(res);
        });
    };

    //提取有效数据
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
                    nodeArr[source] = {};
                    nodeArr[source].first = source;
                    nodeArr[source].second = [];
                    nodeArr[source].second.push(des);
                } else {
                    if ($.inArray(des, nodeArr[source].second) == -1) {
                        nodeArr[source].second.push(des);
                    }
                }
                $scope.allLinkArr.push(source + " " + des);
            }
        });
        // console.log($scope.allLinkArr);
        // console.log(nodeArr);
        return nodeArr;
    };

    $scope.$watch("linkType", function () {
        $scope.chooseLinkArr = [];
    });

    //选择链路按钮处理事件
    $scope.confirmLink = function () {
        if ($scope.linkType == "all") {
            $scope.chooseLinkArr = $scope.allLinkArr;
            return;
        }
        if (!$scope.sourceData || !$scope.desValue) {
            alert("请选择链路节点");
            return;
        }

        var item = $scope.sourceData.first + " " + $scope.desValue;
        if ($.inArray(item, $scope.chooseLinkArr) >= 0) {
            return;
        }
        $scope.chooseLinkArr.push(item);
    };

    //删除某条链路事件
    $scope.delCurrItem = function (item) {
        console.log(item);
        var i = $.inArray(item, $scope.chooseLinkArr);
        if (i < 0) {
            return;
        }
        $scope.chooseLinkArr.splice(i, 1);
    };


    //开始监控处理事件
    $scope.startMonitor = function () {
        if ($scope.chooseLinkArr.length < 1) {
            alert("请选择监控链路");
            return;
        }
        if (!$scope.monitorParas) {
            alert("请选择监控参数");
            return;
        }
        //TODO
        console.log($scope.monitorParas);
        console.log($scope.chooseLinkArr);
    };

    $scope.toggleMoreParas = function () {
        $scope.moreParas = !$scope.moreParas;
    };

    $scope.getSourceNode();
});