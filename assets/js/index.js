'use strict';

$(function() {
    tab();
});

var tab = function() {
    $('#tab-collaborators').on('click', function() {
        $('#collaborators').show();
        $('#owners').hide();
    });

    $('#tab-owners').on('click', function() {
        $('#collaborators').hide();
        $('#owners').show();
    });
};
