    import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
    // import orbit controls 
    import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
    // console.log(OrbitControls)
    import * as dat from 'dat.gui'
    // console.log(dat)
    import gsap from 'gsap'
    // console.log(gsap)

    /* GUI initialization */
    const gui = new dat.GUI()
    // console.log(gui)
    const world = {
      plane:{
        width:400,
        height:400,
        widthSegments:50,
        heightSegments:50
      }
    }    
    // Add Width
    gui.add(world.plane, 'width', 1, 500)
    .onChange(generatePlane)
    // ADD Height
    gui.add(world.plane, 'height', 1, 500)
    .onChange(generatePlane)
    // Add WidthSegment
    gui.add(world.plane, 'widthSegments', 1, 100)
    .onChange(generatePlane)
    // ADD HeightSegment
    gui.add(world.plane, 'heightSegments', 1, 100)
    .onChange(generatePlane)
    


/*************   GENERATE PLANE    **************/
    function generatePlane(){
      planeMesh.geometry.dispose()
      planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height, 
        world.plane.widthSegments, 
        world.plane.heightSegments
      )



      // Jaggedness
          // Vertice Position Randomization
          // console.log(planeMesh.geometry.attributes.position.array)
          const {array} = planeMesh.geometry.attributes.position

          const randomValues = []
          for(let i =0; i< array.length; i++){
            // console.log(i)
            // console.log(array[i])
            if(i%3 ===0)
            {
              const x = array[i]
              const y = array[i+1]
              const z = array[i+2]
            
              array[i] = x + (Math.random() - 0.5) * 3
              array[i + 1] = y + (Math.random() - 0.5)* 3 
              array[i+2] = z + (Math.random() - 0.5) * 3
            }
            randomValues.push(Math.random() *  Math.PI * 2)
          }

          // console.log(randomValues)


          planeMesh.geometry.attributes.position.randomValues = randomValues


          planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array
          // console.log(planeMesh.geometry.attributes.position)




       

      //set color again on modifying the width / height /ws/ hs
      const colors=[]
      for(let i = 0 ; i < planeMesh.geometry.attributes.position.count; i++)
      {
        // console.log(i)
        colors.push(0,0.19,0.4)
      }
      // console.log('colors- ',colors)

      planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(
        new Float32Array(colors), 3))
      // console.log(planeMesh.geometry.attributes)

    }
 
 
  // import * as THREE from 'three';


/* IMPORT RAYCASTER - mouse pointer ray*/
const raycaster = new THREE.Raycaster()
// console.log(raycaster)


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




//Setting camera position from plane
camera.position.z = 50

/* Plane Mesh */
// const planeGeometry = new THREE.PlaneGeometry(19, 19, 17, 17)
const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000,
  side: THREE.DoubleSide, 
  flatShading: THREE.FlatShading, 
  vertexColors: true})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
// console.log(planeMesh)
scene.add(planeMesh)




/* Add new Attribute in Planemesh geometry for the change of color rays */

// MOVED TO generatePlane FUNCTION 

// //for all attributes
// // Color attribute addition
// const colors=[]
// for(let i = 0 ; i < planeMesh.geometry.attributes.position.count; i++)
// {
//   // console.log(i)
//   colors.push(0,0.19,0.4)
// }
// // console.log('colors- ',colors)

// planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
// // console.log(planeMesh.geometry.attributes)


// /After create Mash generate Plan which has all the randomization in it 
generatePlane()

/* Add light to the Mesh*/
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0,-1,1 )
scene.add(light)

// Back Light Position
const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0,0,-1 )
scene.add(backLight)

// ADD STAR LIGHT GAZES GALAXIES 

const starGeometry = new THREE.BufferGeometry()
const starMataerial = new THREE.PointsMaterial({
  color:0xffffff
})

// console.log(starGeometry)
// console.log(starMataerial)


const starVerticies =[]
for(let i=0; i<10000; i++)
{
  const x = (Math.random()- 0.5 ) * 2000
  const y = (Math.random()- 0.5 ) * 2000
  const z = (Math.random()- 0.5 ) * 2000
  // console.log(x,y,z)
  starVerticies.push(x,y,z)
}
// console.log(starVerticies)

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(
  starVerticies, 3))


const stars = new THREE.Points(starGeometry, starMataerial)
scene.add(stars)






const mouse={
  x: undefined,
  y: undefined
}


let frame = 0


/***************** Animation to the Mesh ******************/
function animate(){
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
  
  // mesh.rotation.x += 0.01
  // mesh.rotation.y += 0.01

  // planeMesh.rotation.x +=0.01

  // raycaster call
  raycaster.setFromCamera(mouse, camera)

  // add small member of frame every time
  frame += 0.01


  const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position

  // ANIMATE ORIGINAL POSITION VERTICE
  for (var i = 0; i < array.length; i+=3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i] ) *0.01
    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1] ) *0.001
    // if(i ===0){
    //   // console.log(array[i])
    // }
  }

  planeMesh.geometry.attributes.position.needsUpdate = true    



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
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)
    // CHANGE VERTICE 2 COLOR
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)
    // CHANGE VERTICE 3 COLOR
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    // Animate back to original color using gsap
    const initialColor={
      r: 0,
      g:0.19,
      b:0.4
    }
    const hoverColor={
      r: 0.1,
      g:0.5,
      b:1
    }
    gsap.to(hoverColor,{
      r:initialColor.r,
      g:initialColor.g,
      b:initialColor.b,
      onUpdate: () => {
        // console.log(hoverColor)
        // CHANGE VERTICE 1 COLOR
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)
        // CHANGE VERTICE 2 COLOR
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)
        // CHANGE VERTICE 3 COLOR
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
      }
    })

    //updateon the planemesh
    intersects[0].object.geometry.attributes.color.needsUpdate = true
  }


  //MOVE STARS 

  stars.rotation.x += 0.0005
  // stars.rotation.y += 0.0005
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


/************ Add animation to Text /************/

gsap.to('#name-text', {
  opacity: 1,
  duration: 1.5,
  y:0,
  ease:'expo'
})
 
gsap.to('#home-par-text', {
  opacity: 1,
  duration: 1.5,
  delay:0.3,
  y:0,
  ease:'expo'
})

gsap.to('#home-link-text', {
  opacity: 1,
  duration: 1.5,
  delay:0.6,
  y:0,
  ease:'expo'
})




/************* CAMERA TRANSITIONS MOVEMENT *****************/

document.querySelector('#home-link-text').addEventListener('click',
(e)=>{
        e.preventDefault()
        gsap.to('#container',{
          opacity:0,
        })
      gsap.to(camera.position,{
        z:25,
        ease:'power3.inOut',
        duration:2
      })
      gsap.to(camera.rotation,{
        x:1.57,
        ease:'power3.inOut',
        duration:2
      })
      gsap.to(camera.position,{
        y:1000,
        ease:'power3.in',
        duration:1,
        delay:2
      })
    }
)


