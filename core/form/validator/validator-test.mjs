import {Validator} from "./validator";

const required = {
    name: "required",
    validate: (value) => value != null,
};

console.log(Validator.validate({
    "name": [required],
    "jobs[*].name": [required],
}, {name: "Quan"}));
