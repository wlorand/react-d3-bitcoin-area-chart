// react
import React, { Component } from 'react';

// d3
import * as d3 from 'd3';
window.d3 = d3;

// styles  -- refactor his inline styles to a className and component stylesheet (at least)

// dimensions -- why are these outside the component ?
const width = 650;
const height = 400;
const margin = {
  top: 20,
  right: 5,
  bottom: 50,
  left: 60,
};

class BitcoinPriceChart extends Component {
  // constructor -- with local component state here too
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  // axis: why are these inside the componet, but outside the lifecycle methods?
  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    // destructuire the data from props
    const { data } = nextProps;
    if (!data) return {};
    console.log(data); // debug: proof the data was fetched and passed to the component

    // measure the data
    const xExtent = d3.extent(data, (d) => d.date); // returns [] pair
    const yExtent = d3.extent(data, (d) => d.price); // returns [] pair
    const minY = d3.min(data, (d) => d.price); // can you use yExtent[0] instead?

    // scales
    const xScale = d3
      .scaleTime()
      .domain(xExtent)
      .range(margin.left, width - margin.right);

    const yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range(height - margin.bottom, margin.top);

    // define the line for line chart
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.price));

    // define the area for area chart
    const area = d3
      .area()
      .x((d) => xScale(d.date))
      .y0((d) => yScale(minY))
      .y1((d) => yScale(d.price));

    console.log(`yExtent[0] is ${yExtent[0]}`);
    console.log(`minY is ${minY}`); // same - do the swap-out

    return { xScale, yScale, data, line, area };
  }

  componentDidUpdate() {
    // call the axes -- bad tutorial code uses d3.select for direct DOM selection
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);

    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    // destructure data, shapes from state
    const { data, line, area } = this.state;

    return (
      <div className="chart-container">
        <svg width={width} height={height}>
          {/* define the line path */}
          <path
            d={line(data)}
            id={'line'}
            stroke="#6788AD"
            fill="transparent"
          />
          {/* define the area path */}
          <path
            d={area(data)}
            id={'area'}
            style={{ opacity: 0.2 }}
            fill="#6788AD"
          />
          {/* reference / call the axes */}
          <g
            ref="xAxis"
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
          {/* render the axis label text */}
          <text
            transform={`translate(${width / 2 - margin.left - margin.right}, ${
              height - 10
            })`}
          >
            Last 30 Days
          </text>
          <text
            transform={`translate(15, ${
              (height - margin.bottom) / 1.5
            }) rotate(270)`}
          >
            Closing Price (USD)
          </text>
        </svg>
      </div>
    );
  }
}

export default BitcoinPriceChart;
