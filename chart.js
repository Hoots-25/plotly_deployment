function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples_array = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selected_array = samples_array.filter(sampleObj => sampleObj.id == sample);
    var wash_data = data.metadata.filter(obj => obj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var new_result = selected_array[0];
    wash_data = wash_data[0];   

  
  
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var o_ids = new_result.otu_ids;
    var o_labels = new_result.otu_labels;
    var o_values = new_result.sample_values.slice(0,10).reverse();
    var b_values = new_result.sample_values; // Need unedited verison of values
    var wash_freq = wash_data.wfreq // Wash Frequency
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = o_ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();

    console.log(yticks)

    // 8. Create the trace for the bar chart. 
  
    var barData = [{
      x: o_values,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: o_labels 
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {Title: "Top Bacteria Cultures", 
    xaxis: {title: "Bacteria Count"},
    yaxis: {title: "Bacteria Name"},
    width: 500,
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
    // 1. Create the trace for the bubble chart.
   

    var bubbleData = [{
      x: o_ids,
      y: b_values,
      text: o_labels,
      mode: "markers",
       marker: {
        size: b_values,
        color: o_ids,
        colorscale: "YlGnBu"
       }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    // // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain:{x: [0, 1], y: [0, 1] },
        value: wash_freq,
        title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 5] },
          bar: { color: "black" },
          steps: [
            {range: [0, 1], color: "red" },
            {range: [1, 2], color: "orange" },
            {range: [2, 3], color: "yellow" },
            {range: [3, 4], color: "limegreen"},
            {range: [4, 5], color: "green" }],
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 450, 
      margin: { t: 0, b: 0 }
    };
 
    // // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
}


