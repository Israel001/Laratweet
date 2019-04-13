import React, { Component } from 'react';
import axios from 'axios';

class Users extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid" style={{padding: 0}}>
                <div className="user-photo-container">
                    <div className="user-cover-photo">
                    </div>
                    <div className="user-profile-photo">
                        Tweets<br />0
                    </div>
                </div>
            </div>
        );
    }
}

export default Users;
