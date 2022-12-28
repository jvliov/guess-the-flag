import React from "react";
import ReactDOM from "react-dom";
import World from "@svg-maps/world";
import { CheckboxSVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";

function Map(props) {

    return (
        <CheckboxSVGMap map={World} />
    )
}

export default Map;