/**
 * JavaScript for form editing date conditions.
 *
 * @module moodle-availability_newavailability-form
 */
M.availability_newavailability = M.availability_newavailability || {};

/**
 * @class M.availability_newavailability.form
 * @extends M.core_availability.plugin
 */
M.availability_newavailability.form = Y.Object(M.core_availability.plugin);

/**
 * Initialises this plugin.
 *
 * Because the date fields are complex depending on Moodle calendar settings,
 * we create the HTML for these fields in PHP and pass it to this method.
 *
 * @method initInner
 * @param {String} html HTML to use for date fields
 * @param {Number} defaultTime Time value that corresponds to initial fields
 */
M.availability_newavailability.form.initInner = function(html, defaultTime) {
    this.html = html;
    this.defaultTime = defaultTime;
};

M.availability_newavailability.form.getNode = function(json) {
    var html = M.util.get_string('direction_before', 'availability_newavailability') + ' <span class="availability-group">' +
            '<label><span class="accesshide">' + M.util.get_string('direction_label', 'availability_newavailability') + ' </span>' +
            '<select name="direction">' +
            '<option value="&gt;=">' + M.util.get_string('direction_from', 'availability_newavailability') + '</option>' +
            '<option value="&lt;">' + M.util.get_string('direction_until', 'availability_newavailability') + '</option>' +
            '</select></label></span> ' + this.html;
    var node = Y.Node.create('<span>' + html + '</span>');

    // Set initial value if non-default.
    if (json.t !== undefined) {
        node.setData('time', json.t);
        // Disable everything.
        node.all('select:not([name=direction])').each(function(select) {
            select.set('disabled', true);
        });

        var url = M.cfg.wwwroot + '/availability/condition/date/ajax.php?action=fromtime' +
            '&time=' + json.t;
        Y.io(url, { on : {
            success : function(id, response) {
                var fields = Y.JSON.parse(response.responseText);
                for (var field in fields) {
                    var select = node.one('select[name=x\\[' + field + '\\]]');
                    select.set('value', '' + fields[field]);
                    select.set('disabled', false);
                }
            },
            failure : function() {
                window.alert(M.util.get_string('ajaxerror', 'availability_newavailability'));
            }
        }});
    } else {
        // Set default time that corresponds to the HTML selectors.
        node.setData('time', this.defaultTime);
    }
    if (json.d !== undefined) {
        node.one('select[name=direction]').set('value', json.d);
    }

    // Add event handlers (first time only).
    if (!M.availability_newavailability.form.addedEvents) {
        M.availability_newavailability.form.addedEvents = true;

        var root = Y.one('#fitem_id_availabilityconditionsjson');
        root.delegate('change', function() {
            // For the direction, just update the form fields.
            M.core_availability.form.update();
        }, '.availability_newavailability select[name=direction]');

        root.delegate('change', function() {
            // Update time using AJAX call from root node.
            M.availability_newavailability.form.updateTime(this.ancestor('span.availability_newavailability'));
        }, '.availability_newavailability select:not([name=direction])');
    }

    if (node.one('a[href=#]')) {
        // Add the date selector magic.
        M.form.dateselector.init_single_newavailability_selector(node);

        // This special handler detects when the date selector changes the year.
        var yearSelect = node.one('select[name=x\\[year\\]]');
        var oldSet = yearSelect.set;
        yearSelect.set = function(name, value) {
            oldSet.call(yearSelect, name, value);
            if (name === 'selectedIndex') {
                // Do this after timeout or the other fields haven't been set yet.
                setTimeout(function() {
                    M.availability_newavailability.form.updateTime(node);
                }, 0);
            }
        };
    }

    return node;
};

M.availability_newavailability.form.fillValue = function(value, node) {
    value.d = node.one('select[name=direction]').get('value');
    value.t = parseInt(node.getData('time'), 10);
};
