import * as React from 'react';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

export interface Model {
    probability: number;
    people: number;
    seed: number;
}

export interface Props {
    probability: number;
    people: number;
    seed: number;
    onApply: (model: Model) => void;
}

export interface State {
    hideDialog: boolean;
    probability: number;
    people: number;
    seed: number;
}

export class ConfigDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hideDialog: true,
            probability: props.probability,
            people: props.people,
            seed: props.seed,
        };
    }

    render() {
        return (
            <div>
                <DefaultButton text="config" onClick={() => this.openDialog()} />
                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={() => this.closeDialog()}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: 'Config',
                        subText: 'Select probability, people'
                    }}
                >
                    <div className="ms-Grid">
                        {dialogRaw('probability', this.props.probability, 
                            s => this.setState({'probability': +s}), 
                            () => '' + this.state.probability)}
                        {dialogRaw('people', this.props.people, 
                            s => this.setState({'people': +s}), 
                            () => '' + this.state.people)}
                        {dialogRaw('seed',  this.props.seed, 
                            s => this.setState({'seed': isNaN(+s) ? NaN : +s >>> 0}), 
                            () => '' + this.state.seed)}
                    </div>
                    <DialogFooter>
                        <PrimaryButton onClick={() => this.closeDialogAndUpdate()} text="Update" />
                        <DefaultButton onClick={() => this.closeDialog()} text="Cancel" />
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

function dialogRaw(label: string, defValue: number, onChanged: (s: string) => void, show: () => string): JSX.Element {
    return (
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg6">
                <TextField
                    label={label}
                    defaultValue={'' + defValue}
                    onChanged={s => onChanged(s)}
                />
            </div>
            <div className="ms-Grid-col ms-lg6">
                <p>{show()}</p>
            </div>
        </div>
    );
}
