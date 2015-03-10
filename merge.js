var app = angular.module('mergely', []);

app.directive('mergelyEditor', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div id="mergely-editor"></div>',
    scope: {
      files: '=',
      mergeFiles: '='
      complete: '='
    },
    link: function($scope, element) {
      $scope.lset = null;
      $scope.rset = null;

      // Make list of filenames
      var filenames = Object.keys($scope.files);
      for (var f in $scope.mergeFiles) {
        filenames.push(f);
      }

      // This function is called once per file
      var file_index = 0;
      var nextFile = function() {
        var lcontent = $scopes.files{
        file_index++;
      }

      // We need to wait until lset and rset have been set
      var set_sets = 0;
      var set_set = function() {
        set_sets++;
        if (set_sets == 2) {
          // lset and rset set
          nextFile();
        }
      };

      $('#mergely-editor').mergely({
        cmsettings: { readOnly: false, lineNumbers: true },
        lhs: function(setValue) {
          $scope.lset = setValue;
          set_set();
        },
        rhs: function(setValue) {
          $scope.rset = setValue;
          set_set();
        }
      });
    }
  }
});
