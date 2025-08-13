/**
 *	The class is meant to be copy+pasted in the .js file
 *	of whatever UI object you want to explore the properties of.
 *	E.g., if you wanted to see what data is available in the inventory,
 *	you'd copy+paste this below the `class Widget_Inventory...` declaration
 *	and above the `let inventoryArchetype...` line in `uiresources/inventory/js/inventory.js
 *	
 *	The `new PropertyExplorerObject` call is meant to be done 
 *	in the initialization of the UI object you are wanting to explore.
 *	E.g., if you wanted to see what data is available in the inventory,
 *	you'd call this inside the `Init()` function of `Widget_Inventory`.
 *	Where you call this may depend on the UI object.
 */

this.PropertyExplorerObject = new PropertyExplorerObject(this.DataModel);

// VAZU_MOD: PROPERTY EXPLORER BEGIN
class PropertyExplorerObject
{
    // DataModel to explore
    constructor(dataModel)
    {
        this.DataModel = dataModel;
        this.BackstepSublevel = this.BackstepSublevel.bind(this);
        this.PropertyClicked = this.PropertyClicked.bind(this);
        this.BasePropPath = 'this.DataModel';
        this.AdditionalPropPaths = [];
        this.PropertyExplorerContainer = document.getElementById("PropertyExplorerContainer");
        this.BackButton = document.getElementById("BackButton");
        this.PropertyExplorer = document.getElementById("PropertyExplorer");
        this.PathDisplay = document.getElementById("PathDisplay");
        // A custom object type provided by Prysm. I'm treating this as a normal array for the time being.
        this.ArrayProxyTypeString = 'CoherentArrayProxy';
        this.UpdatePropertyExplorer();
    }

    /** More detailed Type function. Pulled from MDN docs
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
     */
    Type(value) {
        if (value === null) {
            return "null";
        }
        const baseType = typeof value;
        // Primitive types
        if (!["object", "function"].includes(baseType)) {
            return baseType;
        }

        // Symbol.toStringTag often specifies the "display name" of the
        // object's class. It's used in Object.prototype.toString().
        const tag = value[Symbol.toStringTag];
        if (typeof tag === "string") {
            return tag;
        }

        // If it's a function whose source code starts with the "class" keyword
        if (
            baseType === "function" &&
            Function.prototype.toString.call(value).startsWith("class")
        ) {
            return "class";
        }

        // The name of the constructor; for example `Array`, `GeneratorFunction`,
        // `Number`, `String`, `Boolean` or `MyCustomClass`
        const className = value.constructor.name;
        if (typeof className === "string" && className !== "") {
            return className;
        }

        // At this point there's no robust way to get the type of value,
        // so we use the base implementation.
        return baseType;
    }

    FetchCurrentProperty()
    {
        return eval(this.ResolveCurrentPropertyPath());
    }

    ResolveCurrentPropertyPath()
    {
        let fullPropPath = this.BasePropPath;
        for (const path of this.AdditionalPropPaths)
        {
            fullPropPath = `${fullPropPath}${path}`;
        }
        return fullPropPath;
    }

    UpdatePropertyExplorer()
    {
        let fullPropPath = this.BasePropPath;
        for (const path of this.AdditionalPropPaths)
        {
            fullPropPath = `${fullPropPath}${path}`;
        }
        this.PathDisplay.innerHTML = `${this.ResolveCurrentPropertyPath()}`;

        let prop = this.FetchCurrentProperty();

        let basicType = typeof(prop);
        let detailedType = this.Type(prop);

        // We need separate props here because CoherentArrayProxy's return iterators which cannot be reset after iterating.
        let entries = "";
        let loopEntries = ""

        // Special treatment for CoherentArrayProxy objects
        if (detailedType === this.ArrayProxyTypeString)
        {
            entries = prop.entries();
            loopEntries = prop.entries();
        }
        // If it's an object, we get the entries like normal
        else if (basicType === 'object')
        {
            entries = Object.entries(prop);
            loopEntries = Object.entries(prop);
        }
        // Might have gotten a primitive from a function call, display it
        else if (basicType === 'number' || basicType === 'string' || basicType === 'boolean')
        {
            entries = [[basicType, prop]];
            loopEntries = [[basicType, prop]];
        }
        // If what we are trying to evaluate is undefined, display a notice.
        // Will primarily happen for functions with no return value.
        else if (basicType === 'undefined')
        {
            entries = [['Notice', 'Value is undefined']];
        }
        // Whatever we are trying to evaluate isn't supported, take it off the stack and return
        else
        {
            this.AdditionalPropPaths.pop();
            return;
        }

        let data = this.GenerateHTMLFromEntries(entries);
        this.PropertyExplorer.innerHTML = data;
        this.BackButton.addEventListener("click", this.BackstepSublevel);
        for (const [key, value] of loopEntries)
        {
            let id = `key_${key}`;
            document.getElementById(id).addEventListener("click", this.PropertyClicked);
        }
    }

	// Takes in an array of [Key,Value] pairs where the Key is the
	// identifier and the value is well, the value.
    GenerateHTMLFromEntries(entries)
    {
        let ele = "div";
        let cl = `</${ele}>`;
        let data = "";
        for (const [key, value] of entries)
        {
            let basicType = typeof(value);
            let detailedType = this.Type(value);
            let id = `key_${key}`;
            let op = `<${ele} id="${id}">`;
            let val = "";
            // If it's a primitive, we can display it's value.
            if (basicType === 'string' || basicType === 'number' || basicType === 'boolean')
            {
                if (value === '')
                {
                    val = '&ltempty&gt';
                }
                else
                {
                    val = value;
                }
            }
            // If it's a function, display it's required arg count. We can only run 0-arg functions.
            else if (basicType === 'function')
            {
                val = value.length;
            }
            data = `${data} ${op} ${key}: ${detailedType} ${val} ${cl}`;
        }

        return data;
    }

    PropertyClicked(event)
    {
        try {
            let strippedName = event.target.id.replace('key_', '');
            let subProp = this.FetchCurrentProperty()[`${strippedName}`];
            let subPropType = typeof(subProp);

            if (subPropType === 'object')
            {
                this.AdditionalPropPaths.push(`['${strippedName}']`);
                this.UpdatePropertyExplorer();
            }
            // We only support 0-arg function calls
            else if (subPropType === 'function' && subProp.length === 0)
            {
                this.AdditionalPropPaths.push(`.${strippedName}()`);
                this.UpdatePropertyExplorer();
            }
            
        } catch(error) {
            entries = [['Error', error.toString()]];
            let data = this.GenerateHTMLFromEntries(entries);
            this.PropertyExplorer.innerHTML = data;
        }
    }

    BackstepSublevel(event)
    {
        this.AdditionalPropPaths.pop();
        this.UpdatePropertyExplorer();
    }
}
// VAZU_MOD: PROPERTY EXPLORER END