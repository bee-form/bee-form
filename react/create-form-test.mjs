import {createForm} from "../core/form/form";
// const createForm = require("./create-form").createForm;

const formConfig = {
    // "first_name": [required],
    // "last_name": [required],
    // "email": [required, email],
    // "password": [required], // password characters
    // "country": [required],
    // "confirm_password": [required, equalsPath("password")],
    // "zip_code": [required],
};


const form = createForm(formConfig, {
    last_name: "111",
});

form.setData(null);

// setTimeout(() => {

    const fv = form.createView();
// console.log(this.form.getData());
    fv.onChange("222", ["last_name"]);
    console.log(form.getState());
// console.log(fv.getValue(["last_name"]));

// }, 0);