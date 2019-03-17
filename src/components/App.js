import '../assets/css/App.css'
import React, { Component } from 'react'

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, Electron!</h1>

        <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
        
        <p>
          We are using node {process.versions.node}, 
          Chrome {process.versions.chrome}, 
          and Electron {process.versions.electron}.   
        </p>
      </div>
    )
  }
}

export default App
