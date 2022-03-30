import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import logo from '../logo.svg';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";



class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isAuthenticated: false, address: '' };
    }

    componentDidMount(){
        this.login()
    }

    async login(){
        // Check if MetaMask is installed on user's browser
       if (!window.ethereum) {
            alert("Get MetaMask!");
            return;
        }

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if(accounts > 0){
            this.setState({isAuthenticated: true, address: accounts[0]})
        }
    }

    render() {
        let content;
        if(this.state.isAuthenticated){
            content = (
                <Button variant="contained"
                sx={{bgcolor: 'rgba(255, 255, 255, 0.5)', fontWeight: 400, letterSpacing:1.25, '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.5);',
                }}}>
            {this.state.address.substring(0, 6)}...{this.state.address.substring(this.state.address.length - 6)}
            </Button>
            )
            
        }else{
            content = (
            <Button variant="contained" 
                sx={{bgcolor: '#EE811A', fontWeight: 400, letterSpacing:1.25, '&:hover': {
                backgroundColor: '#EE811A',
                }}} onClick={() => this.login()}>
            login with metamask
            </Button>
            )
        }

        return(
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" elevation={0}
                sx={{bgcolor:'transparent', px: 10, py:2}}>
                <Toolbar>          
                    <Link to="/">
                        <img src={logo} alt="logo"></img>
                    </Link>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    </Typography>
                    <Link to="/create">
                        <Button variant="contained" 
                            sx={{mr:3, bgcolor: '#816FEF', fontWeight: 400, letterSpacing:1.25, '&:hover': {
                            backgroundColor: '#816FEF'}}}>
                            start a project
                        </Button>
                    </Link>
                   
                    {content}
                </Toolbar>
                </AppBar>
            </Box>

        )

    }
 
}

export default NavBar;
