// src/index.js

// Include the core fusioncharts file from core
import FusionCharts from 'fusioncharts/core';

// Include the chart from viz folder
// E.g. - import ChartType from fusioncharts/viz/[ChartType]
import Bubble from 'fusioncharts/viz/bubble';

// Include the fusion theme
import FusionTheme from 'fusioncharts/themes/es/fusioncharts.theme.fusion';

//add the div tag for the chart container
const myDiv = document.createElement('div');
myDiv.id = 'chart-container';
document.body.appendChild(myDiv);

//define the position of X,Y variables in data file
const Z_IND = 3;
const X_IND = 4;
const Y_IND = 2;

async function main() {
    //Get the data
    let response = await fetch('/mlRepo');
    let data = await response.text();
    if (response.ok){        
        renderPage(data);
    }
    else {
        alert('Error reading data from ML repository');
    }
}

//renders the html page when passed data as text
function renderPage(text){
    var matrix = textToMatrix(text);
    var dataset = convertMatrixToJson(matrix);
    var dataSource = constructDataSource(dataset);
    renderChart(dataSource);
}

//convert text to matrix
function textToMatrix(text){
    var matrix = [];
    var rows = text.split("\n");
    for(var i=0;i<rows.length;i++){
        var cols = rows[i].split(/\s+/);
        if (cols.length > 1)
        matrix.push(cols);
    }
    return matrix;
}

//returns JSON text for 'dataset' key 
function convertMatrixToJson(matrix){
    //JSON for dataset
    var dataset = [];
    var data = [];

    for (var i=0;i<matrix.length;++i)
    {       
        data.push({x:matrix[i][X_IND],y:matrix[i][Y_IND],z:matrix[i][Z_IND]});       
        
    }
    dataset.push({data: data});
    return dataset;
}

//constructs JSON text for 'dataSource' key
function constructDataSource(dataset){
      var dataSource = {"chart": {
        "caption": "Challenger USA Space Shuttle O-Ring Data Set ",
        "subcaption": "Data Source: UCI Machine Learning Repository",
        "xAxisName": "Temporal Order of Flights --> (bubble size: leak-check pressure)",
        "YAxisName": "Laumch Temperature",
        "ynumbersuffix": " Degree F",
        "theme": "fusion", 
        "plotToolText": "<b>$yDataValue</b> launch temperature with leak-check pressure: <b>$zvalue</b>"

    }, 
    dataset};    
    return dataSource;
}

// Draw the chart
function renderChart(dataSrc){

    FusionCharts.addDep(Bubble);
    FusionCharts.addDep(FusionTheme);

    //Chart Configurations
    const chartConfig = { 
        type: 'bubble',
        renderAt: 'chart-container',
        width: '80%',
        height: '600',
        dataFormat: 'json',
        dataSource: dataSrc
    }

    //Create an Instance with chart options and render the chart
    var chartInstance = new FusionCharts(chartConfig);
    chartInstance.render();
}

//Call main method
main();
