import * as React from 'react';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';

import * as rs from './random_statistics';

export interface Props {
    probability: number;
    people: number;
    seed: number;
    trial: number;
    people_count: number[];
}

export const Component: React.SFC<Props> = props => {
    const total = props.trial * props.people;
    const success = rs.countTotal(props.people_count);
    return (
        <div>
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    {printDl('probability', props.probability)}
                    {printDl('people', props.people)}
                    {printDl('seed', props.seed)}
                    {printDl('trial', props.trial)}
                    {printDl('total', total)}
                    {printDl('success', success)}
                    {printDl('probability', success / total)}
                </div>
            </div>
            <div className="ms-Grid">
                {props.people_count.map((p, i) => printProgress(i, p, props.people))}
            </div>
        </div>
    );
}

function printDl(key: string, value: number): JSX.Element {
    return (
        <div className="ms-Grid-col ms-lg1">
            <h3 style={{'borderBottom': '1px solid #eee'}}>{key}</h3>
            <p>{value}</p>
        </div>
    );
}

function printProgress(key: number, value: number, people: number): JSX.Element {
    return (
        <div className="ms-Grid-row progress">
            <div className="ms-Grid-col ms-lg1">
                <p>{key} 枚</p>
            </div>
            <div className="ms-Grid-col ms-lg1" style={{'textAlign': 'right'}}>
                <p>{value} 人</p>
            </div>
            <div className="ms-Grid-col ms-lg10">
                <ProgressIndicator
                    //label={key}
                    description={`${value}`}
                    percentComplete={value / people}
                />
            </div>
        </div>
    );
}
