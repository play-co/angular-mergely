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

        $('#mergely-editor').mergely(set, content);
      };

      $scope.$watch('files', function(files) {
        if (files) {
          setFiles(files, 'lhs');
        }
      });

      $scope.$watch('mergeFiles', function(mergeFiles) {
        if (mergeFiles) {
          setFiles(mergeFiles, 'rhs');
        }
      });

      $('#mergely-editor').mergely({
        cmsettings: { readOnly: false, lineNumbers: true },
      });
    }
  }
});
