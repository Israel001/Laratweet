import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Home from './home/Home';
import Notifications from './notifications/Notifications';
import Users from './users/Users';
import './App.css';

if (document.getElementById('home')) {
    ReactDOM.render(<Home />, document.getElementById('home'));
}

if (document.getElementById('notifications')) {
    ReactDOM.render(<Notifications />, document.getElementById('notifications'));
}

if (document.getElementById('users')) {
    ReactDOM.render(<Users />, document.getElementById('users'));
}
