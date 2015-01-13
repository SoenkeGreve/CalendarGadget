var GLOBAL = {};

$(document).ready(function () {
    moment().format();
    moment.locale('de');
    var year = moment().year();
    setup(year);
    draw(year);
});

function setup(year) {
    setupCategories();
    formatToolBox(year);
    populateMonthHeader();
    setupDialogs();
    createContextMenu(GLOBAL.categories);
}

function setupDialogs() {

    // categories editor
    GLOBAL.categoryEditor = $("#dlgCategories").dialog({
        autoOpen: false,
        height: 500,
        width: 420,
        modal: true,
        buttons: {
            "Add Category": addCategory,
            Cancel: function () {
                GLOBAL.categoryEditor.dialog("close");
            },
            "OK": saveChanges
        }
    });

    // delete categories confirmation
    GLOBAL.categoryDelete = $("#dlgCategoryDelete").dialog({
        autoOpen: false,
        resizable: false,
        height: 140,
        modal: true,
        buttons: {
            "Ok": function () {
                onDeleteOk();
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

function onDeleteOk() {
    var id = GLOBAL.categoryDelete.data("currentId");
    $("#" + id).css("display", "none");
}

function deleteCallback(id) {
    GLOBAL.categoryDelete.data("currentId", id);
    GLOBAL.categoryDelete.dialog("open");
}

function addCategory() {
    var index = 0;
    var children = $("#dlgCategories").children('div');
    if (children.length > 0) {
        var lastChild = children[children.length - 1];
        var id = $(lastChild).attr("id");
        id = id.replace("dlgCat", "");
        index = parseInt(id);
        index++;
    }

    var cat = new Category("category" + index, "My Category " + index, "#FFFFFF", "#000000");
    var prefix = 'dlgCat';
    var ownElementId = prefix + index;
    cat.appendTo(ownElementId, 'dlgCategories', deleteCallback);
    createCategoryColorPicker(prefix + index, cat);
}

function saveChanges() {
    // read categories from dialog
    var result = new Array();
    var children = $('#dlgCategories').children();
    for (var c = 0; c < children.length; c++) {

        var child = $(children[c]);
        var category = new Category();
        var id = child.attr("id");

        // remove deleted categories - this is all divs that are hidden from the dialog
        var isDeleted = child.css("display").localeCompare("none") == 0;
        if (isDeleted) {
            removeCategoryCss(id);
        } else {
            category.loadFromElement(id);
            result.push(category);
        }
    }
    GLOBAL.categories = result;
    createContextMenu(GLOBAL.categories);
    GLOBAL.categoryEditor.dialog("close");
}

function removeCategoryCss(categoryId) {
    var index = parseInt(categoryId.replace("dlgCat", ""));
    var str = "category" + index;
    for (var i = 0; i < GLOBAL.categories.length; i++) {
        $("." + str).removeClass(GLOBAL.categories[i].getId());
    }
    $("#" + categoryId).remove();
}

function setupCategories() {
    GLOBAL.categories = new Array();
    GLOBAL.categories.push(new Category("category0", "Jour-Fix", "#FFFFFF", "#006600"));
    GLOBAL.categories.push(new Category("category1", "Board Meetings", "#FFFFFF", "#AA0000"));
    GLOBAL.categories.push(new Category("category2", "Interviews", "#FFFFFF", "#0000AA"));
}

function draw(year) {
    populateYearTable(year);
    $(".eventWrapper").bind("mousedown", function (e) {
        e.metaKey = true;
    }).selectable();
}

function formatToolBox(year) {
    $('#toolBox').shadow('raised').css({'border-radius': '0pt 0pt 10pt 10pt'});
    $('#prevYear').button({
        icons: {
            primary: "ui-icon-triangle-1-w"
        },
        text: false
    }).click(function () {
        changeYear(-1)
    });

    $('#yearButton').button().click(function () {
        changeYear(1)
    });

    $('#yearSelector').html(year);

    $('#nextYear').button({
        icons: {
            primary: "ui-icon-triangle-1-e"
        },
        text: false
    }).click(function () {
        changeYear(1)
    });

    $('#btnEditCategories').button({
        icons: {primary: "ui-icon-pencil"}
    }).click(onEditCategoriesClick);

    $('#btnClearSelection').button().click(onClearSelectionClick);
    $('#btnRefresh').button().click(onRefresh);
}

function onRefresh() {
    $.blockUI({
        theme:     true,
        title: 'Loading events',
        message: '<div class="loading">Please wait ...</div>',
        timeout: 3000
    });
}

function onEditCategoriesClick() {
    $("#dlgCategories").html("");
    var prefix = "dlgCat";

    for (var c = 0; c < GLOBAL.categories.length; c++) {
        var cat = GLOBAL.categories[c];
        cat.appendTo(prefix + c, 'dlgCategories', deleteCallback);
        createCategoryColorPicker(prefix + c, cat);
    }

    GLOBAL.categoryEditor.dialog("open");
}

function createCategoryColorPicker(id, cat) {
// Color picker - font-color
    var fontColorSelector = '#' + id + "FontColor";
    $(fontColorSelector).ColorPicker({
        color: cat.getFontColor(),
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            //$(this).ColorPickerHide();
            $(colpkr).fadeOut(500);
            return false;
        },
        onSubmit: function (hsb, hex, rgb, el) {
            var selector = "#" + $(el).attr('id') + ' div';
            $(selector).css('backgroundColor', '#' + hex);
            $(el).ColorPickerHide();
        },
        onBeforeShow: function () {
            $(this).ColorPickerSetColor(cat.getFontColor());
        }
        //,
        //onChange: function (hsb, hex, rgb, el) {
        //    console.log("el: " + el);
        //    $(fontColorSelector + ' div').css('backgroundColor', '#' + hex);
        //}
    });

    // Color picker - bgColor
    var bgColorSelector = '#' + id + "BgColor";
    $(bgColorSelector).ColorPicker({
        color: cat.getBgColor(),
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onBeforeShow: function () {
            $(this).ColorPickerSetColor(cat.getBgColor());
        },
        onSubmit: function (hsb, hex, rgb, el) {
            var selector = "#" + $(el).attr('id') + ' div';
            $(selector).css('backgroundColor', '#' + hex);
            $(el).ColorPickerHide();
        }
        //,
        //onChange: function (hsb, hex, rgb) {
        //    $(bgColorSelector + ' div').css('backgroundColor', '#' + hex);
        //}
    });
}

function onClearSelectionClick() {
    $('.ui-selected').removeClass('ui-selected');
}

function changeYear(byVal) {
    var yearStr = $('#yearSelector').html();
    var year = parseInt(yearStr);
    var mom = moment().year(year).add(byVal, 'years').year();
    $('#yearSelector').html(mom);
    draw(mom);
}

function populateMonthHeader() {
    var html = '';
    // create month headers
    html += '<tr>';
    for (var m = 0; m < 12; m++) {
        html += '<th class="ui-dialog-titlebar ui-widget-header ui-corner-all month">' + moment().month(m).format('MMMM') + '</th><td class="spacer"></td>';
    }
    html += '</tr>';
    var yt = $('#monthHeader');
    yt.html(html);
    $('.month').shadow();
}

function populateYearTable(year) {
    var html = '';

    // create days
    for (var d = 1; d <= 31; d++) {

        html += '<tr>';
        for (var m = 0; m < 12; m++) {

            var mom = moment().year(year).month(m).date(d);
            var isSaturday = mom.day() == 6;
            var isSunday = mom.day() == 0;
            var isValid = moment([year, m, d]).isValid();

            html += '<td class="ui-corner-all day ';

            if (isSaturday) {
                html += 'saturday';
            }

            if (isSunday) {
                html += 'sunday';
            }

            if (!isValid) {
                html += ' invalid';
            }

            html += '">';

            if (isValid) {
                html += getDayInfo(mom, d) + getEventWrapper(mom) + '</td>';
            }

            // create header
            if (d == 1 && m != 11) {
                html += '<td class="spacer" rowspan="31"></td>';
            }
        }

        html += '</tr>';
    }

    var yt = $('#yearTable');
    yt.html(html);
}

function getDayInfo(moment, dayOfMonth) {
    var dayName = moment.format('dd');

    var html = '';
    html += '<div class="dayInfo">';
    html += dayName + '&nbsp;' + dayOfMonth + '.';
    html += '</div>';
    return html;
}

function getEventWrapper(moment) {
    var html = '<ol class="eventWrapper">';
    html += createRandomEvents(moment);
    html += '</ol>';
    return html;
}

function createRandomEvents() {
    var html = '';
    for (var i = 0; i < 6; i++) {
        var a = Math.random() >= 0.9;
        if (a) {
            var id = Date.now();
            html += createEvent(id, "LA Omni-Channel / Update REWE Lieferservice");
        }
    }
    return html;
}

function createEvent(id, name) {
    var html = '<li id="' + id + '" class="event">' + name + '</li>';
    return html;
}

