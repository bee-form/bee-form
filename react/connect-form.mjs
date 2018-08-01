import React from "react";
import {createForm} from "./create-form";

export const connectForm = (Comp, formConfig, initData) => {

    return class ConnectForm extends React.Component {
        constructor(props, context) {
            super(props, context);

            this.form = createForm(formConfig, initData);

            this.state = {
                fv: this.form.createView(),
            };
            this.form.onChange(() => this.setState({fv: this.form.createView()}));
        }

        render() {
            return React.createElement(Comp, Object.assign({}, this.props, this.state));
        }
    };
};
