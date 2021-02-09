// react
import React, { Component } from 'react';

// components
import BitcoinPriceChart from './components/BitcoinPriceChart';

// styles
import './styles/globals.css';

class App extends Component {
  // class constructor with state (old skool)
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  // fetch data in componentDidMount() (also old skool
  componentDidMount() {
    // fetch data from api + transform data for chart & setState
    fetch('https://api.coindesk.com/v1/bpi/historical/close.json')
      .then((res) => res.json())
      .then((data) => {
        // transform data and also store into state -- inline here (harder to test)
        this.setState({
          data: Object.keys(data.bpi).map((date) => {
            return {
              date: new Date(date), // create js dates from strings
              price: data.bpi[date],
            };
          }),
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    // get data from state
    const { data } = this.state;

    return (
      <div>
        <header className="app-header">
          <h1>React + D3 Bitcoin Area Chart</h1>
        </header>
        <BitcoinPriceChart data={data} />
      </div>
    );
  }
}

export default App;
