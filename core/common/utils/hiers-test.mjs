import {isEmpty} from "./objects";
import {purge} from "./hiers";
import {ddStructure} from "./dd-structure";


const test = {
    age: {$$: {"": "a2"}},
};

// console.log(isEmpty({ '': 'a2' }))
//
// console.log(purge(test, ddStructure, (o) => o == null || isEmpty(o.$$)));