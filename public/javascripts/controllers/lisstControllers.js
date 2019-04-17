app.controller("LisstListController", function ($scope, $state, ngToast, LisstService) {

	$scope.lissts = LisstService.query();


	$scope.onLisstClicked = function(lisst) {
		$state.go('lisst-item', { lisstId: lisst._id })

    }


    $scope.createLisst = function() {
        var lisst = {
            title: '',
            items: [ { text: '', checked: false, focused: true }]
        };

        var newLisst = new LisstService(lisst);
        newLisst.$save(
            function(lisst, resp) {
                if(!lisst.error) {
                    $state.go('lisst-item', { lisstId: lisst._id })
                } 
                else {
                    ngToast.danger('Could not create Lisst');
                }
            },
            function(error) {
                ngToast.error(error);
            }
            );
    };
});


app.controller("LisstItemController", function ($scope, $stateParams, ngToast, LisstService, LisstSocket) {

    var updateTimeout;

    $scope.lisst = LisstService.get({lisstId: $stateParams.lisstId}, function() {
        for (var i = 0; i < $scope.lisst.items.length; i++)
            $scope.lisst.items[i].focused = true;
    });


    $scope.$watch('lisst', function () {
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(function () {
            $scope.updateLisst();
        }, 3000);
    }, true);

    LisstSocket.on('lisst:updated', function(lisst) {
        $scope.lisst = lisst;

        ngToast.success('Lisst updated!');
    });

    $scope.updateLisst = function() {
        LisstSocket.emit('update:lisst', $scope.lisst);
    };

    $scope.addItem = function() {
        $scope.lisst.items.push({ text: '', checked: false, focused: true });
    };

    $scope.onDeleteItemClicked = function(index) {
        $scope.lisst.items.splice(index, 1);
    }

    $scope.deleteLisst = function () {
        $scope.lisst.$delete({lisstId: $stateParams.lisstId}, function(p, resp) {
            if(!p.error) { 
                $location.path('lissts');
            } else {
                ngToast.danger('Could not delete Lisst');
            }
        });
    }

});