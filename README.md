1) Difference between var, let, and const
var, let, and const are used to declare variables in JavaScript.
var is the old way and it can be redeclared and changed.
let can be changed but cannot be redeclared in the same scope.
const is used for values that should not change after declaration.

2) What is the spread operator (...)?
The spread operator (...) is used to take all elements from an array or object and spread them into another array or object.
It helps in copying or combining data easily.

Example:

const a = [1,2];
const b = [...a,3];




3) Difference between map(), filter(), and forEach()
These methods are used with arrays.

map() creates a new array after changing each element.

filter() creates a new array with elements that meet a condition.

forEach() simply loops through the array and performs an action.






4) What is an arrow function?
An arrow function is a shorter syntax for writing functions in JavaScript.
It uses the => symbol and makes code more concise.

Example:

const greet = name => "Hello " + name;






5) What are template literals?
Template literals are a way to write strings using backticks ( ).
They allow variables or expressions to be inserted inside a string using ${}.

Example:
const name = "EMON";
console.log(`My name is ${name}`);