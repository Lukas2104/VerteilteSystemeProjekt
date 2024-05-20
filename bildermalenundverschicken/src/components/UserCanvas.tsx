import React from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export const Canvas = class extends React.Component<any,any> {
    canvas: React.RefObject<any>;

    constructor(props:any) {
        super(props);
        this.canvas = React.createRef();
        this.state = {strokeWidth: 3, color: props.color};
    }

    bigPenMode(){
        this.setState({...this.state, strokeWidth: 7})
    }

    smallPenMode(){
        this.setState({...this.state, strokeWidth: 3})
    }

    eraseMode(){
        this.canvas.current.eraseMode(true)
    }

    penMode(){
        this.canvas.current.eraseMode(false)
    }

    clearCanvas(){
        this.canvas.current.clearCanvas()
    }

    grabSvg(paths:any){
        this.canvas.current.loadPaths(paths)
    }

    fillSvg(paths:any){
        this.canvas.current.loadPaths(paths)
    }

    grabImage(){
        return this.canvas.current.exportImage("png")
    }

    setColor(color:string){
        this.setState({...this.state, color: color})
    }

    render() {
        return (
            <>
              <ReactSketchCanvas 
                className="canvas"
                style={{
                    border: `3px solid ${this.state.color}`,
                    borderRadius: '8px',
                    backgroundSize: 'contain',
                    backgroundColor: 'white',
                    marginLeft: '15px',
                    width:"calc(100% - 22px)"
                  }}
                ref={this.canvas}
                strokeWidth={this.state.strokeWidth}
                strokeColor="black"
              />
            </>
        )
    }

    /*
    render() {
        return (
            <>
                <ReactSketchCanvas
                  className="canvas"
                  style={{
                    border: `3px solid ${this.state.color}`,
                    borderRadius: '8px',
                    backgroundSize: 'contain',
                    backgroundColor: 'white',
                    marginLeft: '10px',
                    marginRight: 0,
                    width:"calc(100% - 22px)"
                  }}
                  ref={this.canvas}
                  strokeWidth={this.state.strokeWidth}
                  strokeColor="black"
                  backgroundImage='https://i.imgur.com/UWSVFu3.png'
                />
            </>
        )
    }
    */
}