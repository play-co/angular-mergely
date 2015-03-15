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
  * `accept({filename: data, ...})`
    A function to be called upon the completion of the merge with the amended data.
  * `cancel()`
    A function to be called upon the cancelation of the merge.

The following css classes are of importance (in addition to those provided by
mergely itself):

  * `merge-bar`
    The bars above and below the mergely editor.
  * `merge-top-bar`
    The bar above the mergely editor.
  * `merge-bottom-bar`
    The bar below the mergely editor.
  * `merge-btn`
    Applied to the "Merge" and "Cancel" button elements.
  * `merge-btn-container`
    A container encapsulating the aforementioned buttons.
