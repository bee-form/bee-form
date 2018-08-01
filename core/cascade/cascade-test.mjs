// console.log(require.resolve.paths("babel-register"))

// require("babel-register")({presets: ["env"]});

// console.log(cascade({}, PathPattern.parseNodes("a")));
// console.log(cascade({"a": 88}, PathPattern.parseNodes("a")))
// console.log(cascade({a: [[1]]}, PathPattern.parseNodes("a[0][0]")));

import {cascade} from "./cascade";
import {parseNodes} from "../path-pattern/path-pattern";

console.log(cascade({a: [[1, 2], [3]], b: []}, parseNodes("b[1][2]")));