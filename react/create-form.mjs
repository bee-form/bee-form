import {reactBindings} from "./react-bindings";
import {createView} from "./form-view";
import {createForm as baseCreateForm} from "../core/form/form";

export const createForm = (formConfig, initData) => {
    const form = baseCreateForm(formConfig, initData);

    return Object.assign({}, form, {
        createView: () => {
            return createView(form.createView(), reactBindings);
        },
    });
};
