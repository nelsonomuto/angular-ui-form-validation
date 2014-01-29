JSOL stands for JavaScript Object Literal which is a string representing 
an object in JavaScript syntax.

For example:

{foo:"bar"} is equivalent to {"foo":"bar"} in JavaScript. Both are valid JSOL.

Note that {"foo":"bar"} is proper JSON[1] therefore you can use one of the many 
JSON parsers out there like json2.js[2] or even the native browser's JSON parser,
if available.

However, {foo:"bar"} is NOT proper JSON but valid Javascript syntax for 
representing an object with one key, "foo" and its value, "bar".
Using a JSON parser is not an option since this is NOT proper JSON.

You can use JSOL.parse to safely parse any string that reprsents a JavaScript Object Literal.
JSOL.parse will throw an Invalid JSOL exception on function calls, function declarations and variable references.

Examples:

JSOL.parse('{foo:"bar"}');  // valid

JSOL.parse('{evil:(function(){alert("I\'m evil");})()}');  // invalid function calls

JSOL.parse('{fn:function() { }}'); // invalid function declarations

var bar = "bar";
JSOL.parse('{foo:bar}');  // invalid variable references

[1] http://www.json.org
[2] http://www.json.org/json2.js
