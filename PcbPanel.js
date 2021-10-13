import React from "react";
import Svg, { Polygon } from "react-native-svg";

export default function PcbPanel(props) {
  const ppos = [
    [75, 25],
    [70, 28.125],
    [65, 31.25],
    [60, 34.375],
    [55, 37.5],
    [50, 40.625],
    [45, 43.75],
    [40, 46.875],
    [70, 21.875],
    [65, 25],
    [60, 28.125],
    [55, 31.25],
    [50, 34.375],
    [45, 37.5],
    [40, 40.625],
    [35, 43.75],
    [65, 18.75],
    [60, 21.875],
    [55, 25],
    [50, 28.125],
    [45, 31.25],
    [40, 34.375],
    [35, 37.5],
    [30, 40.625],
    [60, 15.625],
    [55, 18.75],
    [50, 21.875],
    [45, 25],
    [40, 28.125],
    [35, 31.25],
    [30, 34.375],
    [25, 37.5],
    [55, 12.5],
    [50, 15.625],
    [45, 18.75],
    [40, 21.875],
    [35, 25],
    [30, 28.125],
    [25, 31.25],
    [20, 34.375],
    [50, 9.375],
    [45, 12.5],
    [40, 15.625],
    [35, 18.75],
    [30, 21.875],
    [25, 25],
    [20, 28.125],
    [15, 31.25],
    [45, 6.25],
    [40, 9.375],
    [35, 12.5],
    [30, 15.625],
    [25, 18.75],
    [20, 21.875],
    [15, 25],
    [10, 28.125],
    [40, 3.125],
    [35, 6.25],
    [30, 9.375],
    [25, 12.5],
    [20, 15.625],
    [15, 18.75],
    [10, 21.875],
    [5, 25],
  ];
  const base_polygon = [
    [-5, 0],
    [0, -3.125],
    [5, 0],
    [0, 3.125],
  ]; //[[x,y],...]
  const base_colors = {
    w: "#fff",
    s: "#000",
    b: "#00f",
    r: "#f00",
    g: "#0f0",
    y: "#ff0",
    o: "#f70",
    c: "#0ff",
    m: "#f0f",
  };
  const code = props.str
    .trim()
    .toLowerCase()
    .replace(/([^rgbmcyows])/g, "s"); // + Array(ppos.length).fill('s').join('').substr(0, ppos.length);
  let polygons = [];
  let scale = 3;
  if (props.scale) {
    scale = props.scale;
  }
  for (let i = 0; i < code.length; i++) {
    let points = "";
    let offset = ppos[i];
    for (let xy in base_polygon) {
      if (xy < 1) {
        points +=
          (base_polygon[0][0] + offset[0]) * scale +
          "," +
          (base_polygon[0][1] + offset[1]) * scale +
          " ";
      } else {
        points +=
          (base_polygon[xy][0] + offset[0]) * scale +
          "," +
          (base_polygon[xy][1] + offset[1]) * scale +
          " ";
      }
    }
    polygons.push([points, base_colors[code.substr(i, 1)]]);
  }

  const polys = polygons.map((p, id) => {
    return <Polygon points={p[0]} fill={p[1]} key={id} />;
  });
  const height = 50 * scale;
  const width = 80 * scale;
  return (
    <Svg height={height} width={width}>
      {polys}
    </Svg>
  );
}

/*
class PcbPanel extends Component {
    constructor(props) {
      super(props);
      this.state = {str: ""}
    }
    
    handleCanvas = (canvas) => {
      const ctx = canvas.getContext('2d')
      const ppos = [[75, 25], [70, 28.125], [65, 31.25], [60, 34.375], [55, 37.5], [50, 40.625], [45, 43.75], [40, 46.875], [70, 21.875], [65, 25], [60, 28.125], [55, 31.25], [50, 34.375], [45, 37.5], [40, 40.625], [35, 43.75], [65, 18.75], [60, 21.875], [55, 25], [50, 28.125], [45, 31.25], [40, 34.375], [35, 37.5], [30, 40.625], [60, 15.625], [55, 18.75], [50, 21.875], [45, 25], [40, 28.125], [35, 31.25], [30, 34.375], [25, 37.5], [55, 12.5], [50, 15.625], [45, 18.75], [40, 21.875], [35, 25], [30, 28.125], [25, 31.25], [20, 34.375], [50, 9.375], [45, 12.5], [40, 15.625], [35, 18.75], [30, 21.875], [25, 25], [20, 28.125], [15, 31.25], [45, 6.25], [40, 9.375], [35, 12.5], [30, 15.625], [25, 18.75], [20, 21.875], [15, 25], [10, 28.125], [40, 3.125], [35, 6.25], [30, 9.375], [25, 12.5], [20, 15.625], [15, 18.75], [10, 21.875], [5, 25]]
      const base_polygon = [[-5, 0], [0, -3.125], [5, 0], [0, 3.125]] //[[x,y],...]
      const base_colors = { "w": "#fff", "s": "#000", "b": "#00f", "r": "#f00", "g": "#0f0", "y": "#ff0", "o": "#f70", "c": "#0ff", "m": "#f0f" }
      for (let i = 0; i < this.state.str.length; i++) {
        ctx.fillStyle = base_colors[this.state.str.substr(i, 1)]
        ctx.beginPath()
        let offset = ppos[i]
        for (let xy in base_polygon) {
          if (xy < 1) {
            ctx.moveTo((base_polygon[0][0] + offset[0]) * 3, (base_polygon[0][1] + offset[1]) * 3)
          } else {
            ctx.lineTo((base_polygon[xy][0] + offset[0]) * 3, (base_polygon[xy][1] + offset[1]) * 3)
          }
        }
        ctx.closePath()
        ctx.fill()
      }
    }  
  
    setString = (str) =>{
      this.setState({
        str: (str.trim().toLowerCase().replace(/([^rgbmcyows])/g, "s") + Array(ppos.length).fill('s').join('')).substr(0, ppos.length)});
    }
    
    render() {
      return (
        <Canvas ref={this.handleCanvas}/>
      );
    }  
  }
*/
