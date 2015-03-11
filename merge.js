var app = angular.module('mergely', []);

app.directive('mergelyEditor', function() {
  return {
    restrict: 'E',
    replace: true,
    template:
      '<div class="mergely-wrapper">' +
        '<tabset>' +
          '<tab ng-repeat="tab in tabs" heading="{{tab.heading}}" active="tab.active" disable="!tab.active" ng-click="tab.click(tab.heading)"></tab>' +
        '</tabset>' +
        '<div id="mergely-editor"></div>' +
      '</div>',
    scope: {
      files: '=',
      mergeFiles: '=',
      complete: '='
    },
    controller: function($scope) {
      $scope.tabs = [];
    },
    link: function($scope, element) {
      var file = undefined;

      var merge = function(as, bs) {
        var cs = [];
        for (var a in as) cs[a] = as[a];
        for (var b in bs) cs[b] = bs[b];
        return cs;
      }

      var openTab = function(file) {
        $('#mergely-editor').mergely('lhs', $scope.files[file] || '');
        $('#mergely-editor').mergely('rhs', $scope.mergeFiles[file] || '');
      };

      var updateTabs = function() {
        // make sure we have some file active
        if (file === undefined) {
          file = Object.keys($scope.mergeFiles)[0] || file;
          file = Object.keys($scope.files)[0] || file;
        }

        // update the tabs
        $scope.tabs = [];
        var paths = merge(Object.keys($scope.files), Object.keys($scope.mergeFiles));

        for (var i = 0; i < paths.length; i++) {
          var path = paths[i];
          $scope.tabs.push({
            heading: path,
            active: path === file,
            click: function(p) {
              openTab(p);
            }
          });
        }

        // make sure to goto the tab
        openTab(file);
      };

      $scope.$watch('files', function(files) {
        if (files) {
          updateTabs();
        }
      });

      $scope.$watch('mergeFiles', function(mergeFiles) {
        if (mergeFiles) {
          updateTabs();
        }
      });

      $('#mergely-editor').mergely({
        cmsettings: { readOnly: false, lineNumbers: true },
      });
    }
  }
});
