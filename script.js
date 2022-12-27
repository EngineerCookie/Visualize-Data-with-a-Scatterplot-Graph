async function getData(url) {
    const response = await fetch(url);

    return response.json();
}

const data = await getData('./cyclist-data.json')

const height = 650, width = 950, paddingT = 70, paddingRB = 30, paddingL = 80;
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    ;

const xScale = d3.scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
    .range([paddingL, width - paddingRB])
    ;

const yScale = d3.scaleLinear()
    .domain([d3.max(data, (d) => d.Seconds * 1000), d3.min(data, (d) => d.Seconds * 1000)])
    .range([height - paddingRB, paddingT])
    ;


//Add Title
svg.append('text')
    .attr('id', 'title')
    .attr('x', 500)
    .attr('y', paddingT - 35)
    .attr("text-anchor", "middle")
    .text('Doping in Professional Bicycle Racing');

//Add sub-title
svg.append('text')
    .attr('id', 'sub-title')
    .attr('x', 500)
    .attr('y', paddingT - 10)
    .attr('text-anchor', 'middle')
    .text('35 Fastest times up Alpe d\'Huez')
    ;


//Add Scatterred points and tooltip
let tooltip = d3.select('.canvas')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)
    ;

let tooltipText = (data) => {
    return `${data.Name}: ${data.Nationality}<br>
    Year: ${data.Year}, 
    Time: ${data.Time}<br>
    ${data.Doping}`
}

svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('class', 'dot')
    .attr('data-dopping', (d) => {
        if (d.Doping === '') { return 'no' }
        else { return 'yes' }
    })
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => { return new Date(d.Seconds * 1000) })
    .attr('cx', (d) => xScale(d.Year))
    .attr('cy', (d) => yScale((d.Seconds * 1000)))
    .on('mouseover', function (d, info) { //tooltips
        tooltip.attr('data-year', info.Year);
        tooltip.attr('class', 'show')
        tooltip.transition()
            .duration(200)
            .style('opacity', 0.9)
        tooltip.html(`${tooltipText(info)}`)
            .style('top', `${d.pageY}px`)
            .style('left', `${d.pageX + 20}px`)
    })
    .on('mouseout', function (d) {
        tooltip.attr('class', '');
        tooltip.transition()
            .duration(500)
            .style('opacity', 0)
    })
    ;


//Add x-axis
const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
svg.append('g')
    .attr('transform', `translate(0, ${height - paddingRB})`)
    .attr('id', 'x-axis')
    .call(xAxis)
    ;


//Add y-axis
const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
svg.append('g')
    .attr('transform', `translate(${paddingL}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis)
    .call(g => g.append("text")
        .attr("x", -280)
        .attr("y", -50)
        .attr('transform', `rotate(-90)`)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr('class', 'label')
        .text('Time in Minutes'))
    ;
//Add legends
svg.append('g')
    .attr('id', 'legend')
    .call(g => {
        g.append('text')
            .attr('class', 'legend-label')
            .text('No doping allegations')
            .attr('x', width - paddingRB - 20)
            .attr('text-anchor', 'end')
            .attr('y', 200);
        g.append('rect')
            .attr('class', 'legend-icon')
            .attr('data-dopping', 'no')
            .attr('x', width - paddingRB - 15)
            .attr('y', 200 - 15);
        g.append('text')
            .attr('class', 'legend-label')
            .text('Riders with doping allegations')
            .attr('x', width - paddingRB - 20)
            .attr('text-anchor', 'end')
            .attr('y', 220);
        g.append('rect')
            .attr('class', 'legend-icon')
            .attr('data-dopping', 'yes')
            .attr('x', width - paddingRB - 15)
            .attr('y', 220 - 15);
    })
    ;
