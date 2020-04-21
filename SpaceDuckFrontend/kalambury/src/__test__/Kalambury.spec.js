import React from "react";
import TestRenderer from "react-test-renderer";
import Kalambury from "../views/Kalambury.jsx";

describe("Main View", () => {
	 const component = TestRenderer.create(<Kalambury />).root;
	 const instance = component.instance;
  test("testing init", () => {
  
    expect(instance.state.instructionPopup).toBe(false);
    });
   test("testing instruction popup", () => {
	  instance.setState({instructionPopup:true})

	expect(component.findByProps({className: "instructionPopup"}))
  });
  test("testing guest panel", () => {
  
   	instance.setState({guest:true})
     expect(component.findByProps({className: "asGuest"}))
  });
});