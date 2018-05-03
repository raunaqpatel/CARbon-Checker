// In your Javascript (external .js resource or <script> tag)
$(document).ready(function() {
    var manufacturer;
    var model;
    var description;

    $.getJSON( "js/data.json", function(items)
    {
        var filteredData = [];
        var uniqueNames  = [];
        items.filter(function (items) {
            if (uniqueNames.indexOf(items.Manufacturer) < 0) {
              uniqueNames.push(items.Manufacturer);
              filteredData.push(items);
            }
          });


        $('#carMakeDrop').find('option[value="a"]').remove().end().append('<option value="a">Select Car Make</option>').val('a');
        $.each(filteredData, function (index, value) {
                $("#carMakeDrop").append('<option rel="' + index + '" value="'+value.ID+'">'+value.Manufacturer+'</option>');
        });


        $("#carModelDrop, #carVariantDrop").prop('disabled', 'disabled');
        $("#carMakeDrop").change(function () {
            var selectedOption = $(this).find('option:selected');
            if(selectedOption.val() != "a"){
                $("#carModelDrop").find('option').remove();
                $("#carVariantDrop").find('option').remove();

                $("#carModelDrop").find("option:first").text("Loading...");
            
            
            manufacturer = $(this).find('option:selected').text();
            console.log("Manufacturer INDEX : " + manufacturer);
            var modelList = [];
            var uniqueNames  = [];
            items.filter(function(item){
                if(item.Manufacturer == manufacturer && uniqueNames.indexOf(item.Model) < 0)
                {
                    modelList.push(item);
                    uniqueNames.push(item.Model);
                }
            });

            console.log(uniqueNames);
            $('#carModelDrop').find('option[value="a"]').remove().end().append('<option value="b">Select Car Model</option>').val('b');
            $.each(modelList, function(modelIndex, modelValue){
                $("#carModelDrop").prop('disabled', false);
                $("#carModelDrop").append('<option rel="' + modelIndex + '" value="'+modelValue.ID+'">'+modelValue.Model+'</option>');
            });

            }
            else{
                $("#carModelDrop").find('option').remove();
                $("#carVariantDrop").find('option').remove();
                $("#carModelDrop, #carVariantDrop").prop('disabled', 'disabled');
            }
        });


        $("#carModelDrop").change(function () {

            var selectedOption = $(this).find('option:selected');
            if(selectedOption.val() != "b")
            {
                $("#carVariantDrop").find('option').remove();
                $("#carVariantDrop").find("option:first").text("Loading...");
                
                model = $(this).find('option:selected').text();
                console.log("Model INDEX : " + model);
                var variantList = [];
                var uniqueNames  = [];
                items.filter(function(item){
                    if(item.Model == model && uniqueNames.indexOf(item.Description) < 0)
                    {
                        variantList.push(item);
                        uniqueNames.push(item.Description);
                    }
                });

                $('#carVariantDrop').find('option[value="b"]').remove().end().append('<option value="c">Select Car Variant</option>').val('c');
                $("#checkCarButton").prop('disabled', 'disabled');
                $.each(variantList, function(variantIndex, variantValue){
                    $("#carVariantDrop").prop('disabled', false);
                    $("#carVariantDrop").append('<option rel="' + variantIndex + '" value="'+variantValue.ID+'">'+variantValue.Description+'</option>');
                });
            }
            else{
                $("#carVariantDrop").prop('disabled', 'disabled');
                $("#checkCarButton").prop('disabled', 'disabled');
                $("#carVariantDrop").find('option').remove();
            }
        });


        $("#carVariantDrop").change(function () {

            var selectedOption = $(this).find('option:selected');
            if(selectedOption.val() != "c")
            {
                $("#checkCarButton").prop('disabled', false);
            }
            else{
                $("#checkCarButton").prop('disabled', 'disabled');
            }
        });
    })
 
    $('.js-example-basic-single').select2();    

    function getData(carMake, carModel, carVariant){
        $.getJSON( "js/data.json", function( a ) {
            var items = [];
            items = a;

            var obj = $.grep(items, function(obj){
                return obj.Model === carModel && obj.Manufacturer === carMake && obj.Description === carVariant;
            })[0];
            
            document.getElementById('carNameText').innerHTML = obj.Manufacturer + " - " + obj.Model;
            document.getElementById('carVariantText').innerHTML = obj.Description;

            var CO2Text = new CountUp('CO2Header', 0, obj.CO2, 0, 1.6, options);
            var rangeText = new CountUp('range', 0, obj.MetricCombined, 0, 1.6, options);
            var noiseText = new CountUp('noise', 0, obj.Noise_Level, 0, 1.6, options);
            var COeText = new CountUp('COe', 0, obj.EmissionsCO, 0, 1.6, options);
            var THCeText = new CountUp('THCe', 0, obj.THC_Emissions, 0, 1.6, options);
            var NOxeText = new CountUp('NOxe', 0, obj.EmissionsNOx, 0, 1.6, options);
            var THC_NOxeText = new CountUp('THC_NOxe', 0, obj.THC_NOxEmissions, 0, 1.6, options);

            if (!CO2Text.error) {
              CO2Text.start();
            } else {
              console.error(CO2Text.error);
            }

            if (!rangeText.error) {
            rangeText.start();
            } else {
              console.error(rangeText.error);
            }

            if (!COeText.error) {
            COeText.start();
            } else {
              console.error(COeText.error);
            }

            if (!THCeText.error) {
            THCeText.start();
            } else {
              console.error(THCeText.error);
            }

            if (!NOxeText.error) {
            NOxeText.start();
            } else {
              console.error(NOxeText.error);
            }

            if (!noiseText.error) {
            noiseText.start();
            } else {
              console.error(noiseText.error);
            }

            if (!THC_NOxeText.error) {
            THC_NOxeText.start();
            } else {
              console.error(THC_NOxeText.error);
            }

            

            generateChart(obj.CO2);

    })
    }


    $("#checkCarButton").click(function() {

        $("#sideBar").removeClass().addClass("col-lg-3 col-md-4");
        $("#content").removeClass("d-none");

        $("#overlay").removeClass("makeTransparent");

        manufacturer = $("#carMakeDrop").find('option:selected').text();
        model = $("#carModelDrop").find('option:selected').text();
        description = $("#carVariantDrop").find('option:selected').text();
        setTimeout(getData,2000,manufacturer, model, description);
    });


});


