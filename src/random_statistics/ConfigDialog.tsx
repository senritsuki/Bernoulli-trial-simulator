import * as React from 'react';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

export interface Model {
    probability: number;
    people: number;
    goal: number;
    seed: number;
}

export interface Props {
    probability: number;
    people: number;
    goal: number;
    seed: number;
    onApply: (model: Model) => void;
}

export interface State {
    hideDialog: boolean;
    probability: number;
    people: number;
    goal: number;
    seed: number;
}

export class ConfigDialogButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hideDialog: true,
            probability: props.probability,
            people: props.people,
            goal: props.goal,
            seed: props.seed,
        };
    }

    render() {
        return (
            <div>
                <DefaultButton text="条件変更" onClick={() => this.openDialog()} />
                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={() => this.closeDialog()}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: '条件変更',
                        subText: '人数を増やすほど処理が重くなります。'
                    }}
                >
                    <div className="ms-Grid">
                        {rowTextField('成功率', this.props.probability, 
                            s => this.setState({probability: +s}), 
                            '0.0～1.0の小数',
                            () => '' + (this.state.probability * 100).toFixed(3) + '%')}
                        {rowTextField('挑戦人数', this.props.people, 
                            s => this.setState({people: +s}), 
                            '1以上の整数',
                            () => '' + this.state.people + '人')}
                        {rowTextField('目標', this.props.goal, 
                            s => this.setState({goal: +s}), 
                            '1以上の整数',
                            () => '' + this.state.goal + '回成功')}
                        {rowTextField('seed',  this.props.seed, 
                            s => this.setState({seed: isNaN(+s) ? NaN : +s >>> 0}), 
                            '0以外の整数',
                            () => '' + this.state.seed)}
                    </div>
                    <DialogFooter>
                        <PrimaryButton onClick={() => this.closeDialogAndUpdate()} text="更新" />
                        <DefaultButton onClick={() => this.closeDialog()} text="キャンセル" />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    }

    openDialog(): void {
        this.setState({hideDialog: false});
    }
    closeDialog(): void {
        this.setState({hideDialog: true});
    }
    closeDialogAndUpdate(): void {
        this.setState({hideDialog: true});
        this.props.onApply(this.state);
    }
}

function rowTextField(label: string, defValue: number, onChanged: (s: string) => void, comment: string, show: () => string): JSX.Element {
    return (
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg6">
                <TextField
                    label={label}
                    defaultValue={'' + defValue}
                    onChanged={s => onChanged(s)}
                />
            </div>
            <div className="ms-Grid-col ms-lg6" style={{'fontSize': '90%'}}>
                <p>{comment}</p>
                <p>→ {show()}</p>
            </div>
        </div>
    );
}
