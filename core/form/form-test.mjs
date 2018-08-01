import {createForm} from "./form";

const required = {
    name: "required",
    validate: (value) => value != null,
};

let form = createForm({
    "name": [required],
    "jobs[*].name": [required],
});

// console.log(form.createView({jobs: [{}]}).errors)

form.setData({
    "name": "aaa"
});

console.log(form.getData());