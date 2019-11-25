import React,{Component} from 'react';
import './App.css';
import Navigation from "./components/Navigation/Navigation"
import Clarifai from "clarifai";
import Logo from "./components/Logo/Logo"
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkform"
import Rank from "./components/Rank/Rank"
import FaceRecognition from "./components/FaceRecognition/FaceRecognition"
import Particles from 'react-particles-js';
import "tachyons";

const particlesOptions = {
  particles: {
    number:{
      value:30,
      density: {
        enable: true,
        value_area: 250,
      }
    }
  },
  interactivity: {
    events: {
        onhover: {
            enable: true,
            "mode": "repulse"
      }
    }
  } 
}

const app = new Clarifai.App({
  apiKey: '18dbbc13b14e458f8174a33c062accf3'
 });

class App extends Component {
  constructor(){
    super();
    this.state = {
      input :"",
      imageURL:"",
      box : {}
    }
  }

  calculaFaceLocation = (data) =>{
    console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
    const clairiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
      return{
        leftCol: clairiFace.left_col * width,
        topRow: clairiFace.top_row *height,
        rightCol: width - (clairiFace.right_col * width),
        bottomRow: height - (clairiFace.bottom_row * height)
      }
  }

  diplayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box});
  }
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL : this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => this.diplayFaceBox(this.calculaFaceLocation(response)))
      .catch(err => console.log(err))
  }

  render(){
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit} 
        />
        <FaceRecognition imageURL={this.state.imageURL} box={this.state.box} />
      </div>
    );
  }
}

export default App;
