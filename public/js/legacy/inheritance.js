// Copy properties (not including prototype) into one class from another
function inheritProperties(subObject, SuperClass, properties) {
	
	// Create an instance of the super class
	var superObject = new SuperClass(properties);
	
	// Have the sub class inherit each property of the super class
	for (var propertyName in superObject) {
		
		// Do not copy methods from the prototype chain
		if (superObject.hasOwnProperty(propertyName)) {
			subObject[propertyName] = superObject[propertyName];
		}
	}
}

// Gives methods from one class to another
function inheritPrototype(SubClass, SuperClass) {
	SubClass.prototype = Object.create(SuperClass.prototype);
	SubClass.prototype.constructor = SubClass;
}

// Gives methods to a class
function extendPrototype(Class, methods) {
	$.extend(Class.prototype, methods);
}