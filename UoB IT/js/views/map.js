window.Maps = {
    data: new kendo.data.DataSource({
        transport: {
            read: {
                url: "data/map-pins.json",
                type: "get",
                dataType: "json"
            }
        },
        schema: {
            data: "pins"
        },
        filter: {
            logic: "or",
            filters: [
                {
                    field: "type",
                    operator: "eq",
                    value: "bike"
                },
                {
                    field: "type",
                    operator: "eq",
                    value: "recycling"
                }
      		]
        }
    }),
    toggleOptions: function () {
        // We're about to toggle options manually - can disable the fitBounds option now
        var map = $('#map').data('kendoMap');
        map.options.fitBounds = false;

        if ($('#map-drawer-container').css('bottom') == '0px') {
            $("#map-drawer-container").animate({
                bottom: "-80px",
            }, 300, function () {
                $('#drawer-toggle img').css('transform', 'rotate(0deg)');
            });
        } else {
            $("#map-drawer-container").animate({
                bottom: "0px",
            }, 300, function () {
                $('#drawer-toggle img').css('transform', 'rotate(180deg)');
            });
        }
    }
};

