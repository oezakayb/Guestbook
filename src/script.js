import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { Mesh, Quaternion } from 'three'

/**
 * Base
 */
const parameters = {
    planetColor: 0xff0000,
    planetSize: 1,
    belt: true,
    beltColor: 0x00ff00,
    beltSize: 1,
    download: () =>{
       download()
    }
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.CubeTextureLoader()
            .setPath('resources/skybox/')
            .load([
 	'right.png', 
    'left.png',
 	'top.png', 
    'bottom.png',
 	'front.png',
    'back.png'
    ]);


//Planet
const planetGeom = new THREE.SphereBufferGeometry(15, 64, 32)
const planetMat = new THREE.MeshPhongMaterial({color: 0xff0000})
const planet = new THREE.Mesh(planetGeom, planetMat)

    //Belt
    const beltGeom = new THREE.TorusBufferGeometry(20, 1.85, 2, 100)
    const beltMat = new THREE.MeshPhongMaterial({color: 0x00ff00})
    const belt = new THREE.Mesh(beltGeom, beltMat)

    
   

const group = new THREE.Group()
group.add(planet)
group.add(belt)
scene.add(group)

const quat = new THREE.Quaternion()
quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0.5), Math.PI/2)
belt.applyQuaternion(quat)



//Light
const alight = new THREE.AmbientLight( 0x404040 ) // soft white light
scene.add( alight );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 50
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Download .glb file
var btn = document.createElement('button');
document.body.appendChild(btn);
btn.textContent = 'Download .glb';
btn.onclick = download;

function download() {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    function (result) {
      saveArrayBuffer(result, 'scene.glb');
    },
    { binary: true }
  );
}

function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

function save(blob, filename) {
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  // URL.revokeObjectURL( url ); breaks Firefox...
}

//Panel
const gui = new dat.GUI({
    // closed: true,
    width: 400
})
var beltVisible= false

gui
    .addColor(parameters, 'planetColor')
    .onChange(() =>
    {
        planetMat.color.set(parameters.planetColor)
    })

gui
    .add(parameters, 'planetSize').min(0.1).max(5).step(0.01)
    .onChange(() => 
    {
        planet.scale.x = parameters.planetSize
        planet.scale.y = parameters.planetSize
        planet.scale.z = parameters.planetSize

        if((belt.scale.x * 17) <= planet.scale.x * (15))
        {
            var tempScale = planet.scale.x
            belt.scale.x = tempScale
            belt.scale.y = tempScale
            belt.scale.z = tempScale
        }
    }
    )

gui
    .add(parameters, 'belt')
    .onChange(()=>
    {
        belt.visible = parameters.belt
    })

gui
    .addColor(parameters, 'beltColor')
    .onChange(() =>
    {
        beltMat.color.set(parameters.beltColor)
    })

gui
    .add(parameters, 'beltSize').min(0.1).max(5).step(0.01)
    .onChange(() => 
    {
        belt.scale.x = parameters.beltSize
        belt.scale.y = parameters.beltSize
        belt.scale.z = parameters.beltSize

        if((belt.scale.x * 17) <= planet.scale.x * (15))
        {
            var tempScale = belt.scale.x
            planet.scale.x = tempScale
            planet.scale.y = tempScale
            planet.scale.z = tempScale
        }
    }
    )

gui.add(parameters, 'download')

//Animate/Render-loop
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()