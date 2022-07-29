    import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
    // import orbit controls 
    import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
    console.log(OrbitControls)
    import * as dat from 'dat.gui'
    // console.log(dat)

    /* GUI initialization */
    const gui = new dat.GUI()
    // console.log(gui)
    const world = {
      plane:{
        width:10,
        height:10,
        widthSegments:10,
        heightSegments:10
      }
    }    
    // Add Width
    gui.add(world.plane, 'width', 1, 20)
    .onChange(generatePlane)
    // ADD Height
    gui.add(world.plane, 'height', 1, 20)
    .onChange(generatePlane)
    // Add WidthSegment
    gui.add(world.plane, 'widthSegments', 1, 50)
    .onChange(generatePlane)
    // ADD HeightSegment
    gui.add(world.plane, 'heightSegments', 1, 50)
    .onChange(generatePlane)
    

    function generatePlane(){
      planeMesh.geometry.dispose()
      planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
      const {array} = planeMesh.geometry.attributes.position
      for(let i =0; i< array.length; i+=3){
        // console.log(i)
        // console.log(array[i])
        const x = array[i]
        const y = array[i+1]
        const z = array[i+2]

        array[i+2] = Math.random()
      }
    }
 
 
  // import * as THREE from 'three';


/* IMPORT RAYCASTER - mouse pointer ray*/
const raycaster = new THREE.Raycaster()
console.log(raycaster)


/* Create Scene, Camera and Render */
  const scene = new THREE.Scene();
  // console.log(scene)

  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
  // console.log(camera)

  const renderer = new THREE.WebGLRenderer()
  // console.log(renderer)

//render all three with full width and height
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)


/* create Mesh -> Geometry + Material Paint */

/* Box Mesh */
/* 
// ************************************************************
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// console.log(boxGeometry)

const material = new THREE.MeshBasicMaterial({color: 0x00ff00 })
// console.log(material)

const mesh = new THREE.Mesh(boxGeometry, material)
// console.log(mesh)

scene.add(mesh)
************************************************************
*/


/* Orbit Control */
new OrbitControls(camera, renderer.domElement)





camera.position.z = 5

/* Plane Mesh */
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10)
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000,
  side: THREE.DoubleSide, 
  flatShading: THREE.FlatShading, 
  vertexColors: true})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
// console.log(planeMesh)
scene.add(planeMesh)


// Jaggedness
console.log(planeMesh.geometry.attributes.position.array)
const {array} = planeMesh.geometry.attributes.position
for(let i =0; i< array.length; i+=3){
  // console.log(i)
  // console.log(array[i])
  const x = array[i]
  const y = array[i+1]
  const z = array[i+2]

  array[i+2] = Math.random()
}

/* Add new Attribute in Planemesh geometry for the change of color rays */

//for all attributes
const colors=[]
for(let i = 0 ; i < planeMesh.geometry.attributes.position.count; i++)
{
  console.log(i)
  colors.push(1,0,0)
}
console.log('colors- ',colors)

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
console.log(planeMesh.geometry.attributes)


/* Add light to the Mesh*/
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0,0,1 )
scene.add(light)

// Back Light Position
const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0,0,-1 )
scene.add(backLight)

const mouse={
  x: undefined,
  y: undefined
}

/* Animation to the Mesh */
function animate(){
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
  
  // mesh.rotation.x += 0.01
  // mesh.rotation.y += 0.01

  // planeMesh.rotation.x +=0.01

  // raycaster call
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(planeMesh)
  // console.log(intersects)
  if(intersects.length > 0){
    // console.log('intersecting')

    // change intersect face color
    // ******************************
    // intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, 0)
    // intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b, 0)
    // intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c, 0)

    //Destructure
    const {color} = intersects[0].object.geometry.attributes
    
    // CHANGE VERTICE 1 COLOR
    color.setX(intersects[0].face.a, 0)
    color.setY(intersects[0].face.a, 0)
    color.setZ(intersects[0].face.a, 1)
    // CHANGE VERTICE 2 COLOR
    color.setX(intersects[0].face.b, 0)
    color.setY(intersects[0].face.b, 0)
    color.setZ(intersects[0].face.b, 1)
    // CHANGE VERTICE 3 COLOR
    color.setX(intersects[0].face.c, 0)
    color.setY(intersects[0].face.c, 0)
    color.setZ(intersects[0].face.c, 1)


    //updateon the planemesh
    intersects[0].object.geometry.attributes.color.needsUpdate = true
  }
}


animate()


/* EVENT LISTENERS For Mouse Movement*/



addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY/ innerHeight) * 2 + 1
  // console.log(event.clientX)
  // console.log(event.clientY)
  // console.log(mouse)
})




