var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

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
            }
            this.views[viewId] = {
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

        this.lights = [];
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
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

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

            this.lights[lightId] = {
                enabled: enabled,
                angle: lightAngle,
                exponent: lightExponent,
                location: locationLight,
                ambient: ambientIllumination,
                diffuse: diffuseIllumination,
                specular: specularIllumination,
                target: target
            }
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        this.textures = [];
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
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            //get the file of the current texture
            var file = this.reader.getString(children[i], 'file');
            if (file == null)
                return "no file defined for " + textureId;

            this.textures[textureId] = file;
            numTextures++;
        }

        if (numTextures == 0)
            return "at least one texture must be defined";

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> block.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        var numMaterials = 0;

        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current material
            var materialId = this.reader.getString(children[i], 'id');
            if (materialId == null)
                return "no ID defined for texture";
                
            // Checks for repeated IDs.
            if (this.materials[materialId] != null)
                return "ID must be unique for each material (conflict: ID = " + materialId + ")";

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

            this.materials[materialId] = {
                shininess: shininess,
                emission: emission,
                ambient: ambientIllumination,
                diffuse: diffuseIllumination,
                specular: specularIllumination
            }
            numMaterials++;

        }

        if (numMaterials == 0)
            return "at least one material must be defined";

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
                return "at least on action must be defined for tansformation with ID = " + transformationId;
            }
            
            this.transformations[transformationId] = innerTransformations;
            numTransformations++;

        }

        if (numTransformations == 0)
            return "at least one transformation must be defined";

        this.log("Parsed transformations");

        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        // TODO: Parse Primitives node

        this.log("Parsed primitives");

        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        // TODO: Parse Components node

        this.log("Parsed components");

        return null;
    }

    /*
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
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}