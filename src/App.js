import React,{Component} from 'react';
import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Clarifai from "clarifai";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkform";
import Rank from "./components/Rank/Rank";
import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/signIn";
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
      box : {},
      route: "signin",
      isSignedIn : false
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

  onRouteChange = (route) =>{
    if (route === "signout"){
      this.setState({isSignedIn: false})
    }
    else if (route === "home"){
      this.setState({isSignedIn: true})
    }

      this.setState({route: route});
  }

  render(){
    const {isSignedIn, imageURL, route, box} = this.state;

    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === "home"
          ?<div>
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} 
            />
            <FaceRecognition imageURL={imageURL} box={box} />
          </div>
          :(
            route === "signin"
            ?<Signin onRouteChange={this.onRouteChange} />
            :<Register onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
