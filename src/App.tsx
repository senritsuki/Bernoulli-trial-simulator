import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import './App.css';

import * as rs from './random_statistics/random_statistics';
import * as vm from './random_statistics/model';
import * as config from './random_statistics/ConfigDialog';

interface State {
  probability: number;
  people: number;
  goal: number;
  seed: number;
  useAnimation: boolean;
  trial: number;
  people_count: number[];
  people_goaled: number;
}

class App extends React.Component<{}, State> {
  random: rs.XORShift;

  constructor(props: {}) {
    super(props);
    const probability = 0.007;
    const people = 10000;
    const goal = 1;
    const seed = Math.floor(Math.random() * 0xffffffff);
    this.random = new rs.XORShift(seed);
    this.state = {
      probability: probability,
      people: people,
      goal: goal,
      seed: seed,
      useAnimation: true,
      trial: 0,
      people_count: [people],
      people_goaled: people - rs.countIfLessThan([people], goal),
    }
  }

  public render() {
    const total = this.state.trial * this.state.people;
    const success = rs.sumTotal(this.state.people_count);
    return (
      <div>
        <div className="ms-Grid" style={{'textAlign': 'center'}}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12">
              <h2>成功率 <b>{(this.state.probability * 100).toFixed(3)}</b> % の <b>{this.state.goal}</b> 回成功に <b>{this.state.people}</b> 人が挑戦</h2>
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg3">
            </div>
            <div className="ms-Grid-col ms-lg2">
              <h3>試行 <b className="blue">{this.state.trial}</b> 回</h3>
            </div>
            <div className="ms-Grid-col ms-lg2">
              <h3>達成者 <b className="red">{this.state.people_goaled}</b> 人</h3>
            </div>
            <div className="ms-Grid-col ms-lg2">
              <h3>未達成者 <b className="green">{this.state.people - this.state.people_goaled}</b> 人</h3>
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg2">
            </div>
            <div className="ms-Grid-col ms-lg2">
              <h4>試行総数 <b>{total}</b></h4>
            </div>
            <div className="ms-Grid-col ms-lg2">
              <h4>成功総数 <b>{success}</b></h4>
            </div>
            <div className="ms-Grid-col ms-lg2">
              <h4>実成功率 <b>{(100 * success / total).toFixed(6)}</b></h4>
            </div>
            <div className="ms-Grid-col ms-lg2">
              <h4>seed <b>{this.state.seed}</b></h4>
            </div>
          </div>
          <div className="ms-Grid-row" style={{'margin': '1em 0'}}>
            <div className="ms-Grid-col ms-lg12">
              <config.ConfigDialogButton
                probability={this.state.probability}
                people={this.state.people}
                goal={this.state.goal}
                seed={this.state.seed}
                onApply={newConfig => this.usecase_updateConfig(newConfig)}
              />
            </div>
          </div>
          <div className="ms-Grid-row" style={{'margin': '1em 0'}}>
            <div className="ms-Grid-col ms-lg4">
            </div>
            <div className="ms-Grid-col ms-lg1">
              <PrimaryButton text="1 回" onClick={() => this.usecase_summon(1)} />
            </div>
            <div className="ms-Grid-col ms-lg1">
              <PrimaryButton text="5 回" onClick={() => this.usecase_summon(5)} />
            </div>
            <div className="ms-Grid-col ms-lg1">
              <PrimaryButton text="10 回" onClick={() => this.usecase_summon(10)} />
            </div>
            <div className="ms-Grid-col ms-lg1">
              <PrimaryButton text="50 回" onClick={() => this.usecase_summon(50)} />
            </div>
            <div className="ms-Grid-col ms-lg2">
              <Toggle
                  defaultChecked={this.state.useAnimation}
                  onText="animation on"
                  offText="animation off"
                  onChanged={b => this.setState({useAnimation: b})}
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
    if (this.state.useAnimation) {
      this.summon_animation(loop);
    } else {
      this.summon_nonanimation(loop);
    }
  }

  summon_animation(loop: number): void {
    if (loop <= 0) return;
    const new_people_count = rs.exec_with_distribution(
        () => this.random.random(), this.state.probability, this.state.people_count);
    this.setState({
      trial: this.state.trial + 1,
      people_count: new_people_count,
      people_goaled: this.state.people - rs.countIfLessThan(new_people_count, this.state.goal),
    });
    setTimeout(() => this.usecase_summon(loop - 1), 450 / (loop + 0.5) + 50);
  }

  summon_nonanimation(loop: number): void {
    let new_people_count = this.state.people_count;
    for (let i = 0; i < loop; i++) {
      new_people_count = rs.exec_with_distribution(
        () => this.random.random(), this.state.probability, new_people_count);
    }
    this.setState({
      trial: this.state.trial + loop,
      people_count: new_people_count,
      people_goaled: this.state.people - rs.countIfLessThan(new_people_count, this.state.goal),
    });
  }

  usecase_updateConfig(newConfig: config.Model): void {
    this.random = new rs.XORShift(newConfig.seed);
    this.setState({
      probability: newConfig.probability,
      people: newConfig.people,
      goal: newConfig.goal,
      seed: newConfig.seed,
      trial: 0,
      people_count: [newConfig.people],
      people_goaled: newConfig.people - rs.countIfLessThan([newConfig.people], newConfig.goal),
    });
  }
}

export default App;
