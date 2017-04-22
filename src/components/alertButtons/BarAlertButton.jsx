import React from 'react';

import AlertActions from '../../actions/AlertActions.jsx';
import AlertButtonService from '../../services/AlertButtonService';
import AlertService from '../../services/AlertService';

import Edit from 'material-ui/svg-icons/image/edit';
import Clear from 'material-ui/svg-icons/content/clear';
import TextField from 'material-ui/TextField';

require('../../styles/bar/AlertButton.scss');

export default class BarAlertButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            button: props.button,
            alert: props.alert,
            showInput: false,
            message: props.alert ? props.alert.message : ""
        };

        // binding
        this._createAlert = this._createAlert.bind(this);
        this._updateAlertSeverity = this._updateAlertSeverity.bind(this);
        this._updateAlertMessage = this._updateAlertMessage.bind(this);
        this._toggleMessageInput = this._toggleMessageInput.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            button: nextProps.button,
            alert: nextProps.alert,
            message: nextProps.alert ? nextProps.alert.message : ""
        });
    }

    /**
     * toggle the boolean to show/hide the message input
     */
    _toggleMessageInput() {
        this.setState({ showInput: !this.state.showInput });
    }

    /**
     * Call the AlertButtonService to create a new alert
     */
    _createAlert() {
        if (this.state.button.message && this.state.message === "") {
            this.setState({ showInput: true });
        } else {
            AlertButtonService.createAlert(this.state.button.id, this.state.message)
                .then(_ => {
                    this.setState({ showInput: false });
                })
                .catch(error => console.log("create alert button error", error));
        }
    }

    /**
     * Call the AlertService to update the severity of an alert
     */
    _updateAlertSeverity(severity) {
        if (!this.state.alert) return;

        if (severity !== "done" && severity !== "serious") {
            severity = this.state.alert.severity === "warning" ? "serious" : "done";
        }
        AlertService.update(this.state.alert.id, {severity})
            .then(data => {
                // if the alert is closed, remove it from the store
                if (data.severity === "done") {
                    AlertActions.alertClosed(data.id);
                }
            })
            .catch(error => console.log("failed to update the alert severity", error));

    }

    /**
     * Call the alert service to update the message of an alert
     */
    _updateAlertMessage() {
        AlertService.update(this.state.alert.id, {message: this.state.message})
            .then(_ => this.setState({ showInput: false }))
            .catch(error => console.log("failed to update the alert message", error));
    }

    /**
     * Update the message in the state when the input change
     *
     * @param e: event
     * @param v: the input value
     */
    _handleInputChange(e, v) {
        this.setState({ message: v });
    }

    /**
     * Handle key down on the input text
     * @param e: event
     */
    _handleKeyDown(e) {
        if(e.key === 'Enter') {
            // if an alert exists for this button, update the message
            // else, create a new alert with this message
            if (this.state.alert) {
                this._updateAlertMessage();
            } else {
                this._createAlert();
            }
        }
    }

    render() {

        const styles = {
            smallIcon: {
                width: 16,
                height: 16,
            },
            button: {
                width: 20,
                height: 20
            }
        };

        let alertButton = this.state.alert
            ?
                (<div className="AlertButton_active_container">
                    <div className="AlertButton_status">
                        {
                            this.state.alert.users && this.state.alert.users.length ? "!" : ""
                        }
                    </div>
                    <button className="AlertButton_button AlertButton_autowidth" onClick={this._updateAlertSeverity}>
                        {this.state.button.title}
                    </button>
                    <button className="AlertButton_button AlertButton_active_action" onClick={this._toggleMessageInput}>
                        <Edit style={styles.smallIcon} />
                    </button>
                    <button className="AlertButton_button AlertButton_active_action" onClick={_ => this._updateAlertSeverity("done")}>
                        <Clear style={styles.smallIcon} />
                    </button>
                </div>)
            :
                (<div className="AlertButton_active_container">
                    <button className="AlertButton_button AlertButton_autowidth" onClick={this._createAlert}>
                        {this.state.button.title}
                    </button>
                    {
                        this.state.showInput &&
                        <button className="AlertButton_button AlertButton_active_action" onClick={_ => this._toggleMessageInput("done")}>
                            <Clear style={styles.smallIcon} />
                        </button>
                    }
                </div>);

        return (
            <div>
                {
                    alertButton
                }
                {
                    this.state.showInput &&
                    <div className="AlertButton_input_container">
                        <TextField
                            floatingLabelText={this.state.button.messagePlaceholder || "Précisez"}
                            multiLine={true}
                            rows={2}
                            fullWidth={true}
                            onChange={this._handleInputChange}
                            value={this.state.message}
                            onKeyDown={this._handleKeyDown}
                        />
                    </div>
                }
            </div>
        );
    }

}