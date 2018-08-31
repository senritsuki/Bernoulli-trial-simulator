import * as React from 'react';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';

export interface Props {
    probability: number;
    people: number;
    seed: number;
    trial: number;
    people_count: number[];
}

export const Component: React.SFC<Props> = props => {
    return (
        <div>
            <div className="ms-Grid">
                {props.people_count.map((p, i) => printProgress(i, p, props.people))}
            </div>
        </div>
    );
}

function printProgress(key: number, value: number, people: number): JSX.Element {
    return (
        <div className="ms-Grid-row progress">
            <div className="ms-Grid-col ms-lg1" style={{'textAlign': 'right'}}>
                <p><b>{key}</b> 回成功</p>
            </div>
            <div className="ms-Grid-col ms-lg1" style={{'textAlign': 'right'}}>
                <p><b>{value}</b> 人</p>
            </div>
            <div className="ms-Grid-col ms-lg1" style={{'textAlign': 'right'}}>
                <p><b>{(100 * value / people).toFixed(3)}</b> %</p>
            </div>
            <div className="ms-Grid-col ms-lg9">
                <ProgressIndicator
                    //label={key}
                    description={`${value}`}
                    percentComplete={value / people}
                    barHeight={3}
                />
            </div>
        </div>
    );
}
