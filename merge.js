var app = angular.module('mergely', []);

app.directive('mergelyEditor', function() {
  return {
    restrict: 'E',
    replace: true,

    // TODO seperate this out into a seperate html template file
    template:
      '<div class="mergely-wrapper">' +
        '<div class="merge-bar">' +
          '<tabset>' +
            '<tab ng-repeat="tab in tabs" heading="{{tab.heading}}" active="tab.active" disable="!tab.active" ng-click="tab.click(tab.heading)"></tab>' +
          '</tabset>' +
          '<div class="merge-btn-container">' +
            '<button type="button" class="merge-btn btn btn-success" ng-click="_accept()" ng-disabled="!mergable()">Merge</button>' +
            '<button type="button" class="merge-btn btn btn-warning" ng-click="cancel()">Cancel</button>' +
          '</div>' +
        '</div>' +
        '<div id="mergely-editor"></div>' +
      '</div>',

    scope: {
      mergeFiles: '=',
      mergeWithFiles: '=',
      mergeAccept: '=',
      mergeCancel: '='
    },
    controller: function($scope) {
      $scope.tabs = [];
      $scope.finalFiles = [];
      $scope.mergable = false;
      $scope.tabData = {};
      $scope.curTab = undefined;

      // Get the union of the two path sets
      $scope.getAllPaths = function() {
        var as = Object.keys($scope.mergeFiles);
        var bs = Object.keys($scope.mergeWithFiles);
        var paths = [];

        for (var a in as) paths[a] = as[a];
        for (var b in bs) paths[b] = bs[b];

        return paths;
      }

      // determines if things are mergable now, if so, return files
      $scope.mergable = function() {
        var files = {};
        var paths = $scope.getAllPaths();
        console.log(Object.keys($scope.tabData));

        for (var i = 0; i < paths.length; i++) {
          var lhs, rhs, path = paths[i];

          if (path === $scope.curTab) {
            lhs = $('#mergely-editor').mergely('get', 'lhs'),
            rhs = $('#mergely-editor').mergely('get', 'rhs')
          } else {
            if (path in $scope.tabData) {
              lhs = $scope.tabData[path].lhs;
              rhs = $scope.tabData[path].rhs;
            } else {
              console.log('tab', path, 'not save');
              return false;
            }
          }

          if (lhs !== rhs) {
            console.log('tab', path, 'not same');
            console.log(lhs.length, rhs.length);
            return false;
          } else {
            files[path] = lhs;
          }
        }

        return 'mergable';
        return files;
      }

      // Wrapper to accept to get the file contents before hand
      $scope._accept = function() {
        $scope.accept($scope.mergable());
      };
    },
    link: function($scope, element) {
      var openTab = function(file) {
        // Save previous tab
        if ($scope.curTab) {
          $scope.tabData[$scope.curTab] = {
            lhs: $('#mergely-editor').mergely('get', 'lhs'),
            rhs: $('#mergely-editor').mergely('get', 'rhs')
          };
        }
        $scope.curTab = file;

        // Load tab content
        // TODO Do we have to tell angular about this content change?
        $('#mergely-editor').mergely('lhs', $scope.tabData[file].lhs);
        $('#mergely-editor').mergely('rhs', $scope.tabData[file].rhs);
      };

      var updateTabs = function() {
        if (!Object.keys($scope.mergeFiles).length || !Object.keys($scope.mergeWithFiles).length) {
          // Do nothing if both are not set yet
          return;
        }

        // Get the active file or make an file active
        var newCurTab = $scope.curTab;
        if (newCurTab === undefined) {
          newCurTab = Object.keys($scope.mergeFiles)[0] ||
                      Object.keys($scope.mergeWithFiles)[0];
        }

        // update the tabs
        $scope.tabs = [];
        $scope.tabData = {};

        var paths = $scope.getAllPaths();
        for (var i = 0; i < paths.length; i++) {
          var path = paths[i];

          $scope.tabData[path] = {
            lhs: $scope.mergeFiles[path] || '',
            rhs: $scope.mergeWithFiles[path] || ''
          };

          $scope.tabs.push({
            heading: path,
            active: path === newCurTab,
            click: openTab
          });
        }

        // make sure to goto the tab
        openTab(newCurTab);
      };

      // update tabs when files/mergeFiles change
      $scope.$watch('files', updateTabs);
      $scope.$watch('mergeFiles', updateTabs);

      // TODO dod we have to tell angular about this content change?
      $('#mergely-editor').mergely({
        cmsettings: { readOnly: false, lineNumbers: true },
      });
    }
  }
});
