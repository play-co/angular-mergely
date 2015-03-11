angular-mergely
===============

An extended angular wrapper for [mergely](https://github.com/wickedest/Mergely).

Usage
-----

The module of interest is termed `mergely`, so one must require that from
angular in order to make use of this package.

Then one can make use of the `mergelyEditor` element directive.

The following attributes can be set on the `mergelyEditor` directive:

  * `files`
    A file name to data map of files in the original project.
  * `mergeFiles`
    A file name to data map of files in the new project.
  * `complete({filename: data, ...})`
    A function to be called upon the completion of the merge with the amended data.

