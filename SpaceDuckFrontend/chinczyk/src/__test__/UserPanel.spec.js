import React from "react";
import TestRenderer from "react-test-renderer";

import UserPanel from "../components/UserPanel.jsx";
describe("Players", () => {
	let component;
	let instance;
	beforeEach(()=>{
		component = TestRenderer.create(<UserPanel />).root;    
		instance = component.instance;
	})

	test("check name", () => {
	  	const player = component.findByProps({className:"userName"})
	  	expect(component.props.userName).toBe(player.props.children)
	});

	test("check point", () => {
	  	const player = component.findByProps({className:"userPoints"})
	  	expect(component.props.points).toBe(player.props.children)
	});
	
	test("admin panel", () => {
		component = TestRenderer.create(<UserPanel {...{adminView: true}}/>).root;    
  		expect(component.findByProps({className:"removeUser"}))
  	});


});