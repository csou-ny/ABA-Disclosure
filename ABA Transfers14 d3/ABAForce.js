function makeNetwork() {
    d3.json( "data14TargetFull.json" ).then( res => {
        
        const width = 800;
        const height = 600;
        const margin = 100;
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        color.domain([0,res.ps.length]);

        var svg = d3.select("body").append("svg").attr("width",width).attr("height",height);
        const chart = svg.append("g").attr("transform", `translate(${[margin/2 + width/2,margin/2 + height/2]})`);
        var scC = d3.scaleOrdinal( d3.schemeCategory10 )
        draw(chart);

        function draw(chart) {
        chart.selectAll('line')
                .data(res.ln).enter()
                .append('line')
                .attr("x1", d => d.source.x)
                .attr("x2", d => d.target.x)
                .attr("y1", d => d.source.y)
                .attr("y2", d => d.target.y)
                .style("fill", 'none')
                .style("stroke", 'black')
                .style("stroke-width", d => d.value * d.value)

        chart.selectAll("circle")
                .data(res.ps).enter()
                .append("circle")
                .attr("r", 15)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .style("fill", (d,i) => color(i))
                .style("stroke", 'black')
                .on("mouseover", highlightNode)
                .on("mouseout", fade);

        chart.selectAll("text")
                .data(res.ps).enter()
                .append("text")
                .text(d => d.node)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
        }

        function redraw(chart) {
        chart.selectAll("circle")
                .transition().duration(2000)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

        chart.selectAll("text")
                .transition().duration(2000)
                .attr("x", d => d.x)
                .attr("y", d => d.y);

        chart.selectAll('line')
                .transition().duration(2000)
                .attr("x1", d => d.source.x)
                .attr("x2", d => d.target.x)
                .attr("y1", d => d.source.y)
                .attr("y2", d => d.target.y)
        }

        function highlightNode(node){
                 d3.selectAll("circle").classed("highlight", d=> d === node);
                 d3.selectAll("circle").classed("faded", d => !(d === node 
        || res.ln.filter(k => k.source == node)
            .filter(m => m.target == d).length > 0
        || res.ln.filter(k => k.target == node)
            .filter(m => m.source == d).length > 0));

                d3.selectAll("line").classed("faded", edge => !(edge.source === node
        || edge.target === node));               
            }
        function fade()
                    {
                     d3.selectAll("circle, line").classed("faded highlight", false);
                        }

        chart.selectAll("circle")
            .on("mouseover", highlightNode)
            .on("mouseout", fade);

        d3.shuffle( res.ps ); d3.shuffle( res.ln );
        
        d3.forceSimulation( res.ps )
            .force("ct", d3.forceCenter( 400, 400 ) )
            .force("ln",
                   d3.forceLink( res.ln ).distance(150).id(d=>d.id) )
            .force("hc", d3.forceCollide().strength(0.4) )
            .force("many", d3.forceManyBody().strength(-75) )
            .on( "end", function() {
                svg.selectAll( "line" ).data( res.ln ).enter()
                    .append( "line" ).attr( "stroke", "green" )
                    .attr( "x1", d=> d.source.x)
                    .attr( "y1", d=> d.source.y)
                    .attr( "x2", d=> d.target.x)
                    .attr( "y2", d=> d.target.y);
            
                svg.selectAll("circle").data(res.ps).enter()
                    .append("circle")
                    .attr( "r", 7 ).attr( "fill", (d,i) => scC(i) )
                    .attr( "cx", d=>d.x ).attr( "cy", d=>d.y )

                svg.selectAll("text").data(res.ps).enter()
                    .append("text")
                    .attr( "x", d=>d.x ).attr( "y", d=>d.y )
                    .attr( "text-anchor", "start" )
                    .attr( "font-size", 7 )
                    .text( d=>d.id );   

            } )
    } );
}
