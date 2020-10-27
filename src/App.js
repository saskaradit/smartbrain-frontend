import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation.js';
import SignIn from './Components/SignIn/SignIn.js';
import Register from './Components/Register/Register.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import Logo from './Components/Logo/Logo.js';
import Rank from './Components/Rank/Rank.js';
import ImageInput from './Components/ImageInput/ImageInput.js';
import Particles from 'react-particles-js';




const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 1000
      }
    },
    particles: {
      color: {
        value: "#000000",
      }
    }
  }
}

const initialState = {
    input:'',
    imageUrl:'',
    box:{},
    route: 'signin',
    isSignedIn:false,
    user:{
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: '' 
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser =(data)=>{
    this.setState({user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace = data['outputs'][0].data.regions[0].region_info.bounding_box
    // console.log(clarifaiFace);
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: height - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
    // console.log(box)
    this.setState({box:box});
  }

  onInputChange = (e)=>{
    this.setState({input:e.target.value});
  }

  onPictureSubmit = ()=>{
    this.setState({imageUrl:this.state.input})
    fetch('https://immense-dusk-88242.herokuapp.com/imageurl',{
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response)
      if(response){
        fetch('https://immense-dusk-88242.herokuapp.com/image',{
          method: 'put',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count=>{
          this.setState(Object.assign(this.state.user, {entries:count}))
        }).catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
  }

  onRouteChange = (route)=>{
    if(route==='signout'){ 
      this.setState(initialState);
    }
    else if(route==='home') this.setState({isSignedIn:true})
    this.setState({route:route})
  }

  render(){
    const { isSignedIn,imageUrl,route,box } = this.state;
    return (
      <div className="App">
       <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home'
          ? <div>
              <Logo/>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageInput onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
            route ==='signin' 
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            ) 
        }
      </div>
    );
  }
}

export default App;
