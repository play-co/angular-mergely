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
        '</div>' +
        '<div id="mergely-editor"></div>' +
        '<div class="merge-bar merge-bottom-bar">' +
          '<label>Original File</label>' +
          '<label>File Merging</label>' +
        '</div>' +
        '<div class="merge-btn-container">' +
          '<button type="button" class="merge-btn" ng-class="acceptButtonClass" ng-click="_accept()">Merge</button>' +
          '<button type="button" class="merge-btn" ng-class="cancelButtonClass" ng-click="cancelCallback()">Cancel</button>' +
        '</div>' +
      '</div>',

    scope: {
      originalFiles: '=',
      otherFiles: '=',
      acceptCallback: '=',
      cancelCallback: '=',

      cancelButtonClass: '@?',
      acceptButtonClass: '@?'
    },
    controller: function($scope) {
      $scope.tabs = [];
      $scope.finalFiles = [];
      $scope.mergable = false;
      $scope.tabData = {};
      $scope.curTab = undefined;

      // Get the union of the two path sets
      $scope.getAllPaths = function() {
        var as = Object.keys($scope.originalFiles);
        var bs = Object.keys($scope.otherFiles);
        var paths = [];

        for (var a in as) {
          paths[a] = as[a];
        }
        for (var b in bs) {
          paths[b] = bs[b];
        }

        return paths;
      };

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
      };

      // Wrapper to accept to get the file contents before finalizing merge
      $scope._accept = function() {
        $scope.acceptCallback($scope.filesToMerge());
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
        if (!Object.keys($scope.originalFiles).length ||
          !Object.keys($scope.otherFiles).length) {
          // Do nothing if both are not set yet
          return;
        }

        // update the tabs
        $scope.tabs = [];
        $scope.tabData = {};

        var paths = $scope.getAllPaths();
        var newCurTab = null;

        for (var i = 0; i < paths.length; i++) {
          var path = paths[i];

          $scope.tabData[path] = {
            lhs: $scope.originalFiles[path] || '',
            rhs: $scope.otherFiles[path] || ''
          };

          // Only add tabs if the sides are different or given it is the last
          // tab and we have yet to add any (to at least show the use something)
          if ($scope.tabData[path].lhs !== $scope.tabData[path].rhs ||
            (i === paths.length - 1 && !$scope.tabs.length)) {
            if (!newCurTab) {
              newCurTab = path;
            }

            $scope.tabs.push({
              heading: path,
              active: path === newCurTab,
              click: openTab
            });
          }
        }

        // make sure to goto the tab
        openTab(newCurTab);
      };

      // update tabs when files/originalFiles change
      $scope.$watch('originalFiles', updateTabs);
      $scope.$watch('otherFiles', updateTabs);

      // TODO dod we have to tell angular about this content change?
      $('#mergely-editor').mergely({
        cmsettings: { readOnly: false, lineNumbers: true },
        viewport: true,
        editor_width: '45%',
        editor_height: '100%'
      });
    }
  };
});
