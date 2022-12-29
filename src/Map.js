import React from "react";
import ReactDOM from "react-dom";
import World from "@svg-maps/world";
import { CheckboxSVGMap, SVGMap } from "react-svg-map";
import "./Map.css";

function Map(props) {

    return (
        <SVGMap map={World} onLocationClick={location => console.log(location.target.ariaLabel)} /> //onLocationMouseOver={location => console.log(location.target.ariaLabel)}/>
    )
}

export default Map;