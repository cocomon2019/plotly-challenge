// Use d3.json to fetch the metadata for a sample
d3.json("samples.json").then(function(data) {
  samples = data.samples;
  metadata = data.metadata;
  names = data.names;
  // console.log(samples)
  // console.log(metadata)

  function init() {
    //Creating select statement
    names.forEach(t => {
      d3.select("#selDataset")
        .append("option")
        .attr("value", t)
        .text(t);
    });

    // Creating bar chart for the top labels
    var top_bar_labels = samples[0].otu_ids.slice(0, 10);
    var top_bar_values = samples[0].sample_values.slice(0, 10);

    // console.log(labels)

    var trace1 = {
      type: "bar",
      x: top_bar_values.reverse(),
      y: top_bar_labels.reverse().map(t => `OTU ${t}`),
      orientation: "h"
    };

    var bar1 = [trace1];

    bar1_layout = {
      height: 600,
      width: 500
    };

    Plotly.newPlot("bar", bar1, bar1_layout);

    // Creating bubble chart
    var trace2 = {
      x: samples[0].otu_ids,
      y: samples[0].sample_values,
      mode: "markers",
      marker: {
        size: samples[0].sample_values,
        color: samples[0].otu_ids
      },
      text: samples[0].otu_labels
    };

    var bubble2 = [trace2];

    bubble2_layout = {
      xaxis: {
        title: "OTU ID"
      }
    };
    Plotly.newPlot("bubble-plot", bubble2, bubble2_layout);

    // Create the demographic for metadata

    Object.entries(metadata[0]).forEach(([key, value]) => {
      d3.select("#sample-metadata")
        .append("p")
        .text(`${key} : ${value}`);
    });
  }

  d3.selectAll("#selDataset").on("change", updatePlotly);

  function updatePlotly() {
    var data = d3.select("#selDataset").property("value");
    console.log(data_set);

    // Create the variable to filtered the data
    var filtered_data = samples.filter(r => r.id == data_set)[0];

    // Re-styling bar chart
    var barValues = filtered_data.sample_values.slice(0, 10).reverse();
    var barLabels = filtered_data.otu_ids
      .slice(0, 10)
      .reverse()
      .map(t => `OTU ${t}`);

    Plotly.restyle("bar", "x", [barValues]);
    Plotly.restyle("bar", "y", [barLabels]);

    // Re-styling bubble chart
    var xBubbles = filtered_data.otu_ids;
    var yBubbles = filtered_data.sample_values;
    var updateBubbles = {
      size: filtered_data.sample_values,
      color: filtered_data.otu_ids
    };
    var textBubbles = filtered_data.otu_ids;

    Plotly.restyle("bubble-plot", "x", [xBubbles]);
    Plotly.restyle("bubble-plot", "y", [yBubbles]);
    Plotly.restyle("bubble-plot", "marker", [updateBubbles]);
    Plotly.restyle("bubble-plot", "text", [textBubbles]);

    // Changing metadata information
    d3.select("#sample-metadata").html("");

    Object.entries(metadata.filter(i => i.id == data)[0]).forEach(
      ([key, value]) => {
        d3.select("#sample-metadata")
          .append("p")
          .text(`${key} : ${value}`);
      }
    );
  }

  init();
});
