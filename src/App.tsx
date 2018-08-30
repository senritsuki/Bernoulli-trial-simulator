import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

import './App.css';
import logo from './logo.svg';

import * as rs from './random_statistics/random_statistics';
import * as vm from './random_statistics/model';
import * as config from './random_statistics/config';

interface State {
  probability: number;
  people: number;
  seed: number;
  trial: number;
  people_count: number[];
}

class App extends React.Component<{}, State> {
  random: rs.XORShift;

  constructor(props: {}) {
    super(props);
    const probability = 0.007;
    const people = 10000;
    const seed = Math.floor(Math.random() * 0xffffffff);
    this.random = new rs.XORShift(seed);
    this.state = {
      probability: probability,
      people: people,
      seed: seed,
      trial: 0,
      people_count: [people],
    }
  }

  public render() {
    return (
      <div>
        <header className="App App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="ms-Grid" style={{'margin': '10px 0'}}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg1">
              <PrimaryButton text="1" onClick={() => this.usecase_summon(1)} />
            </div>
            <div className="ms-Grid-col ms-lg1">
              <PrimaryButton text="10" onClick={() => this.usecase_summon(10)} />
            </div>
            <div className="ms-Grid-col ms-lg1">
              <PrimaryButton text="100" onClick={() => this.usecase_summon(100)} />
            </div>
            <div className="ms-Grid-col ms-lg1">
              <config.ConfigDialog
                probability={this.state.probability}
                people={this.state.people}
                seed={this.state.seed}
                onApply={newConfig => this.usecase_updateConfig(newConfig)}
              />
            </div>
          </div>
        </div>
        <vm.Component
          probability={this.state.probability}
          people={this.state.people}
          seed={this.state.seed}
          trial={this.state.trial}
          people_count={this.state.people_count}
        />
      </div>
    );
  }

  usecase_summon(loop: number): void {
    if (loop <= 0) return;
    const new_people_count = rs.exec_with_distribution(
        () => this.random.random(), this.state.probability, this.state.people_count);
    this.setState({
      trial: this.state.trial + 1,
      people_count: new_people_count,
    });
    setTimeout(() => this.usecase_summon(loop - 1), 100);
  }

  usecase_updateConfig(newConfig: config.Model): void {
    this.random = new rs.XORShift(newConfig.seed);
    this.setState({
      probability: newConfig.probability,
      people: newConfig.people,
      seed: newConfig.seed,
      trial: 0,
      people_count: [newConfig.people],
    });
  }
}

export default App;
