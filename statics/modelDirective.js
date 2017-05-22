angular.module('app').directive('modelWindow',function(){
    return {
        restrict:'E',
        template:'<div class="blackout" ng-hide="hideModel"><div class="col-md-4 col-md-offset-4 overlay"><h3>Choose your nick name</h3><input type="text" class="form-control" ng-model="nickName"><br /><input type="button" class="btn btn-info" ng-click="addNickName()" value="Submit" ></div></div>'
    }

})
