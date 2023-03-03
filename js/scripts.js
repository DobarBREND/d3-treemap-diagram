let movieSalesDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let movieSalesData

let canvas = d3.select("#canvas");

let body = d3.select("body");



let createTreeMap = () => {
    let list = d3.hierarchy(movieSalesData, (node) => {
        return node["children"]
    }).sum((node) => {
        return node["value"]
    }).sort((node1, node2) => {
        return node2["value"] - node1["value"] 
    })

    let defineTreeMap = d3.treemap()
                        .size([1000, 600])

    defineTreeMap(list)

    let tooltip = body
            .append("div")
            .attr("class", "tooltip")
            .attr("id", "tooltip")
            .style("opacity", 0);


    let movieTile = list.leaves()
    
    let tile = canvas.selectAll("g")
            .data(movieTile)
            .enter()
            .append("g")
            .attr("transform", (movie) => {
                return "translate(" + movie["x0"] + ", " + movie["y0"] + ")"
            })

        tile.append("rect")
                .attr("class", "tile")
                .attr("fill", (movie) => {
                    let category = movie["data"]["category"]
                    if(category === "Action") {
                        return "#1f77b4"
                    } else if(category === "Drama") {
                        return "#ff7f0e"
                    } else if(category === "Adventure") {
                        return "#2ca02c"
                    } else if(category === "Family") {
                        return "#d62728"
                    } else if(category === "Animation") {
                        return "#9467bd"
                    } else if(category === "Comedy") {
                        return "#e377c2"
                    } else if(category === "Biography") {
                        return "#17becf"
                    }
                })
                .attr("data-name", (movie) => {
                    return movie["data"]["name"]
                })
                .attr("data-category", (movie) => {
                    return movie["data"]["category"]
                })
                .attr("data-value", (movie) => {
                    return movie["data"]["value"]
                })
                .attr("width", (movie) => {
                    return movie["x1"] - movie["x0"]
                })
                .attr("height", (movie) => {
                    return movie["y1"] - movie["y0"]
                });
                
                       
                    
        tile.on("mousemove", function (event, d) {
                      tooltip.style('opacity', 0.9)
                      tooltip
                        .html(
                          "Name: " +
                            d.data.name.toUpperCase().bold() +
                            "<br>Category: " +
                            d.data.category +
                            "<br>Value: $" +
                            Math.round(d.data.value / 1000000) + " million"
                        )
                        .attr("data-value", d.data.value)
                        .style("left", event.pageX + 10 + "px")
                        .style("top", event.pageY - 28 + "px")
                        })
                        .on("mouseout", function () {
                        tooltip.style("opacity", 0);
                        });
              
        tile.append("text")
                    .attr("class", "tile-text")
                    .selectAll("tspan")
                    .data(function (d) {
                      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
                    })
                    .enter()
                    .append("tspan")
                    .attr("font-size", "10px")
                    .attr("fill", "lightgray")
                    .attr("x", 4)
                    .attr("y", function (d, i) {
                      return 13 + i * 10;
                    })
                    .text(function (d) {
                      return d;
                    })
                    
}

d3.json(movieSalesDataUrl).then(
    (data, error) => { // 'data' is json file being passed to js object
        if(error) {
            console.log(error)
        } else {
            movieSalesData = data
            console.log(movieSalesData)
            createTreeMap()
        }
    }
)