import React from "react";
import {
  ChromePicker,
  SketchPicker,
  PhotoshopPicker,
  GithubPicker,
  TwitterPicker,
  SwatchesPicker,
  CompactPicker
} from "react-color";

import "./styles.css";

export class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      changeColor: props.color ? props.color : "#ffffff",
      color: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      }
    };
  }
  onHandleShowColorPicker = () => {
    this.setState({ displayColorPicker: true });
  };
  onHandleCloseColorPicker = () => {
    this.setState({ displayColorPicker: false });
  };

  onChangeColorPicker = color => {
    this.setState({ color: color.rgb, changeColor: color.hex });
    this.props.onColorChange(color);
  };

  generatePickerByType = type => {
    if (type === "Chrome") {
      return (
        <ChromePicker
          color={this.state.color}
          onChange={this.onChangeColorPicker}
        />
      );
    } else if (type === "Sketch") {
      return (
        <SketchPicker
          color={this.state.color}
          onChange={this.onChangeColorPicker}
        />
      );
    } else if (type === "Photoshop") {
      return (
        <PhotoshopPicker
          color={this.state.color}
          onChange={this.onChangeColorPicker}
        />
      );
    } else if (type === "Github") {
      return (
        <GithubPicker
          color={this.state.color}
          onChange={this.onChangeColorPicker}
        />
      );
    } else if (type === "Twitter") {
      return (
        <TwitterPicker
          color={this.state.color}
          onChange={this.onChangeColorPicker}
        />
      );
    } else if (type === "Swatches") {
      return (
        <SwatchesPicker
          color={this.state.color}
          onChange={this.onChangeColorPicker}
        />
      );
    } else if (type === "Compact") {
      return (
        <CompactPicker
          color={this.state.color}
          onChange={this.onChangeColorPicker}
        />
      );
    } else {
      return (
        <SketchPicker
          color={this.state.color}
          onChange={this.onChangeColorPicker}
        />
      );
    }
  };

  render() {
    return (
      <div className={"color-picker-container"}>
        <div
          style={{ backgroundColor: this.props.defaultColor || this.state.changeColor }}
          className={"color-picker-color-background"}
		  onClick={() => this.onHandleShowColorPicker()}
        />
        <div className={"color-text-with-popup"}>
          <input
            readOnly
            className={"color-picker-text"}
            type="text"
            name="color-picker-text"
            value={this.state.changeColor}
            onClick={() => this.onHandleShowColorPicker()}
          />
          {this.state.displayColorPicker && (
            <div className={"color-picker-palette"}>
              <div
                className={"color-picker-cover"}
                onClick={() => this.onHandleCloseColorPicker()}
              />
              {this.generatePickerByType(this.props.pickerType || "Sketch")}
            </div>
          )}
        </div>
      </div>
    );
  }
}

ColorPicker.defaultProps = {
  defaultTitle: "Color Picker",
  defaultLabelStyle: {
    paddingBottom: "7px",
    fontSize: "11px"
  },
  defaultColorTextBoxStyle: {
    height: "35px",
    border: "none",
    borderBottom: "1px solid lightgray",
    paddingLeft: "35px"
  }
};

export default ColorPicker;