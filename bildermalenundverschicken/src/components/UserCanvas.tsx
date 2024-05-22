import React from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export const Canvas = class extends React.Component<any, any> {
    canvas: React.RefObject<any>;

    constructor(props: any) {
        super(props);
        this.canvas = React.createRef();
        this.state = { strokeWidth: 3, color: props.color };
    }

    bigPenMode = () => {
        this.setState({ strokeWidth: 7 });
    };

    smallPenMode = () => {
        this.setState({ strokeWidth: 3 });
    };

    eraseMode = () => {
        if (this.canvas.current) {
            this.canvas.current.eraseMode(true);
        }
    };

    penMode = () => {
        if (this.canvas.current) {
            this.canvas.current.eraseMode(false);
        }
    };

    clearCanvas = () => {
        if (this.canvas.current) {
            this.canvas.current.clearCanvas();
        }
    };

    grabSvg = () => {
        return this.canvas.current?.exportPaths();
    };

    fillSvg = (paths: any) => {
        if (this.canvas.current) {
            this.canvas.current.loadPaths(paths);
        }
    };

    grabImage = () => {
        return this.canvas.current?.exportImage("png");
    };

    setColor = (color: string) => {
        this.setState({ color: color });
    };

    render() {
        return (
            <ReactSketchCanvas
                className="canvas"
                style={{
                    border: `3px solid ${this.state.color}`,
                    borderRadius: "8px",
                    backgroundSize: "contain",
                    backgroundColor: "white",
                    marginLeft: "15px",
                    width: "calc(100% - 22px)"
                }}
                ref={this.canvas}
                strokeWidth={this.state.strokeWidth}
                strokeColor="black"
            />
        );
    }
};
