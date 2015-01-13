/**
 * Created by Sönke Greve on 05.01.2015.
 */


/**
 *
 * @param id
 * @param name
 * @param fontColor
 * @param bgColor
 * @constructor
 */
function Category(id, name, fontColor, bgColor) {
    if (id != undefined && id != null) {
        this.id = id;
        this.name = name;
        this.fontColor = fontColor;
        this.bgColor = bgColor;
    }
    console.log('category created');
}

/** ID getter / setter */
Category.prototype.getId = function () {
    return this.id;
}

Category.prototype.setId = function (id) {
    this.id = id;
}

/** name getter / setter */
Category.prototype.getName = function () {
    return this.name;
}

Category.prototype.setName = function (name) {
    this.name = name;
}


/** fontColor getter / setter */
Category.prototype.getFontColor = function () {
    return this.fontColor;
}

Category.prototype.setFontColor = function (fontColor) {
    this.fontColor = fontColor;
}


/** bgColor getter / setter */
Category.prototype.getBgColor = function () {
    return this.bgColor;
}

Category.prototype.setBgColor = function (bgColor) {
    this.bgColor = bgColor;
}

/**
 *
 */
Category.prototype.getCssClass = function () {
    var css = "." + this.id + "{\r\ncolor: " + this.fontColor + ";\r\nbackground-color: " + this.bgColor + ";\r\n}";
    return css;
}

/**
 * @param id
 *  the category identifier (e.g. category0)
 * @param containerId
 *  the id of the DOM element this category will be appended to (without starting '#')
 */
Category.prototype.appendTo = function (id, containerId, callback) {

    var html = '<div id="' + id + '" class="editCategory">' +
        '<input id="' + id + 'Name" type="text" value="' + this.getName() + '">' +
        '<div id="' + id + 'FontColor" class="colorSelector"><div style="background-color:' + this.getFontColor() + '"></div></div>' +
        '<div id="' + id + 'BgColor" class="colorSelector"><div style="background-color:' + this.getBgColor() + '"></div></div>' +
        '<button id="' + id + 'Remove" class="colorSelector">Remove category</button>' +
        '</div>';
    $('#' + containerId).append(html);
    $('#' + id + 'Remove').button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
    }).click(function (event) {
        callback(id);
        //deleteCallback();
        //GLOBAL.categoryDelete.dialog("open");
    }).addClass("btnRemove");
}

Category.prototype.loadFromElement = function (elementId) {
    //var element = $('#' + elementId);
    //var html = element.html();
    var index = parseInt(elementId.replace("dlgCat", ""));
    this.id = "category" + index;
    this.name = $("#" + elementId + "Name").val();
    this.fontColor = $("#" + elementId + "FontColor div").css("backgroundColor");
    this.bgColor = $("#" + elementId + "BgColor div").css("backgroundColor");
}




