$(function () {
    var init = function () {
        //
        var btncbb = $("#btncbb").buttoncombobox({select : function () {
        }})
        btncbb.showData([{id:"1", name:"hello"}, {id:"2", name:"nice"}]);

        var nmlcbb = $("#nmlcbb").normalcombobox({select : function () {
        }})
        nmlcbb.showData([{id:"1", name:"hello"}, {id:"2", name:"nice"}]);
    };
    init();
});