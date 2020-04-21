import React from "react";
import TestRenderer from "react-test-renderer";

import LoginView from "../Views/LoginView.jsx";
describe("Login View", () => {
	const component = TestRenderer.create(<LoginView />).root;    
    const instance = component.instance;

test("testing login inputs", () => {
	const login = component.findByProps({placeholder: "login/email"})
	login.props.onChange({target: {value: "test"}});
	expect(instance.state.name).toBe(login.props.value);

	const password = component.findByProps({placeholder: "hasło"})
	password.props.onChange({target: {value: "test"}});
	expect(instance.state.password).toBe(password.props.value);
    
  });
});