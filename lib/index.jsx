'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = React.PropTypes;

const DrawableCanvas = React.createClass({
    propTypes: {
        brushColor: PropTypes.string,
        lineWidth: PropTypes.number,
        canvasStyle: PropTypes.shape({
            backgroundColor: PropTypes.string,
            cursor: PropTypes.string
        }),
        clear: PropTypes.bool
    },
    getDefaultProps() {
        return {
            brushColor: '#000000',
            lineWidth: 4,
            canvasStyle: {
                backgroundColor: '#FFFFFF',
                cursor: 'pointer'
            },
            clear: false
        };
    },
    getInitialState(){
        return {
            canvas: null,
            context: null,
            drawing: false,
            lastX: 0,
            lastY: 0,
            history: []
        };
    },
    componentDidMount(){
        let canvas = ReactDOM.findDOMNode(this);

        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let ctx = canvas.getContext('2d');

        ctx.fillStyle = this.props.canvasStyle.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.setState({
            canvas: canvas,
            context: ctx
        });
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.clear) {
            this.resetCanvas();
        }
    },
    handleOnMouseDown(e){
        let rect = this.state.canvas.getBoundingClientRect();
        if (e.targetTouches) {
            this.setState({
                lastX: e.targetTouches[0].pageX - rect.left,
                lastY: e.targetTouches[0].pageY - rect.top
            });
        }
        else {
            this.setState({
                lastX: e.clientX - rect.left,
                lastY: e.clientY - rect.top
            });
        }
        this.startDrawing(this.state.lastX, this.state.lastY);
        this.setState({
            drawing: true
        });
    },
    handleOnMouseMove(e){
        if (this.state.drawing) {
            let rect = this.state.canvas.getBoundingClientRect();
            let lastX = this.state.lastX;
            let lastY = this.state.lastY;
            let currentX;
            let currentY;
            if (e.targetTouches) {
                currentX = e.targetTouches[0].pageX - rect.left;
                currentY = e.targetTouches[0].pageY - rect.top;
            }
            else {
                currentX = e.clientX - rect.left;
                currentY = e.clientY - rect.top;
            }
            this.draw(lastX, lastY, currentX, currentY);
            this.setState({
                lastX: currentX,
                lastY: currentY
            });
        }
    },
    handleonMouseUp(){
        this.stopDrawing();
        this.setState({
            drawing: false
        });
    },
    draw(lX, lY, cX, cY){
        this.state.context.lineTo(cX, cY);
        this.state.context.stroke();
    },
    resetCanvas(){
        let width = this.state.context.canvas.width;
        let height = this.state.context.canvas.height;
        this.state.context.fillStyle = this.props.canvasStyle.backgroundColor;
        this.state.context.fillRect(0, 0, width, height);
    },
    getCanvas() {
        return this.state.canvas;
    },
    getContext() {
        return this.state.context;
    },
    startDrawing(cX, cY) {
        this.state.context.moveTo(cX, cY);
        this.state.context.strokeStyle = this.props.brushColor;
        this.state.context.lineWidth = this.props.lineWidth;
        this.state.context.lineJoin = 'round';
        this.state.context.beginPath();
    },
    stopDrawing() {
        this.state.context.closePath();
    },
    getDefaultStyle(){
        return {
            backgroundColor: '#FFFFFF',
            cursor: 'pointer'
        };
    },
    canvasStyle(){
        let defaults = this.getDefaultStyle();
        let custom = this.props.canvasStyle;
        return Object.assign({}, defaults, custom);
    },
    render() {
        return (
            <canvas style={this.canvasStyle()}
                    onMouseDown={this.handleOnMouseDown}
                    onTouchStart={this.handleOnMouseDown}
                    onMouseMove={this.handleOnMouseMove}
                    onTouchMove={this.handleOnMouseMove}
                    onMouseUp={this.handleonMouseUp}
                    onTouchEnd={this.handleonMouseUp}
            >
            </canvas>
        );
    }

});

module.exports = DrawableCanvas;
