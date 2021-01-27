import React from "react";
import TestRenderer from "react-test-renderer";
import GameScreen from "../components/GameScreen.jsx";

describe("Game Screen", () => {
	let component;
	let instance;
	beforeEach(()=>{
		component = TestRenderer.create(<GameScreen />).root;    
    	instance = component.instance;	
	})
	
	describe("Chat",()=>{
		let chatInput;
		beforeEach(()=>{
			chatInput = component.findByProps({className: "chat-input"})
		})

		test("render with blank input",()=>{
			expect(instance.state.message).toBe('')
		});

		test("input change", ()=>{
			chatInput.props.onChange({target: {value: "To jest wiadomość"}})
			expect(instance.state.message).toBe('To jest wiadomość');
		});

		test("sending message", () => {
			chatInput.props.onChange({target: {value: "To jest wiadomość"}})
			chatInput.props.onKeyUp({keyCode: 13}) //enter ascii code
			expect(instance.state.message).toBe(''); 
	   });
	})
  
  test("clear board", () => {
  	instance.setState({clear: false})
   	const clear = component.findByProps({className: "color clear"});
   	clear.props.onClick();
   	expect(instance.state.clear).toBe(true)

  });
  test("show settings", () => {
  	instance.setState({settings: true})
  	expect(component.findByProps({className: "settings-container"}))
  });
  test("close settings", ()=>{
  	instance.setState({settings: true, privateTable:true})
  	const button = component.findByType("button");
  	button.props.onClick();
  	expect(instance.state.settings).toBe(false)
  })
   test("show key properly", () => {
   	instance.setState({settings: false, keyView:true, privateTable:true})
  	const key = component.findByProps({className:"settings-container"})
  	const keyValue = key.findAllByType("h3")[0];
  	expect(instance.state.key).toBe(keyValue.props.children)
  });

   	describe("Changing brush color",()=>{
   		let colors;
   		beforeEach(()=>{
   			colors = component.findAllByProps({className: "color"});
   		})
   		
	    test("change brush color: white", () => {
		  	let i=0;
		   	
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });

	    test("change brush color: fuksja", () => {
		  	let i=1;
		   	
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });
	    test("change brush color: orange", () => {
		  	let i=2;
		   	
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });
	    test("change brush color: green", () => {
		  	let i=3;
		   	
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });
	    test("change brush color: blue", () => {
			let i=4;
			  
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });
	});
	

});