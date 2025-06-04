var myFunction = function (name, age) {
    console.log("Hello, " + name + "! You are " + age + " years old.");
    var unusedVariable = 42; // Unused variable (ESLint should warn about this)
    return { name: name, age: age };
};
console.log(myFunction("Alice", 25));
