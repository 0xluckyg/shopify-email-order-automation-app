import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Router from 'next/router';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAuthorizeModalAction} from '../../redux/actions';

class NavBar extends React.Component {      
    constructor(props) {
        super(props)

        this.state = {            
            isMenuOpen: false,    
            menuAnchor: null,
            tabValue: 0
        }
    }

    handleTabChange(event, tabValue) {        
        switch(tabValue) {
            case 0:
                Router.push('/home#home')
                break;
            case 1:
                Router.push('/home#services')
                break;
            case 2:
                Router.push('/home#features')
                break;
            case 3:
                Router.push('/home#pricing')
                break;
            case 4:
                Router.push('/home#contact')
                break;
            default:
                break;
        }
        this.setState({tabValue});
    }

    handleMenuOpen(event) {        
        this.setState({
            menuAnchor: event.currentTarget,
            isMenuOpen: true
        })
    }

    handleMenuClose() {
        this.setState({
            menuAnchor: null,
            isMenuOpen: false
        })
    }

    renderMenuItem(text, tab) {
        return (
            <MenuItem 
                onClick={() => {
                    this.handleMenuClose()
                    this.handleTabChange(null, tab)
                }}
            >
                {text}
            </MenuItem>
        )
    }

    renderMenu() {
        const {isMenuOpen, menuAnchor} = this.state        
        return (    
            <Menu
                anchorEl={menuAnchor}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={() => this.handleMenuClose()}
            >
                {this.renderMenuItem('Home', 0)}
                {this.renderMenuItem('Services', 1)}
                {this.renderMenuItem('Features', 2)}
                {this.renderMenuItem('Pricing', 3)}
                {this.renderMenuItem('Contact', 4)}                
            </Menu>
        );
    }

    render() {
        const {isMenuOpen, tabValue} = this.state
        const {classes} = this.props
        return (
            <div>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolBar}>
                    <div className={classes.logoWarpper}>
                        <img className={classes.logo} src='../../static/logo.png'/>
                    </div>
                    <Tabs 
                        className={classes.tabs}                        
                        value={tabValue} 
                        onChange={this.handleTabChange.bind(this)}
                    >
                        <Tab className={classes.tab} label="Home" />
                        <Tab className={classes.tab} label="Services" />
                        <Tab className={classes.tab} label="Features" />
                        <Tab className={classes.tab} label="Pricing" />                        
                        <Tab className={classes.tab} label="Contact" />
                    </Tabs>
                    <Button 
                        onClick={() => this.props.showAuthorizeModalAction(true)}                         
                        size="large"                         
                        className={classes.loginButton}
                    >
                        Login
                    </Button>
                    <Button 
                        onClick={() => this.props.showAuthorizeModalAction(true)}                         
                        variant="contained" 
                        size="large" 
                        color="primary" 
                        className={classes.signupButton}
                    >
                        Start For Free!
                    </Button>  
                    <IconButton                                                
                        aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                        aria-label="Open drawer"
                        onClick={event => this.handleMenuOpen(event)}                                   
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>    
            {this.renderMenu()}    
            </div>
        );
    }
}

const useStyles = theme => ({
    appBar: {        
        zIndex: theme.zIndex.drawer + 1,        
        backgroundColor: 'white'
    },    
    toolBar: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    logo: {
        width: '200px',
    },
    logoWrapper: {        
        flexGrow: 1,
        width: '100%',
        margin: theme.spacing(0, 3),
        [theme.breakpoints.up('md')]: {            
            flexGrow: 0,            
            width: '100%',
		}
    },
    menuButton: {
        color: '#000',
        display: 'block',                
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    tabs: {        
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block',
            flexGrow: 1,
            margin: theme.spacing(0, 5),
		}
    },
    tab: {
        flexGrow: 1,
        margin: theme.spacing(0, 1),
        minWidth: 80,
        color: '#000'
    },
    loginButton: {                
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block',
            backgroundColor: 'white',
            margin: theme.spacing(1),
            fontSize: '13px'
		}
    },
    signupButton: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block',
            color: 'white',
            margin: theme.spacing(1),            
            fontSize: '13px'  
		}      
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showAuthorizeModalAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(NavBar));