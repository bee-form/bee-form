const React = require("react");
import {createForm} from "./create-form";

export class Form extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.form = createForm(props.config, props.initData);

        this.state = {
            fv: this.form.createView(),
        };
        this.form.onChange(() => this.setState({fv: this.form.createView()}));
    }

    render() {
        const {render, children} = this.props;
        const {fv} = this.state;

        return (render||children)(fv);
    }
}