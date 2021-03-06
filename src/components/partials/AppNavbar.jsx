import React from 'react';
import router from 'router';
import routes from 'config/routes';

import AppBar from 'material-ui/AppBar';
import MainDrawer from 'components/partials/MainDrawer.jsx';
import AuthMenu from 'components/partials/AuthMenu.jsx';
require('styles/partials/AppNavbar.scss');

export default class AppNavbar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: 'Flux',
        };

        this._handleRouteUpdate = this._handleRouteUpdate.bind(this);
    }

    componentDidMount() {
        // Re-render every route change
        router.addListener((route) => {
            this._handleRouteUpdate(route);
        });

        // Init route
        this._handleRouteUpdate(router.getState());
    }

    _handleRouteUpdate(route) {
        for (let routeConf of routes) {
            if(routeConf.name === route.name && routeConf.title) {
                let title = routeConf.title;
                if(typeof routeConf.title === 'function') {
                    title = routeConf.title(route);
                }
                this.setState({title: title});
                return;
            }
        }
        this.setState({title: 'Flux'});
    }


    render() {
        return (
            <AppBar
                title={this.state.title}
                className="AppNavbar"
                onTitleTouchTap={_ => router.navigate('home')}
                iconElementLeft={<MainDrawer />}
                iconElementRight={<AuthMenu />}
            />
        );
    }
}
