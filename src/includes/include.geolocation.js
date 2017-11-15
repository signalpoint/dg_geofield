dg_geofield._latitude = null;
dg_geofield.getLatitude = function() { return dg_geofield._latitude; };
dg_geofield.setLatitude = function(latitude) { dg_geofield._latitude = latitude; };

dg_geofield._longitude = null;
dg_geofield.getLongitude = function() { return dg_geofield._longitude; };
dg_geofield.setLongitude = function(longitude) { dg_geofield._longitude = longitude; };

dg_geofield.getCurrentPosition = function(success, error, options) {

  // Check to see if we're on a compiled Android.
  var onCompiledAndroid = typeof device !== 'undefined' && device.platform == 'Android';

  if (!success) { success = function() {}; }
  if (!error) { error = function() {}; }

  // If no options were provided, set some defaults.
  if (!options) {
    options = {
      enableHighAccuracy: true
    };
  }

  // Build our success callback for a location check.
  var checkLocationSuccess = function(position) {
    dg_geofield.setLatitude(position.coords.latitude);
    dg_geofield.setLongitude(position.coords.longitude);
    success(position);
  };

  // Build a callback to actually check the location.
  var checkLocation = function() {
    navigator.geolocation.getCurrentPosition(checkLocationSuccess, error, options);
  };

  // If we're not an a compiled Android, go ahead and check the location.
  if (!onCompiledAndroid) {
    checkLocation();
    return;
  }

  // We're on a compiled Android device, check to see if we have GPS permissions...
  var permissions = cordova.plugins.permissions;
  var permission = permissions.ACCESS_FINE_LOCATION;

  // Build a callback to handle a check permissions error.
  var checkPermissionError = function() {
    error({
      code: 1,
      message: dg.t('User denied Geolocation.')
    });
  };

  // Build a callback to handle a check permissions success.
  var checkPermissionSuccess = function(checkStatus) {

    // Permission already granted.
    if (checkStatus.hasPermission) { checkLocation(); }
    else {

      // Permission not already granted, requesting...
      permissions.requestPermission(permission,
          function(requestStatus) {

            // Permission accepted or rejected.
            if(requestStatus.hasPermission) { checkLocation(); }
            else { checkPermissionError(); }

          },
          checkPermissionError
      );

    }
  };

  // Finally, check for the permission...
  permissions.checkPermission(permission, checkPermissionSuccess, checkPermissionError);

};