function generateChart(co2Val){
    $("#overlay").addClass("makeTransparent");
    var ctx = document.getElementById('myChart').getContext("2d");

var gradientGreen = ctx.createLinearGradient(0, 0, 0, 290);
gradientGreen.addColorStop(0, "rgba(82,218,63,.12)");
gradientGreen.addColorStop(1, "rgba(82,218,63,0)");

var gradientBlue = ctx.createLinearGradient(0, 0, 0, 290);
gradientBlue.addColorStop(0, "rgba(0,174,217,0.15)");
gradientBlue.addColorStop(1, "rgba(0,174,217,0)");


console.log(co2Val);
var goal2021 = 95;
var avgNow = 118.5;
var current=[co2Val,co2Val,co2Val], goal=[goal2021,goal2021,goal2021], avg=[avgNow,avgNow,avgNow];
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
            {
                borderColor: "rgba(82,218,63,0.3)",
                pointBorderColor: "#52da3f",
                pointBackgroundColor: "#52da3f",
                pointHoverBackgroundColor: "#52da3f",
                pointHoverBorderColor: "#52da3f",
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBorderWidth: 1,
                pointRadius: 0,
                fill: true,
                backgroundColor: gradientGreen,
                borderWidth: 2,
                data: goal,

            },

            {
                borderColor: "rgba(0,174,217,0.3)",
                pointBorderColor: "#52da3f",
                pointBackgroundColor: "#52da3f",
                pointHoverBackgroundColor: "#52da3f",
                pointHoverBorderColor: "#52da3f",
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBorderWidth: 1,
                pointRadius: 0,
                fill: true,
                backgroundColor: gradientBlue,
                borderWidth: 2,
                data: current,
            },

            {
                borderColor: "rgba(44,62,80,0.15)",
                pointBorderColor: "#2c3e50",
                pointBackgroundColor: "#2c3e50",
                pointHoverBackgroundColor: "#2c3e50",
                pointHoverBorderColor: "#2c3e50",
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBorderWidth: 1,
                pointRadius: 0,
                fill: false,
                backgroundColor: gradientBlue,
                borderWidth: 2,
                data: avg,
            }
    
        ]
    },
      
    options: {
        maintainAspectRatio: false,
        legend: {
            position: "bottom",
            display: false
        },
        tooltips: {
            enabled: false
        },
        
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "rgba(0,0,0,0.5)",
                    fontStyle: "normal",
                    beginAtZero: true,
                    maxTicksLimit: 6,
                    padding: 6,
                    mirror: true
                },
                
                weight:0,
                gridLines: {
                    drawTicks: false,
                    display: false,
                    drawBorder: false,
                }
        }],
            xAxes: [{
                gridLines: {
                    zeroLineColor: "transparent"
                },
                display:false,
                ticks: {
                    padding: 20,
                    fontColor: "rgba(0,0,0,0.5)",
                    fontStyle: "bold"
                }
            }]
        },

        annotation: {
            events: ["click"],
            annotations: [
              {
                drawTime: "afterDatasetsDraw",
                id: "hline",
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: goal2021,
                borderColor: "transparent",
                borderWidth: 0,
                label: {
                    // Background color of label, default below
                    backgroundColor: 'rgba(0,0,0,0)',

                    // Font family of text, inherits from global
                    fontFamily: "Titillium Web",

                    // Font size of text, inherits from global
                    fontSize: 14,

                    // Font style of text, default below
                    fontStyle: "400",

                    // Font color of text, default below
                    fontColor: "#52da3f",

                    // Padding of label to add left/right, default below
                    xPadding: 6,

                    // Padding of label to add top/bottom, default below
                    yPadding: 6,

                    // Radius of label rectangle, default below
                    cornerRadius: 6,

                    // Anchor position of label on line, can be one of: top, bottom, left, right, center. Default below.
                    position: "left",

                    // Adjustment along x-axis (left-right) of label relative to above number (can be negative)
                    // For horizontal lines positioned left or right, negative values move
                    // the label toward the edge, and positive values toward the center.
                    xAdjust: 40,

                    // Adjustment along y-axis (top-bottom) of label relative to above number (can be negative)
                    // For vertical lines positioned top or bottom, negative values move
                    // the label toward the edge, and positive values toward the center.
                    yAdjust: 17,

                    // Whether the label is enabled and should be displayed
                    enabled: true,

                    // Text to display in label - default is null
                    content: "World 2021 Target: "+ goal2021
                },
                onClick: function(e) {
                  // The annotation is is bound to the `this` variable
                  console.log("Annotation", e.type, this);
                }
              },

              {
                drawTime: "afterDatasetsDraw",
                id: "hline1",
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: co2Val,
                borderColor: "transparent",
                borderWidth: 0,
                label: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    fontFamily: "Titillium Web",
                    fontSize: 14,
                    fontStyle: "400",
                    fontColor: "#00aed9",
                    xPadding: 6,
                    yPadding: 6,
                    cornerRadius: 6,
                    position: "left",
                    xAdjust: 40,
                    yAdjust: 17,
                    enabled: true,
                    content: "Your Current CO₂ Level: " + co2Val
                }
              },

              {
                drawTime: "afterDatasetsDraw",
                id: "hline2",
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: avgNow,
                borderColor: "transparent",
                borderWidth: 0,
                label: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    fontFamily: "Titillium Web",
                    fontSize: 14,
                    fontStyle: "400",
                    fontColor: "rgba(44,62,80,0.6)",
                    xPadding: 6,
                    yPadding: 6,
                    cornerRadius: 6,
                    position: "left",
                    xAdjust: 40,
                    yAdjust: 17,
                    enabled: true,
                    content: "World Average 2015: " + avgNow
                }
            }
            ]
            
        }
    }
});


}


var options = {
  useEasing: true, 
  useGrouping: true, 
  separator: ',', 
  decimal: '.', 
};



