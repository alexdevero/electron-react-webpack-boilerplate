import '../assets/css/App.css'
import React, { Component } from 'react';
import { Layout, Radio, Button, Popconfirm } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  };
  
  onChangeStatus = (e) => {
  };

  render() {
    return (
      <Layout className='layout'>
        <Content className='content'>
        <h1>Hello, Electron!</h1>

        <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
        </Content>
        <Footer className='footer'>
        <p>
          We are using node {process.versions.node}, 
          Chrome {process.versions.chrome}, 
          and Electron {process.versions.electron}.   
        </p></Footer>
      </Layout>
    )
  }
}

export default App
