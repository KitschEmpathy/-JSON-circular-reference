# -JSON-circular-reference
Encodes and decodes JSON circular reference structures so you can safely use JSON.stringify() 处理JSON循环引用结构以便安全调用JSON.stringify()

JSON.stringify无法正常处理循环引用结构，所以在JSON.stringify()前以及JSON.parse()后进行处理，保留数据结构的同时安全调用JSON.stringify()和JSON.parse()方法

JSON.stringify cannot handle circular reference structures normally, so it is processed before JSON.stringify() and after JSON.parse(), and the JSON.stringify() and JSON.parse() methods are safely called while preserving the data structure
