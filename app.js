// Initialize the dashboard
function init() {
    // Load the data from the JSON file
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
        console.log(data);

        // Populate the dropdown menu with options
        var names = data.names;
        var dropdown = d3.select("#selDataset");

        names.forEach(function (name) {
            dropdown
                .append("option")
                .text(name)
                .property("value", name);
        });

        // Display the default plot
        var defaultID = names[0];
        buildPlots(defaultID);
    });
}

// Function to build plots based on the selected ID
function buildPlots(id) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
        console.log(data);

        // Extract data for the selected ID
        var selectedSample = data.samples.find(sample => sample.id === id);
        var selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(id));

        // Extract sample values, OTU IDs, and OTU labels
        var sample_values = selectedSample.sample_values;
        var otu_ids = selectedSample.otu_ids;
        var otu_labels = selectedSample.otu_labels;

        // Get the top 10 OTUs
        var top_10_sample_values = sample_values.slice(0, 10);
        var top_10_otu_ids = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        var top_10_otu_labels = otu_labels.slice(0, 10);

        // Update the demographic info panel
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

        // Create Bar Chart
        var trace1 = {
            x: top_10_sample_values.reverse(),
            y: top_10_otu_ids.reverse(),
            text: top_10_otu_labels.reverse(),
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(27, 161, 187)',
                opacity: 0.6,
                line: {
                    color: 'rgb(8, 48, 107)',
                    width: 1.5
                }
            }
        };

        var layout1 = {
            title: '<b>Top 10 OTU</b>',
        };

        var data1 = [trace1];

        Plotly.newPlot('bar', data1, layout1);

        // Create Bubble Chart
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Viridis'
            }
        };

        var layout2 = {
            title: '<b>Bubble Chart</b>',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' },
        };

        var data2 = [trace2];

        Plotly.newPlot('bubble', data2, layout2);
    });
}

// Function to handle dropdown change
function optionChanged(id) {
    buildPlots(id);
}

// Initialize the dashboard
init();
