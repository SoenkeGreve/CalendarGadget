/**
 * Created by Sönke Greve on 06.01.2015.
 */

function createContextMenu(categories) {
    // there can only be one! (or is supposed to be just one in this project)
    $.contextMenu('destroy');
    // create a container for the category css classes
    createCSSinDom(categories);
    registerCustomTypes(categories);

    // create the menu options
    var menuOptions = {
        selector: '.event',
        callback: function (selectedItem, options) {
            onItemClick(selectedItem, options);
        },
        items: createItems(categories)
    };
    GLOBAL.contextMenu = $.contextMenu(menuOptions);
}

function onItemClick(selectedItem, options) {
    //var selectedEvent = $(this);
    switch (selectedItem) {
        case "clear":
            onClearSelectionClick();
            break;
        case "remove":
            removeCssClass();
            break;
        case "separator":
            break;
        default:
            assignCssClass(selectedItem);
            break;
    }
}

function createCSSinDom(categories) {
    if ($("#categoriesStyle").length) { // jquery exists
        $("#categoriesStyle").remove();
    }

    $('<style id="categoriesStyle" type="text/css"></style>').appendTo('head');
    var css = ".cat{ padding: 3px; }\r\n";
    for (var i = 0; i < categories.length; i++) {
        var c = categories[i];
        css += c.getCssClass();
    }
    $("#categoriesStyle").html(css);
}

function createItems(categories) {
    var items = {};
    items["clear"] = {name: "Clear selection"};
    items["remove"] = {name: "Remove assigned category"};
    items["separator"] = "-";
    for (var i = 0; i < categories.length; i++) {
        var c = categories[i];
        items[c.getId()] = {type: c.getId(), customName: c.getName()};
    }
    return items;
}

function registerCustomTypes(categories) {
    for (var i = 0; i < categories.length; i++) {
        var c = categories[i];
        $.contextMenu.types[c.getId()] = {};
        $.contextMenu.types[c.getId()] = function (item, opt, root) {
            var type = '<div class="cat ' + item.type + '">' + item.customName + '</div>';
            this.append(type);
        };
    }
}

function removeCssClass() {
    var selected = $(".ui-selected");
    for (var i = 0; i < GLOBAL.categories.length; i++) {
        selected.removeClass("category" + i);
    }
    selected.removeClass("ui-selected");
}

function assignCssClass(className) {
    var selected = $(".ui-selected");
    for (var i = 0; i < GLOBAL.categories.length; i++) {
        selected.removeClass("category" + i);
    }
    selected.addClass(className);
    selected.removeClass("ui-selected");
}