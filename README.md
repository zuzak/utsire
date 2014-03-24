# utsire
[![NPM](https://nodei.co/npm/utsire.png)](https://nodei.co/npm/utsire/)
A rudimentary parser for the Shipping Forecast, as issued by the Met Office on
behalf of the Maritime and Coastguard Agency at 0600 today.

## Usage
```
var utsire = require('utsire')
utsire.get(function(forecast) {
  console.log(forecast.gales)
})
```

## Structure
``utsire.get(callback)`` is the only function. It returns an object with the
following properties:

* ``synopsis``: an object containing a ``time`` and a ``content`` string, the
  former containing the time of the synopsis, and the latter containing the
  general synopsis itself.
* ``areas``: an object containing objects containing  Area Forecasts, keyed to each area (e.g.
  ``"Viking"``, which in turn contains ``precipitation``, ``wind``, ``seastate``
  and ``visibility`` strings, as well as a ``shared`` object containing the list
  of areas that have identical forecasts.
* ``header``: always ``"Shipping forecast"``.
* ``gales``: an array of area names that currently have gale warnings in force.
