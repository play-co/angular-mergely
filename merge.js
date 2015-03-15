var app = angular.module('mergely', []);

app.directive('mergelyEditor', function() {
  return {
    restrict: 'E',
    replace: true,

    // TODO seperate this out into a seperate html template file
    template:
      '<div class="mergely-wrapper">' +
        '<div class="merge-bar merge-top-bar">' +
          '<tabset>' +
            '<tab ng-repeat="tab in tabs" heading="{{tab.heading}}" active="tab.active" disable="!tab.active" ng-click="tab.click(tab.heading)"></tab>' +
          '</tabset>' +
          '<div class="merge-btn-container">' +
            '<button type="button" class="merge-btn btn btn-success" ng-click="_accept()">Merge</button>' +
            '<button type="button" class="merge-btn btn btn-warning" ng-click="mergeCancel()">Cancel</button>' +
          '</div>' +
        '</div>' +
        '<div id="mergely-editor"></div>' +
        '<div class="merge-bar merge-bottom-bar">' +
          '<label>Original File</label>' +
          '<label>File Merging</label>' +
        '</div>' +
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

      // retrieves the files for the merge
      $scope.filesToMerge = function() {
        var files = {};
        var paths = $scope.getAllPaths();

        for (var i = 0; i < paths.length; i++) {
          var content, path = paths[i];

          if (path === $scope.curTab) {
            content = $('#mergely-editor').mergely('get', 'lhs');
          } else {
            content = $scope.tabData[path].lhs;
          }

          if (content.length) {
            files[path] = content;
          }
        }

        return files;
      }

      // Wrapper to accept to get the file contents before finalizing merge
      $scope._accept = function() {
        $scope.mergeAccept($scope.filesToMerge());
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
      $scope.$watch('mergeFiles', updateTabs);
      $scope.$watch('mergeWithFiles', updateTabs);

      // TODO dod we have to tell angular about this content change?
      $('#mergely-editor').mergely({
        cmsettings: { readOnly: false, lineNumbers: true },
      });
    }
  }
});
