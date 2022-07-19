
<h1>Responsive 3D Product Display Three.js</h1>

Using a compressed GLTF 2.0 model with Draco loader. Product changes a specific texture on the fly after the model has been loaded. Model adapts to a standard div parent to keep it responsive. Created using Three JS

A 3D model in blender using only basic Principled BSDF shaders with image texture inputs using roughness, metallic and normal maps.
![image](https://user-images.githubusercontent.com/24873627/177060673-7b5ba2c1-676b-49f8-96c1-a651a99fd0f5.png)

The Bottle was created in blender and exported using GLTF 2.0 which was compressed to reduce server load on importing and loading of model in the browser. This was in exchange for longer model unpacking time on the clients end.
![image](https://user-images.githubusercontent.com/24873627/177060698-22acdf18-5cc3-47a7-8d20-6656b9949410.png)

The bottle is split into separate mesh components - bottle, bottlebase, bottlecap, juice and label.
![image](https://user-images.githubusercontent.com/24873627/177060705-83329b92-f75d-4072-8c66-d80249e8b542.png)

Each mesh was split up to keep an organised texture mapping process without having to change any of the model details except the label of the bottle.

![image](https://user-images.githubusercontent.com/24873627/177060714-ae92831b-679e-477f-b55e-1bcb126ea5b9.png)

The model has been UV unwrapped to match the dimensions of the label so all the images need to be exported to match these dimensions to stop distortion.

![image](https://user-images.githubusercontent.com/24873627/177060737-fe4e7706-0718-4d16-9e16-5fa321411c0b.png)
![image](https://user-images.githubusercontent.com/24873627/177060738-a7ecd95a-60a9-41f0-ae32-a79beb16ada5.png)

<h4>Setting up the html</h4>
<p>Importing the three.js library using import maps and then add our main javascript file which is set to module to allow imports </p>
<p>The "img-big-wrap" is the parent div for the product which the scene will use to wrap all other content inside, aria-label is where the intial label texture image link is passed into the threejs intit() method</p>
<p>The loading gif is placed inside a "P" tag, this can be substituted for a CSS loader</p>
<p>The canvas is setup using basic styles to fit the parent element.</p>
<p>The select element holds the links to the other textures which will be used to update the model to show different labels by adding an event listener to the element.</p>

```html
                        <script type="text/javascript" async src="./js/es-module-shims.js"></script>
                        <script type="importmap">
                            {
                                "imports": {
                                    "three": "./js/three.module.js",
                                    "OrbitControls": "./js/OrbitControls.js"
                                }
                            }
                        </script>
                        <script src ="js/vapebottleapp.js" type="module"></script>
                        <div class="img-big-wrap">
                            <div>
                                <p>
                                    <label for="progressLoader" id="progressLoader_label">3D View Loading...</label>
                                    <progress id="progressLoader" max="100" value="0"></progress>
                                </p>
                                <canvas style="height: 100%; margin: auto; width: 100%; visibility: initial; touch-action: none;" id="bottle_3D" class="loadingScreen" data-texture="https://www.ttkltd.co.nz/GamerSauceCompressed/textures/goldenbanana.png" data-engine="three.js r141" width="450" height="450"></canvas>
                                <a data-fancybox="gallery" id="mainImageLink" href="https://cdn-vapeshed.co.nz/assets/images/products/8914/gamer-sauce-juice-3757943.png">
                                </a>
                            </div>
                            <div style="margin: auto;display: flex;">
                                <select id="labelSelect" style="margin: auto;">
                                    <option value="GamerSauceCompressed/textures/goldenbanana.png" selected="">Golden Banana</option>
                                    <option value="GamerSauceCompressed/textures/bubbletrouble.png">Bubble Trouble</option>
                                    <option value="GamerSauceCompressed/textures/levelup.png">Level Up</option> 



                                    
                                </select>
                            </div>
                        </div>

```
