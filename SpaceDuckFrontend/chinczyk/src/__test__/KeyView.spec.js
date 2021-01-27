import React from "react";
import TestRenderer from "react-test-renderer";

import KeyView from "../components/KeyInfo.jsx";
describe("Game Key View", () => {
	const component = TestRenderer.create(<KeyView />).root;    
    const instance = component.instance;

	test("check key", () => {
		const key = component.findByProps({className:"settings-container"})
		const keyValue = key.findAllByType("h3")[0];
		expect(component.props.keyValue).toBe(keyValue.props.children)
  });
});