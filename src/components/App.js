import '../assets/css/App.css'
import React, { Component, Fragment } from 'react';

//material
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

//antd
import { Layout, Radio, Button, Popconfirm } from 'antd';
const { Header, Content, Footer } = Layout;

const antdLayout = 
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
</Layout>;
 
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  };
  
  onChangeStatus = (e) => {
    this.setState({
      ...this.state
    })
  };

  render() {
    return (
      <Fragment>
        <AppBar position="absolute">
          <Toolbar >
          <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={() => {}}
              >
                <MenuIcon />
              </IconButton>
          </Toolbar>
        </AppBar>
        <main>
          <h1>Hello, Electron!</h1>

          <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
        </main>

        <Footer className='footer'>
          <p>
            We are using node {process.versions.node}, 
            Chrome {process.versions.chrome}, 
            and Electron {process.versions.electron}.   
          </p></Footer>
      </Fragment>
    )
  }
}

export default App
