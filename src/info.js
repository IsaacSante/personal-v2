import curDot from 'cursor-dot'
import p5 from "p5"
import base from "../images/base.obj"
const cursor = curDot({
    diameter: 40,
    easing: 5,
    background: '#fff',
  })
cursor.classList.add('cursor-class');
const canvasParent = document.getElementById("left-cont")
let parentWidth = canvasParent.offsetWidth
let parentHeight = canvasParent.offsetHeight

let scale = 2.5
if (window.innerWidth < 750)  {
scale = 1.5
   }

const Sketch = (p) => {
    let obj, pg;

        p.preload = () => {
            obj = p.loadModel(base, true);
        }

        p.setup = () => {
            p.createCanvas(parentWidth, parentHeight, p.WEBGL)
            pg = p.createGraphics(p.width, p.height)
            p.background(0)
        };

        p.draw = () => {
            p.background(0)
            p.clear()
            p.background(0)
            p.noStroke()
            p.rotateZ(p.PI)
            p.rotateX(p.QUARTER_PI/4)
            p.rotateY(p.radians(p.frameCount/2))
            p.rotateY(p.radians(40))
            p.scale(scale)
            p.translate(0, 40)
            p.model(obj)
                pg.clear()
                pg.push()
                pg.background(0)
                pg.translate(pg.width/2, pg.height)
                pg.rotate(p.radians(180))
                pg.textAlign(p.LEFT, p.CENTER)
                pg.randomSeed(4)
                        for(let i = 0; i < 900; i++) {
                            let txtSize = 300
                            let x = (pg.random(pg.width)+p.frameCount)%(pg.width+txtSize)-pg.width/2
                            let y = i * 40
                            pg.fill(255)
                            pg.textSize(40)
                            pg.text('DIGTAL SPACES PHYSICAL BODIES', -x, y)
                        }
                pg.pop()
            p.texture(pg)
        }
}
new p5(Sketch, "left-cont")