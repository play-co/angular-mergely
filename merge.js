var app = angular.module('mergely', []);

app.directive('mergelyEditor', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div id="mergely-editor"></div>',
    scope: {
      files: '=',
      mergeFiles: '=',
      complete: '='
    },
    link: function($scope, element) {
      var file = undefined;

      var setFiles = function(files, set) {
        if (Object.keys(files).length) {
          if (file === undefined) {
            file = Object.keys(files)[0];
          }
        }

        var content = '';
        if (file in files) {
          content = '' + files[file];
        }

        console.log('setting ', file, content);
        $('#mergely-editor').mergely(set, content);

        if ($scope.files && $scope.mergeFiles) {
          for (var k in $scope.files) {
            if ($scope.files[k] !== $scope.mergeFiles) {
              console.log(k, 'versions differ');
            } else {
              console.log(k, 'versions same');
            }
          }
        }
      };

      $scope.$watch('files', function(files) {
        if (files) {
          setFiles(files, 'lhs');
        }
      });

      $scope.$watch('mergeFiles', function(files) {
        if (files) {
          setFiles(files, 'rhs');
        }
      });

      $('#mergely-editor').mergely({
        cmsettings: { readOnly: false, lineNumbers: true },
      });
    }
  }
});
