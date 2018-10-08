class MyComponent {

    constructor(id, transformations, materials, texture, children) {
        this.id = id;
        this.transformations = transformations;
        this.materials = materials;
        this.texture = texture;
        this.children = children;
    }

    addChildren_Component(component) {
        this.children.componentref.push(component);
    }

}