/* >>>>>>>>>> BEGIN source/resources/strings.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.stringsFor('English', {
  '_SC.DateTime.dayNames': 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday',
  '_SC.DateTime.abbreviatedDayNames': 'Sun Mon Tue Wed Thu Fri Sat',
  '_SC.DateTime.monthNames': 'January February March April May June July August September October November December',
  '_SC.DateTime.abbreviatedMonthNames': 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'
}) ;


/* >>>>>>>>>> BEGIN source/system/datetime.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.DateTime.mixin(
/** @scope SC.DateTime */ {

  /**
    @private

    Called on `document.ready`.

    Because localizations may have been modified by an application developer,
    we need to wait for the ready event to actually evaluate the localizations.
  */
  _setup: function() {
    SC.DateTime.dayNames = SC.String.w(SC.String.loc('_SC.DateTime.dayNames'));
    SC.DateTime.abbreviatedDayNames = SC.String.w(SC.String.loc('_SC.DateTime.abbreviatedDayNames'));
    SC.DateTime.monthNames = SC.String.w(SC.String.loc('_SC.DateTime.monthNames'));
    SC.DateTime.abbreviatedMonthNames = SC.String.w(SC.String.loc('_SC.DateTime.abbreviatedMonthNames'));
  }

});

jQuery(document).ready(function() {
  SC.DateTime._setup();
});

