var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.
        this.defaultView = null;               // The id of the default view.
        this.axisLength = 1;                   // The axis length.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);

        this.materialDefault = new CGFappearance(this.scene);
        this.materialCounter = 0;
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse transformations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }

        // check for loops
        if((error = this.checkLoops()) != null) {
            return error;
        }

        for(let i = 0; i < this.components.length; i++){
            if(this.components[i].id == this.idRoot)
                this.rootComponent = this.components[i];
        }
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {
        var root = this.reader.getString(sceneNode, 'root');
        if(root == null) return "no root object defined";
        var axisLength = this.reader.getFloat(sceneNode, 'axis_length');
        if(axisLength == null || isNaN(axisLength)) return "error parsing axis length";

        this.idRoot = root;
        this.axisLength = axisLength;
        
        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;

        this.views = [];
        var numViews = 0;

        for (let i = 0; i < children.length; i++) {

            var nodeName = children[i].nodeName;
            if(nodeName != "perspective" && nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + nodeName + ">");
                continue;
            }

            //get the id of the current view
            var viewId = this.reader.getString(children[i], 'id');
            if (viewId == null) return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewId] != null)
            return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            //get the near field value of the current view
            var near = this.reader.getFloat(children[i], 'near');
            if (near == null || isNaN(near)) return "error parsing view 'near' value";

            //get the far field value of the current view
            var far = this.reader.getFloat(children[i], 'far');
            if (far == null || isNaN(far)) return "error parsing view 'far' value";

            var left = null, right = null, top = null, bottom = null, angle = null, from = {x: null, y: null, z: null}, to = {x: null, y: null, z: null};
            
            if(nodeName == "ortho") {
                //get the left field value of the current view
                var left = this.reader.getFloat(children[i], 'left');
                if (left == null || isNaN(left)) return "error parsing view 'left' value";

                //get the right field value of the current view
                var right = this.reader.getFloat(children[i], 'right');
                if (right == null || isNaN(right)) return "error parsing view 'right' value";

                //get the top field value of the current view
                var top = this.reader.getFloat(children[i], 'top');
                if (top == null || isNaN(top)) return "error parsing view 'top' value";

                //get the bottom field value of the current view
                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (bottom == null || isNaN(bottom)) return "error parsing view 'bottom' value";

            } else {
                //get the angle field value of the current view
                var angle = this.reader.getFloat(children[i], 'angle');
                if (angle == null || isNaN(angle)) return "error parsing view 'angle' value";
                angle = DEGREE_TO_RAD * angle;      
            }

            var grandChildren = children[i].children;

            var nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            var fromIndex = nodeNames.indexOf("from");
            var toIndex = nodeNames.indexOf("to");

            if(fromIndex != -1) {
                //get the x (from) value of the current view
                var x = this.reader.getFloat(grandChildren[fromIndex], 'x');
                if (x == null || isNaN(x)) return "error parsing view x (from) value";

                //get the y (from) value of the current view
                var y = this.reader.getFloat(grandChildren[fromIndex], 'y');
                if (y == null || isNaN(y)) return "error parsing view y (from) value";

                //get the z (from) value of the current view
                var z = this.reader.getFloat(grandChildren[fromIndex], 'z');
                if (z == null || isNaN(z)) return "error parsing view z (from) value";

                from.x = x;
                from.y = y;
                from.z = z;

            } else {
                return "'from' coordinate undefined for view " + viewId;
            }

            if(toIndex != -1) {
                //get the x (to) value of the current view
                var x = this.reader.getFloat(grandChildren[toIndex], 'x');
                if (x == null || isNaN(x)) return "error parsing view x (to) value";

                //get the y (to) value of the current view
                var y = this.reader.getFloat(grandChildren[toIndex], 'y');
                if (y == null || isNaN(y)) return "error parsing view y (to) value";

                //get the z (to) value of the current view
                var z = this.reader.getFloat(grandChildren[toIndex], 'z');
                if (z == null || isNaN(z)) return "error parsing view z (to) value";

                to.x = x;
                to.y = y;
                to.z = z;

            } else {
                return "'to' coordinate undefined for view " + viewId;
            }
            
            this.views[viewId] = {
                type: nodeName,
                near: near,
                far: far,
                angle: angle,
                left: left,
                right: right,
                top: top,
                bottom: bottom,
                from: from,
                to: to
            }

            numViews++;
        }
        if(numViews == 0) return "There must be, at least, one of the following views: perspective, ortho";

        //get the id of the default view
        var defaultView = this.reader.getString(viewsNode, 'default');
        if (defaultView == null) return "no default ID defined for view";
        else if (this.views[defaultView] == null) return "invalid default view";
        this.defaultView = defaultView;

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {
        var children = ambientNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }
        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var ambientIllumination = [];
        if (ambientIndex != -1) {
            // R
            var r = this.reader.getFloat(children[ambientIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the ambient illumination";
            else
                ambientIllumination.push(r);

            // G
            var g = this.reader.getFloat(children[ambientIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the ambient illumination";
            else
                ambientIllumination.push(g);

            // B
            var b = this.reader.getFloat(children[ambientIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the ambient illumination";
            else
                ambientIllumination.push(b);

            // A
            var a = this.reader.getFloat(children[ambientIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the ambient illumination";
            else
                ambientIllumination.push(a);
        }
        else
            return "ambient ilumination component undefined";

        var backgroundColor = [];
        if (backgroundIndex != -1) {
            // R
            var r = this.reader.getFloat(children[backgroundIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of background";
            else
                backgroundColor.push(r);

            // G
            var g = this.reader.getFloat(children[backgroundIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of background";
            else
                backgroundColor.push(g);

            // B
            var b = this.reader.getFloat(children[backgroundIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of background";
            else
                backgroundColor.push(b);

            // A
            var a = this.reader.getFloat(children[backgroundIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of background";
            else
                backgroundColor.push(a);
        }
        else
            return "background color undefined";
        
        this.ambientIllumination = ambientIllumination;
        this.backgroundColor = backgroundColor;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <lights> block.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        var lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Get current light state.
            var enabled = this.reader.getBoolean(children[i], 'enabled');
            if (enabled == null || (enabled != 0 && enabled != 1))
                return "error parsing state for " + lightId;
                        
            var lightAngle = null;
            var lightExponent = null;

            if (children[i].nodeName == "spot") {
                // Get current light angle.
                lightAngle = this.reader.getFloat(children[i], 'angle');
                if (lightAngle == null || isNaN(lightAngle))
                    return "error parsing angle for " + lightId;

                // Get current light exponent.
                lightExponent = this.reader.getFloat(children[i], 'exponent');
                if (lightExponent == null || isNaN(lightExponent))
                    return "error parsing exponent for " + lightId;
            }

            // Checks for repeated IDs.
            for(let i = 0; i < lights.length; i++){
                if(lights[i].id == lightId)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";
            }

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");
            var targetIndex = nodeNames.indexOf("target");

            // Retrieves the light location.
            var locationLight = [];
            if (locationIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse w-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(w);
            }
            else
                return "light location undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // Retrieve the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + lightId;

            // Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + lightId;

            // Retrieve the target component if spot light
            var target = [];
            if (targetIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light target location for ID = " + lightId;
                else
                    target.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light target location for ID = " + lightId;
                else
                    target.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[targetIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light target location for ID = " + lightId;
                else
                    target.push(z);
            }
            else if (children[i].nodeName == "spot")
                return "light target undefined for ID = " + lightId;
            else
                target = null;

            lights.push ({
                id: lightId,
                enabled: enabled,
                angle: lightAngle,
                exponent: lightExponent,
                location: locationLight,
                ambient: ambientIllumination,
                diffuse: diffuseIllumination,
                specular: specularIllumination,
                target: target
            })
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            return "too many lights defined; WebGL imposes a limit of 8 lights";

        this.lights = lights;

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        var textures = [];
        var numTextures = 0;

        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current texture
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";
                
            // Checks for repeated IDs.
            for(let i = 0; i < textures.length; i++){
                if(textures[i].id == textureId)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";
            }
            //get the file of the current texture
            var file = this.reader.getString(children[i], 'file');
            if (file == null)
                return "no file defined for " + textureId;

            var newTexture = new CGFtexture(this.scene, file);

            textures.push({
                id: textureId,
                texture: newTexture
            })

            numTextures++;
        }

        if (numTextures == 0)
            return "at least one texture must be defined";

        this. textures = textures;

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> block.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        var materials = [];
        var numMaterials = 0;

        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current material
            var materialId = this.reader.getString(children[i], 'id');
            if (materialId == null)
                return "no ID defined for material";
                
            // Checks for repeated IDs.
            for(let i = 0; i < materials.length; i++){
                if(materials[i].id == materialId)
                return "ID must be unique for each material (conflict: ID = " + materialId + ")";
            }

            //get the shininess of the current material
            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null || isNaN(shininess) || shininess < 0)
                return "error parsing shininess for " + materialId;

            var grandChildren = children[i].children;

            var nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Retrieves the material emission.
            var emission = [];
            if (emissionIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[emissionIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the emission value for ID = " + materialId;
                else
                    emission.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[emissionIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the emission value for ID = " + materialId;
                else
                    emission.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[emissionIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the emission value for ID = " + materialId;
                else
                    emission.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[emissionIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the emission value for ID = " + materialId;
                else
                    emission.push(a);
            }
            else
                return "emission component undefined for ID = " + materialId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient value for ID = " + materialId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient value for ID = " + materialId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient value for ID = " + materialId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient value for ID = " + materialId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // Retrieve the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse value for ID = " + materialId;
                else
                    diffuseIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse value for ID = " + materialId;
                else
                    diffuseIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse value for ID = " + materialId;
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse value for ID = " + materialId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + materialId;

            // Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular value for ID = " + materialId;
                else
                    specularIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular value for ID = " + materialId;
                else
                    specularIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular value for ID = " + materialId;
                else
                    specularIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular value for ID = " + materialId;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + materialId;

            var newMaterial = new CGFappearance(this.scene);
            newMaterial.setShininess(shininess);
            newMaterial.setAmbient(ambientIllumination[0], ambientIllumination[1], ambientIllumination[2], ambientIllumination[3]);
            newMaterial.setDiffuse(diffuseIllumination[0], diffuseIllumination[1], diffuseIllumination[2], diffuseIllumination[3]);
            newMaterial.setSpecular(specularIllumination[0], specularIllumination[1], specularIllumination[2], specularIllumination[3]);
            newMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);
            newMaterial.setTextureWrap('REPEAT','REPEAT');

            materials.push({
                id: materialId,
                material: newMaterial
            });
            
            numMaterials++;
        }

        if (numMaterials == 0)
            return "at least one material must be defined";

        this.materials = materials;

        this.log("Parsed materials");

        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];
        var numTransformations = 0;

        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current transformation
            var transformationId = this.reader.getString(children[i], 'id');
            if (transformationId == null)
                return "no ID defined for transformation";
                
            // Checks for repeated IDs.
            if (this.transformations[transformationId] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationId + ")";

            var grandChildren = children[i].children;

            var innerTransformations = [];
            var innerTCounter = 0;
            for(let j = 0; j < grandChildren.length; j++) {
                if(grandChildren[j].nodeName == "translate") {
                    // x
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse translation x for transformation with ID = " + transformationId;

                    // y
                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse translation y for transformation with ID = " + transformationId;

                    // z
                    var z = this.reader.getFloat(grandChildren[j], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse translation z for transformation with ID = " + transformationId;
                    
                    innerTransformations.push({type: 1, x: x, y: y, z: z});


                } else if(grandChildren[j].nodeName == "rotate") {
                    // axis
                    var axis = this.reader.getString(grandChildren[j], 'axis');
                    if (!(axis != null) || (axis != "x" && axis != "y" && axis != "z"))
                        return "unable to parse rotation axis for transformation with ID = " + transformationId;

                    // angle
                    var angle = this.reader.getFloat(grandChildren[j], 'angle');
                    if (!(angle != null && !isNaN(angle)))
                        return "unable to parse rotation angle for transformation with ID = " + transformationId;
                    
                    innerTransformations.push({type: 2, axis: axis, angle: angle*DEGREE_TO_RAD});

                } else if(grandChildren[j].nodeName == "scale") {
                    // x
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse scale x value for transformation with ID = " + transformationId;

                    // y
                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse scale y value for transformation with ID = " + transformationId;

                    // z
                    var z = this.reader.getFloat(grandChildren[j], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse scale y value for transformation with ID = " + transformationId;
                    
                    innerTransformations.push({type: 3, x: x, y: y, z: z});

                } else {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                    continue;
                }
                innerTCounter++;
            }

            if(innerTCounter == 0) {
                return "at least one action must be defined for tansformation with ID = " + transformationId;
            }
            
            this.scene.loadIdentity();
            for(let i = 0; i < innerTransformations.length; i++){
                let trans = innerTransformations[i];
                switch(trans.type){
                    case 1:
                        this.scene.translate(trans.x,trans.y,trans.z);
                        break;
                    case 2:
                        this.scene.rotate(trans.angle, trans.axis == "x" ? 1 : 0, trans.axis == "y" ? 1 : 0, trans.axis == "z" ? 1 : 0);
                        break;
                    case 3:
                        this.scene.scale(trans.x, trans.y, trans.z);
                        break;
                    default: break;
                }
            }

            this.transformations[transformationId] = this.scene.getMatrix();
            numTransformations++;
        }

        if (numTransformations == 0)
            return "at least one transformation must be defined";

        this.log("Parsed transformations");

        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];
        
        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "linear" && children[i].nodeName != "circular") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current animation
            var animationId = this.reader.getString(children[i], 'id');
            if (animationId == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationId] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationId + ")";

            //get the span of the current animation
            var animationSpan = this.reader.getFloat(children[i], 'span');
            if (animationSpan == null && !isNaN(animationSpan))
                return "no span defined for animation";


            if(children[i].nodeName == "linear"){
                var grandChildren = children[i].children;

                var controlpoints = [];
                if(grandChildren.length < 2) {
                    return "There must be at least two control points in the animation with ID = " + animationId;
                }
                for(let j = 0; j < grandChildren.length; j++) {
                    if(grandChildren[j].nodeName == "controlpoint") {
                        // x
                        var x = this.reader.getFloat(grandChildren[j], 'x');
                        if (!(x != null && !isNaN(x)))
                            return "unable to parse controlpoint x for animation with ID = " + animationId;
    
                        // y
                        var y = this.reader.getFloat(grandChildren[j], 'y');
                        if (!(y != null && !isNaN(y)))
                            return "unable to parse controlpoint y for animation with ID = " + animationId;
    
                        // z
                        var z = this.reader.getFloat(grandChildren[j], 'z');
                        if (!(z != null && !isNaN(z)))
                            return "unable to parse controlpoint z for animation with ID = " + animationId;
                        
                        controlpoints.push({x: x, y: y, z: z});
                    } else{
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        continue;
                    }
                }
                var animation = new MyLinearAnimation(this.scene, animationId, animationSpan, controlpoints);
                this.animations[animationId] = animation;
            }
            else {
                var animationCenter = this.reader.getString(children[i], 'center');
                if (animationCenter == null)
                    return "no center defined for animation with ID : " + animationId;
                animationCenter = animationCenter.split(" ");
                if(animationCenter.length != 3)
                    return "wrong center coordinates for animation with ID : " + animationId;
                
                for(let i = 0; i < animationCenter.length; i++){
                    animationCenter[i] = parseInt(animationCenter[i]);
                }
                
                var animationRadius = this.reader.getFloat(children[i], 'radius');
                if (animationRadius == null || isNaN(animationRadius))
                    return "no radius defined for animation with ID : " + animationId;

                var animationStartAng = this.reader.getFloat(children[i], 'startang');
                if (animationStartAng == null || isNaN(animationStartAng))
                    return "no startang defined for animation with ID : " + animationId;
                
                var animationRotAng = this.reader.getFloat(children[i], 'rotang');
                if (animationRotAng == null || isNaN(animationRotAng))
                    return "no rotang defined for animation with ID : " + animationId;

                
                var animation = new MyCircularAnimation(this.scene, animationId, animationSpan, animationCenter, animationStartAng, animationRotAng, animationRadius);
                this.animations[animationId] = animation;
            }
        }

        this.log("Parsed animations");

        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        var primitives = [];
        var numPrimitives = 0;

        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current primitive
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";
                
            // Checks for repeated IDs.
            for(let i = 0; i < primitives.length; i++){
                if(primitives[i].id == primitiveId) {
                    return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";
                }
            }

            var grandChildren = children[i].children;
            if(grandChildren.length != 1) {
                return "There must be one and only one tag (rectangle, triangle, cylinder, sphere or torus) \
in the primitive with ID = " + primitiveId;
            }

            var temp = grandChildren[0];
            if(temp.nodeName != "rectangle" && temp.nodeName != "triangle" && temp.nodeName != "cylinder" && temp.nodeName != "sphere" && temp.nodeName != "torus")
                return "invalid tag in primitive with ID = " + primitiveId;

            switch(temp.nodeName) {
                case "rectangle":
                    // x1
                    var x1 = this.reader.getFloat(temp, 'x1');
                    if (!(x1 != null && !isNaN(x1)))
                        return "unable to parse x1 value for primitive with ID = " + primitiveId;

                    // y1
                    var y1 = this.reader.getFloat(temp, 'y1');
                    if (!(y1 != null && !isNaN(y1)))
                        return "unable to parse y1 value for primitive with ID = " + primitiveId;

                    // x1
                    var x2 = this.reader.getFloat(temp, 'x2');
                    if (!(x2 != null && !isNaN(x2)))
                        return "unable to parse x2 value for primitive with ID = " + primitiveId;

                    // y2
                    var y2 = this.reader.getFloat(temp, 'y2');
                    if (!(y2 != null && !isNaN(y2)))
                        return "unable to parse y2 value for primitive with ID = " + primitiveId;

                    var rectangle = new MyQuad(this.scene, x1, y1, x2, y2);
                    primitives.push({id: primitiveId, type: "rectangle", primitive: rectangle});
                    break;

                case "triangle":
                    // x1
                    var x1 = this.reader.getFloat(temp, 'x1');
                    if (!(x1 != null && !isNaN(x1)))
                        return "unable to parse x1 value for primitive with ID = " + primitiveId;

                    // y1
                    var y1 = this.reader.getFloat(temp, 'y1');
                    if (!(y1 != null && !isNaN(y1)))
                        return "unable to parse y1 value for primitive with ID = " + primitiveId;
                    
                    // z1
                    var z1 = this.reader.getFloat(temp, 'z1');
                    if (!(z1 != null && !isNaN(z1)))
                        return "unable to parse z1 value for primitive with ID = " + primitiveId;

                    // x1
                    var x2 = this.reader.getFloat(temp, 'x2');
                    if (!(x2 != null && !isNaN(x2)))
                        return "unable to parse x2 value for primitive with ID = " + primitiveId;

                    // y2
                    var y2 = this.reader.getFloat(temp, 'y2');
                    if (!(y2 != null && !isNaN(y2)))
                        return "unable to parse y2 value for primitive with ID = " + primitiveId;

                    // z2
                    var z2 = this.reader.getFloat(temp, 'z2');
                    if (!(z2 != null && !isNaN(z2)))
                        return "unable to parse z2 value for primitive with ID = " + primitiveId;

                    // x3
                    var x3 = this.reader.getFloat(temp, 'x3');
                    if (!(x3 != null && !isNaN(x3)))
                        return "unable to parse x3 value for primitive with ID = " + primitiveId;

                    // y3
                    var y3 = this.reader.getFloat(temp, 'y3');
                    if (!(y3 != null && !isNaN(y3)))
                        return "unable to parse y3 value for primitive with ID = " + primitiveId;

                    // z3
                    var z3 = this.reader.getFloat(temp, 'z3');
                    if (!(z3 != null && !isNaN(z3)))
                        return "unable to parse z3 value for primitive with ID = " + primitiveId;

                    var triangle = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                    primitives.push({id: primitiveId, type: "triangle", primitive: triangle});
                    break;

                case "cylinder":
                    // base
                    var base = this.reader.getFloat(temp, 'base');
                    if (!(base != null && !isNaN(base)))
                        return "unable to parse base value for primitive with ID = " + primitiveId;

                    // top
                    var top = this.reader.getFloat(temp, 'top');
                    if (!(top != null && !isNaN(top)))
                        return "unable to parse top value for primitive with ID = " + primitiveId;

                    // height
                    var height = this.reader.getFloat(temp, 'height');
                    if (!(height != null && !isNaN(height)))
                        return "unable to parse height value for primitive with ID = " + primitiveId;

                    // slices
                    var slices = this.reader.getInteger(temp, 'slices');
                    if (!(slices != null && !isNaN(slices)))
                        return "unable to parse slices value for primitive with ID = " + primitiveId;

                    // stacks
                    var stacks = this.reader.getInteger(temp, 'stacks');
                    if (!(stacks != null && !isNaN(stacks)))
                        return "unable to parse stacks value for primitive with ID = " + primitiveId;

                    var cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);
                    primitives.push({id: primitiveId, type: "cylinder", primitive: cylinder});
                    break;

                case "sphere":
                    // radius
                    var radius = this.reader.getFloat(temp, 'radius');
                    if (!(radius != null && !isNaN(radius)))
                        return "unable to parse radius value for primitive with ID = " + primitiveId;

                    // slices
                    var slices = this.reader.getInteger(temp, 'slices');
                    if (!(slices != null && !isNaN(slices)))
                        return "unable to parse slices value for primitive with ID = " + primitiveId;

                    // stacks
                    var stacks = this.reader.getInteger(temp, 'stacks');
                    if (!(stacks != null && !isNaN(stacks)))
                        return "unable to parse stacks value for primitive with ID = " + primitiveId;

                    var sphere = new MySphere(this.scene, radius, slices, stacks);
                    primitives.push({id: primitiveId, type: "sphere", primitive: sphere});
                    break;
                
                case "torus":
                    // inner
                    var inner = this.reader.getFloat(temp, 'inner');
                    if (!(inner != null && !isNaN(inner)))
                        return "unable to parse inner value for primitive with ID = " + primitiveId;

                    // outer
                    var outer = this.reader.getFloat(temp, 'outer');
                    if (!(outer != null && !isNaN(outer)))
                        return "unable to parse outer value for primitive with ID = " + primitiveId;

                    // slices
                    var slices = this.reader.getInteger(temp, 'slices');
                    if (!(slices != null && !isNaN(slices)))
                        return "unable to parse slices value for primitive with ID = " + primitiveId;

                    // loops
                    var loops = this.reader.getInteger(temp, 'loops');
                    if (!(loops != null && !isNaN(loops)))
                        return "unable to parse loops value for primitive with ID = " + primitiveId;

                        var torus = new MyTorus(this.scene, inner, outer, slices, loops);
                        primitives.push({id: primitiveId, type: "torus", primitive: torus});
                    break;
                
                default:
                    this.onXMLMinorError("unknown tag <" + temp.nodeName + ">");
                    continue;
            }
            numPrimitives++;
        }

        if (numPrimitives == 0)
            return "at least one primitive must be defined";

        this.primitives = primitives;
        this.log("Parsed primitives");

        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        var components = [];

        for(let i = 0; i < children.length; i++) {
            var counter = 0;
            if(children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current component
            var componentId = this.reader.getString(children[i], 'id');
            if (componentId == null)
                return "no ID defined for component";
                
            // Checks for repeated IDs.
            for(let i = 0; i < components.length; i++){
                if(components[i].id == componentId)
                    return "ID must be unique for each component (conflict: ID = " + componentId + ")";
            }

            var grandChildren = children[i].children;
            if(grandChildren.length < 4) {
                return "There must be a transformation, materials, texture and a children tags in component with ID = " + componentId;
            }

            //Transformation
            var temp = grandChildren[counter];
            counter++;
            var componentTransformations = [];
            if(temp.nodeName != "transformation")
                return "missing / out of order transformation tag in component with ID = " + componentId;
            
            var componentTransformationsChildren = temp.children;
            if(componentTransformationsChildren.length != 0){
                if(componentTransformationsChildren[0].nodeName == "transformationref"){
                     componentTransformations = this.transformations[this.reader.getString(componentTransformationsChildren[0],'id')];
                    if(componentTransformations == null)
                        return "no transformation with ID = " + this.reader.getString(componentTransformationsChildren[0],'id');
                }
                else{
                    var innerTransformations = [];
                    var innerTCounter = 0;
                    for(let j = 0; j < componentTransformationsChildren.length; j++) {
                        if(componentTransformationsChildren[j].nodeName == "translate") {
                            // x
                            var x = this.reader.getFloat(componentTransformationsChildren[j], 'x');
                            if (!(x != null && !isNaN(x)))
                                return "unable to parse translation x for the transformations in component with ID = " + componentId;

                            // y
                            var y = this.reader.getFloat(componentTransformationsChildren[j], 'y');
                            if (!(y != null && !isNaN(y)))
                                return "unable to parse translation y for the transformations in component with ID = " + componentId;

                            // z
                            var z = this.reader.getFloat(componentTransformationsChildren[j], 'z');
                            if (!(z != null && !isNaN(z)))
                                return "unable to parse translation z for the transformations in component with ID = " + componentId;
                            
                            innerTransformations.push({type: 1, x: x, y: y, z: z});


                        } else if(componentTransformationsChildren[j].nodeName == "rotate") {
                            // axis
                            var axis = this.reader.getString(componentTransformationsChildren[j], 'axis');
                            if (!(axis != null) || (axis != "x" && axis != "y" && axis != "z"))
                                return "unable to parse rotation axis for the transformations in component with ID = " + componentId;

                            // angle
                            var angle = this.reader.getFloat(componentTransformationsChildren[j], 'angle');
                            if (!(angle != null && !isNaN(angle)))
                                return "unable to parse rotation angle for the transformations in component with ID = " + componentId;
                            
                            innerTransformations.push({type: 2, axis: axis, angle: angle*DEGREE_TO_RAD});

                        } else if(componentTransformationsChildren[j].nodeName == "scale") {
                            // x
                            var x = this.reader.getFloat(componentTransformationsChildren[j], 'x');
                            if (!(x != null && !isNaN(x)))
                                return "unable to parse scale x value for the transformations in component with ID = " + componentId;

                            // y
                            var y = this.reader.getFloat(componentTransformationsChildren[j], 'y');
                            if (!(y != null && !isNaN(y)))
                                return "unable to parse scale y value for the transformations in component with ID = " + componentId;

                            // z
                            var z = this.reader.getFloat(componentTransformationsChildren[j], 'z');
                            if (!(z != null && !isNaN(z)))
                                return "unable to parse scale y value for the transformations in component with ID = " + componentId;
                            
                            innerTransformations.push({type: 3, x: x, y: y, z: z});

                        } else {
                            this.onXMLMinorError("unknown tag <" + componentTransformationsChildren[j].nodeName + ">");
                            continue;
                        }
                        innerTCounter++;
                    }

                    if(innerTCounter == 0) {
                        return "at least one action must be defined for tansformation in component with ID = " + componentId;
                    }

                    this.scene.loadIdentity();
                    for(let i = 0; i < innerTransformations.length; i++){
                        let trans = innerTransformations[i];
                        switch(trans.type){
                            case 1:
                                this.scene.translate(trans.x,trans.y,trans.z);
                                break;
                            case 2:
                                this.scene.rotate(trans.angle, trans.axis == "x" ? 1 : 0, trans.axis == "y" ? 1 : 0, trans.axis == "z" ? 1 : 0);
                                break;
                            case 3:
                                this.scene.scale(trans.x, trans.y, trans.z);
                                break;
                            default: break;
                        }
                    }

                    componentTransformations = this.scene.getMatrix();
                }
            }
            else{
                componentTransformations = null;
            }
            
            //Animations
            var temp = grandChildren[counter];
            var componentAnimations = [];
            if(temp.nodeName == "animations"){
                var componentAnimationsChildren = temp.children;
                for(let i = 0; i < componentAnimationsChildren.length; i++){
                    if(componentAnimationsChildren[i].nodeName == "animationref"){
                        var newObject = this.animations[this.reader.getString(componentAnimationsChildren[i],'id')].clone();
                        componentAnimations.push(newObject);
                       if(componentAnimations == null)
                           return "no animation with ID = " + this.reader.getString(componentAnimationsChildren[i],'id');
                    }
               }
                counter++;
            }

            //Materials
            var temp = grandChildren[counter];
            counter++;
            var componentMaterials = [];
            if(temp.nodeName != "materials")
                return "missing / out of order materials tag in component with ID = " + componentId;

            var componentMaterialsCounter = 0;
            var componentMaterialChildren = temp.children;
            for (let i = 0; i < componentMaterialChildren.length; i++) {
                var nodeName = componentMaterialChildren[i].nodeName;
                if(nodeName != "material") {
                    this.onXMLMinorError("unknown tag <" + nodeName + ">");
                    continue;
                }

                if(this.reader.getString(componentMaterialChildren[i],'id') == "inherit"){
                    componentMaterials.push({
                        id: "inherit",
                        material: null
                    });
                }
                else{
                    var material = null;
                    for(let n = 0; n < this.materials.length; n++){
                        if(this.materials[n].id == this.reader.getString(componentMaterialChildren[i],'id'))
                            material = this.materials[n];
                    }
                    if(material == null)
                        return "no material with ID = " + this.reader.getString(componentMaterialChildren[i],'id');
                    componentMaterials.push(material);
                }
                componentMaterialsCounter++;
            }
            if(componentMaterialsCounter == 0){
                return "There must be a material in component with ID = " + componentId;
            }

            //Texture
            var temp = grandChildren[counter];
            counter++;
            var componentTexture = [];
            if(temp.nodeName != "texture")
                return "missing / out of order texture tag in component with ID = " + componentId;
            
            var textureID = this.reader.getString(temp, 'id');
            var textureLengthS = null;
            var textureLengthT = null;

            if((this.reader.hasAttribute(temp, 'length_s')) && (this.reader.hasAttribute(temp, 'length_s'))){
                textureLengthS = this.reader.getFloat(temp, 'length_s');
                textureLengthT = this.reader.getFloat(temp, 'length_t');
                if(textureLengthS == null || isNaN(textureLengthS) || textureLengthS <= 0 ||
                textureLengthT == null || isNaN(textureLengthT) || textureLengthT <= 0) {
                    return "error parsing lenght_s and/or lenght_t in component with ID = " + componentId + " (must be a number > 0)";
                }
            }
            if(this.reader.hasAttribute(temp, 'length_s') != this.reader.hasAttribute(temp, 'length_t')) {
                return "error on lenght_s and/or lenght_t in component with ID = " + componentId;
            }

            var texture = {id: null, texture: null};

            if(textureID == "inherit"){
                texture.id = "inherit";
            } else if (textureID == "none"){
                texture.id = "none";
            } else{
                if(textureLengthS == null || textureLengthT == null)
                    return "error on lenght_s and/or lenght_t in component with ID = " + componentId;

                for(let i = 0; i < this.textures.length; i++){
                    if(this.textures[i].id == textureID)
                        texture = this.textures[i];
                }
                if(texture == null)
                    return "no texture with ID = " + textureID;
            }

            componentTexture = {
                id: texture.id,
                texture: texture.texture,
                length_s: textureLengthS,
                length_t: textureLengthT
            }
            
            //Children
            var temp = grandChildren[counter];
            counter++;
            var componentChildren = [];
            var primitive = [];
            var component = [];
            if(temp.nodeName != "children")
                return "missing / out of order children tag in component with ID = " + componentId;

            var componentChildrenCounter = 0;
            var componentChildrenChildren = temp.children;
            for (let i = 0; i < componentChildrenChildren.length; i++) {
                var nodeName = componentChildrenChildren[i].nodeName;
                if(nodeName != "primitiveref" && nodeName != "componentref") {
                    this.onXMLMinorError("unknown tag <" + nodeName + ">");
                    continue;
                }
                if(nodeName == "componentref"){
                    component.push(this.reader.getString(componentChildrenChildren[i],'id'));
                }
                else{
                    var primitiveID = this.reader.getString(componentChildrenChildren[i],'id');
                    var primitive2 = null;
                    for(let i = 0; i < this.primitives.length; i++){
                        if(this.primitives[i].id == primitiveID){
                            primitive2 = this.primitives[i];
                        }
                    }
                    if(primitive2 == null){
                        return "no primitive with ID = " + this.reader.getString(componentChildrenChildren[i],'id');
                    }
                    primitive.push(primitive2);
                }
                componentChildrenCounter++;
            }
            if(componentChildrenCounter == 0){
                return "There must be a componentref or/and a primitiveref in the component with ID = " +componentId;
            }
            componentChildren = {
                primitiveref: primitive,
                componentref: component
            }
            
            components.push({
                id: componentId,
                transformations: componentTransformations,
                materials: componentMaterials,
                texture: componentTexture,
                children: componentChildren,
                animations: componentAnimations
            });   
        }

        //Creates Components objects
        var componentsTemp = [];
        components.forEach(function(element) {
            componentsTemp.push(new MyComponent(element.id, element.transformations, element.materials, element.texture, element.children, element.animations));
        })
        
        //Adding childrens to the components
        for(let i = 0; i < componentsTemp.length; i++){
            var childrens = componentsTemp[i].children.componentref.slice();
            componentsTemp[i].children.componentref = [];
            for(let j = 0; j < childrens.length; j++) {
                var c = componentsTemp.find(function(element) {
                    return element.id == childrens[j];
                });
                if(c == undefined)
                    return "no component with ID = " + childrens[j];
                else if (c.id == componentsTemp[i].id)
                    return "an object can not reference itself as a children (ID = " + c.id + ")";
                componentsTemp[i].addChildren_Component(c);
            }
        }

        this.components = componentsTemp;
        
        this.log("Parsed components");

        return null;
    }

    /**
     * Checks for loops in the graph
     */
    checkLoops() {
        var found = false;
        var i = 0;
        for(; i < this.components.length; i++) {
            if (this.components[i].id == this.idRoot) {
                found = true;
                break;
            }
        }
        if(!found) return "The component with the id specified for root does not exist";

        const visited = {};
        const stack = {};

        if(this._checkLoopsUtils(this.components[i], visited, stack))
            return "There is a cycle";        
        
        return null;
    }

    _checkLoopsUtils(c, visited, stack) {
        let id = c.id;
        if(!visited[id]) {
            visited[id] = true;
            stack[id] = true;
        }

        const children = c.children.componentref;
        for(let i = 0; i < children.length; i++) {
            const current = children[i];
            if(!visited[current.id] && this._checkLoopsUtils(current, visited, stack)) {
                return true;
            } else if(stack[current.id]) {
                return true;
            }
        }

        stack[id] = false;
        return false;
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        var rootMaterial;
        if(this.rootComponent.materials[0].id == "inherit")
            rootMaterial = this.materialDefault;
        else{
            rootMaterial = this.rootComponent.materials[0].material;
        }
        var rootTexture = this.rootComponent.texture;

        this.scene.pushMatrix();
        this.displaySceneRecursive(this.rootComponent, rootMaterial, rootTexture);
        this.scene.popMatrix();
    }
    
    displaySceneRecursive(component, materialFather, textureFather, fatherLength_s, fatherLength_t) {
    
        var currComponent = component
    
        var currMaterial = materialFather;
        var currTexture;
        

        if(currComponent.transformations != null)
            this.scene.multMatrix(currComponent.transformations);
        
        var index = this.materialCounter % currComponent.materials.length;
        if(currComponent.materials[index].id != "inherit"){
            currMaterial = currComponent.materials[index].material;
        }

        
        if(currComponent.texture.id == "none")
            currTexture = null;
        else if(currComponent.texture.id == "inherit")
            currTexture = textureFather;
        else
            currTexture = currComponent.texture;


        if(currTexture != null)
            currMaterial.setTexture(currTexture.texture);
        else
            currMaterial.setTexture(null);

        currMaterial.apply();


        var length_s = null;
        var length_t = null;

        if(currComponent.texture.id == "inherit" &&
        currComponent.texture.length_s == null &&
        currComponent.texture.length_t == null){
            length_s = fatherLength_s;
            length_t = fatherLength_t;
        }
        else if(currComponent.texture.id != "none"){
            length_s = currComponent.texture.length_s;
            length_t = currComponent.texture.length_t;
        }

        for(let n = 0; n < currComponent.animations.length; n++){
            if(currComponent.animations[n].timeCounter == currComponent.animations[n].time)
                currComponent.animations[n].apply();

            if(currComponent.animations[n].timeCounter != currComponent.animations[n].time){
                currComponent.animations[n].apply();
                break;
            }
        }
            
        for (let i = 0; i < currComponent.children.componentref.length; i++) {
            this.scene.pushMatrix();
            var children = currComponent.children.componentref[i];
            this.displaySceneRecursive(children, currMaterial, currTexture, length_s, length_t);
            this.scene.popMatrix();
        }

        for (let i = 0; i < currComponent.children.primitiveref.length; i++){
            var temp = currComponent.children.primitiveref[i];
            temp.primitive.updateTexCoords(length_s, length_t);
            temp.primitive.display();
        }
    }
}