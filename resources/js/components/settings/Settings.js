import React, { Component } from 'react';
import axios from 'axios';

class Settings extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: {},
            profilePhoto: []
        }
    }

    getUser() {
        axios.get('/settings/getInfo').then(
            response => {
                this.setState({
                    user: response.data.user
                })
            }
        )
    }

    componentWillMount() { this.getUser(); }

    handleProfilePhotoSubmit(e) {
        if (e.target.files) {
            let reader = new FileReader();
            reader.onload = function(ev) {
                this.setState (
                    {
                        profilePhoto: ev.target.result
                    }, function () {
                        const formData = new FormData();
                        formData.append('file', this.state.profilePhoto);
                        axios.post('/add_profile_photo', formData, {
                            onUploadProgress: progressEvent => {
                                console.log(progressEvent.loaded / progressEvent.total)
                            }
                        }).then(response => {
                            console.log('from handle profile photo submit', response);
                            this.setState({ user: response.data.user });
                        });
                    }
                )
            }.bind(this);
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    userDetailTag() {
        return <React.Fragment>
            {
                <div className="user-detail">
                    <div className="cover-photo">
                        {
                            this.state.user.cover_photo == null ? '' :
                                <img className='cover-image' src={`${this.state.user.cover_photo}`} alt="Cover photo"/>
                        }
                    </div>
                    <div className="profile-photo">
                        <div className={this.state.user.profile_picture == null ? 'choose-photo center' : 'choose-photo'}>
                            { this.state.user.profile_picture == null ? <input id="profile-photo"
                                type="file"
                                name=""
                                accept="image/gif,image/jpeg,image/jpg,image/png"
                                title="Add a profile photo"
                                className="upload-photo"
                                onChange={this.handleProfilePhotoSubmit.bind(this)}
                            /> : <img className="profile-image" src={`${this.state.user.profile_picture}`} alt="Profile photo" /> }
                            <label htmlFor="profile-photo" className={this.state.user.profile_picture == null ? '' : 'hidden'}>
                                <figure>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="27"
                                         viewBox="0 0 20 17" className="upload-icon">
                                        <path
                                            d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/>
                                    </svg>
                                </figure>
                                <span className="tooltiptext">Add a profile photo</span>
                            </label>
                        </div>
                        <div className="user-name">
                            <a>
                                <strong>{ this.state.user.name ? this.state.user.name.substring(0, this.state.user.name.search(" ")) : '' }</strong> <br /> @{this.state.user.username}
                            </a>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    }

    changeMenu(cat) {
        switch(cat) {
            case 'account':
                if (document.getElementsByClassName('account')[0]) {
                    document.getElementsByClassName('account')[0].classList.remove('hidden');
                    document.getElementsByClassName('privacy')[0].classList.add('hidden');
                    document.getElementsByClassName('password')[0].classList.add('hidden');
                    document.getElementsByClassName('notifications')[0].classList.add('hidden');
                    document.getElementsByClassName('blocked-account')[0].classList.add('hidden');
                    document.getElementsByClassName('activity')[0].classList.add('hidden');
                    document.getElementsByClassName('data')[0].classList.add('hidden');
                    document.getElementsByClassName('active')[0].classList.remove('active');
                    document.getElementById('account').classList.add('active');
                }
            break;
            case 'privacy':
                if (document.getElementsByClassName('privacy')[0]) {
                    document.getElementsByClassName('account')[0].classList.add('hidden');
                    document.getElementsByClassName('privacy')[0].classList.remove('hidden');
                    document.getElementsByClassName('password')[0].classList.add('hidden');
                    document.getElementsByClassName('notifications')[0].classList.add('hidden');
                    document.getElementsByClassName('blocked-account')[0].classList.add('hidden');
                    document.getElementsByClassName('activity')[0].classList.add('hidden');
                    document.getElementsByClassName('data')[0].classList.add('hidden');
                    document.getElementsByClassName('active')[0].classList.remove('active');
                    document.getElementById('privacy').classList.add('active');
                }
            break;
            case 'password':
                if (document.getElementsByClassName('password')[0]) {
                    document.getElementsByClassName('account')[0].classList.add('hidden');
                    document.getElementsByClassName('privacy')[0].classList.add('hidden');
                    document.getElementsByClassName('password')[0].classList.remove('hidden');
                    document.getElementsByClassName('notifications')[0].classList.add('hidden');
                    document.getElementsByClassName('blocked-account')[0].classList.add('hidden');
                    document.getElementsByClassName('activity')[0].classList.add('hidden');
                    document.getElementsByClassName('data')[0].classList.add('hidden');
                    document.getElementsByClassName('active')[0].classList.remove('active');
                    document.getElementById('password').classList.add('active');
                }
            break;
            case 'notifications':
                if (document.getElementsByClassName('notifications')[0]) {
                    document.getElementsByClassName('account')[0].classList.add('hidden');
                    document.getElementsByClassName('privacy')[0].classList.add('hidden');
                    document.getElementsByClassName('password')[0].classList.add('hidden');
                    document.getElementsByClassName('notifications')[0].classList.remove('hidden');
                    document.getElementsByClassName('blocked-account')[0].classList.add('hidden');
                    document.getElementsByClassName('activity')[0].classList.add('hidden');
                    document.getElementsByClassName('data')[0].classList.add('hidden');
                    document.getElementsByClassName('active')[0].classList.remove('active');
                    document.getElementById('notifications').classList.add('active');
                }
            break;
            case 'blocked-account':
                if (document.getElementsByClassName('blocked-account')[0]) {
                    document.getElementsByClassName('account')[0].classList.add('hidden');
                    document.getElementsByClassName('privacy')[0].classList.add('hidden');
                    document.getElementsByClassName('password')[0].classList.add('hidden');
                    document.getElementsByClassName('notifications')[0].classList.add('hidden');
                    document.getElementsByClassName('blocked-account')[0].classList.remove('hidden');
                    document.getElementsByClassName('activity')[0].classList.add('hidden');
                    document.getElementsByClassName('data')[0].classList.add('hidden');
                    document.getElementsByClassName('active')[0].classList.remove('active');
                    document.getElementById('blocked-account').classList.add('active');
                }
            break;
            case 'activity':
                if (document.getElementsByClassName('activity')[0]) {
                    document.getElementsByClassName('account')[0].classList.add('hidden');
                    document.getElementsByClassName('privacy')[0].classList.add('hidden');
                    document.getElementsByClassName('password')[0].classList.add('hidden');
                    document.getElementsByClassName('notifications')[0].classList.add('hidden');
                    document.getElementsByClassName('blocked-account')[0].classList.add('hidden');
                    document.getElementsByClassName('activity')[0].classList.remove('hidden');
                    document.getElementsByClassName('data')[0].classList.add('hidden');
                    document.getElementsByClassName('active')[0].classList.remove('active');
                    document.getElementById('activity').classList.add('active');
                }
            break;
            case 'data':
                if (document.getElementsByClassName('data')[0]) {
                    document.getElementsByClassName('account')[0].classList.add('hidden');
                    document.getElementsByClassName('privacy')[0].classList.add('hidden');
                    document.getElementsByClassName('password')[0].classList.add('hidden');
                    document.getElementsByClassName('notifications')[0].classList.add('hidden');
                    document.getElementsByClassName('blocked-account')[0].classList.add('hidden');
                    document.getElementsByClassName('activity')[0].classList.add('hidden');
                    document.getElementsByClassName('data')[0].classList.remove('hidden');
                    document.getElementsByClassName('active')[0].classList.remove('active');
                    document.getElementById('data').classList.add('active');
                }
            break;
        }
    }

    mainLoadingTag() {
        if (this.state.loading === true){
            return <React.Fragment>
                {
                    <div id="main">
                        <span className="spinner"></span>
                    </div>
                }
            </React.Fragment>
        }
    }

    setting() {
        const userDetail = this.userDetailTag();
        return <React.Fragment>
            <div className="row">
                <div className="col-md-3">
                    {userDetail}

                    <div className="settings">
                        <ul className="settings__list">
                            <li className="active" id="account" onClick={this.changeMenu.bind(this, 'account')}>
                                <span>Account</span>
                                <ion-icon name="arrow-dropright" class="arrow"></ion-icon>
                            </li>
                            <li id="privacy" onClick={this.changeMenu.bind(this, 'privacy')}>
                                <span>Privacy and safety</span>
                                <ion-icon name="arrow-dropright" class="arrow"></ion-icon>
                            </li>
                            <li id="password" onClick={this.changeMenu.bind(this, 'password')}>
                                <span>Password</span>
                                <ion-icon name="arrow-dropright" class="arrow"></ion-icon>
                            </li>
                            <li id="notifications" onClick={this.changeMenu.bind(this, 'notifications')}>
                                <span>Notifications</span>
                                <ion-icon name="arrow-dropright" class="arrow"></ion-icon>
                            </li>
                            <li id="blocked-account" onClick={this.changeMenu.bind(this, 'blocked-account')}>
                                <span>Blocked accounts</span>
                                <ion-icon name="arrow-dropright" class="arrow"></ion-icon>
                            </li>
                            <li id="activity" onClick={this.changeMenu.bind(this, 'activity')}>
                                <span>Activity Log</span>
                                <ion-icon name="arrow-dropright" class="arrow"></ion-icon>
                            </li>
                            <li id="data" onClick={this.changeMenu.bind(this, 'data')}>
                                <span>Your Laratweet data</span>
                                <ion-icon name="arrow-dropright" class="arrow"></ion-icon>
                            </li>
                        </ul>
                    </div>

                    <div className="page-footer">
                        <div className="footer__links">
                            <a>&copy; <span id="date"></span> Laratweet</a>
                            <a>About</a>
                            <a>Help Center</a>
                            <a>Terms</a>
                            <a>Privacy policy</a>
                            <a>Cookies</a>
                            <a>Ads info</a>
                            <a>Brand</a>
                            <a>Blog</a>
                            <a>Status</a>
                            <a>Apps</a>
                            <a>Jobs</a>
                            <a>Marketing</a>
                            <a>Businesses</a>
                            <a>Developers</a>
                        </div>
                        <hr/>
                        <div>
                            <a href="">Advertise with Laratweet</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="settings_divs account">
                        <h3><strong>Account</strong></h3>
                        <hr />
                        <form className="form" autoComplete="off">
                            <div className="form__group">
                                <label htmlFor="username">Username</label>
                                <div>
                                    <input type="text" name="username" className="form__control" /><br />
                                    <span>{`${window.location.hostname}/users/${this.state.user.username}`}</span>
                                </div>
                            </div>
                            <div className="form__group">
                                <label htmlFor="email">Email</label>
                                <div>
                                    <input type="email" name="email" className="form__control" /><br />
                                    <span>Email will not be publicly displayed.</span>
                                </div>
                            </div>
                            <div className="form__group">
                                <label htmlFor="language">Language</label>
                                <div>
                                    <input type="text" name="language" className="form__control" value="English" disabled /><br />
                                    <span>Language cannot be changed.</span>
                                </div>
                            </div>
                            <div className="form__group">
                                <label htmlFor="time-zone">Time zone</label>
                                <div>
                                    <input type="text" name="time-zone" className="form__control" value="Time zone" disabled /><br />
                                    <span>Timezone cannot be changed.</span>
                                </div>
                            </div>
                            <div className="form__group">
                                <button className="tweet">Save changes</button>
                            </div>
                        </form>
                    </div>

                    <div className="settings_divs privacy hidden">
                        <h3><strong>Privacy</strong></h3>
                        <hr />
                        <form className="form checksForm" autoComplete="off">
                            <div className="form__group">
                                <label htmlFor="tweet-privacy">Tweet privacy</label>
                                <div className="form__options">
                                    <div className="form__options--container">
                                        <div>
                                            <input type="radio" name="tweet-privacy" defaultChecked />
                                            <span>Allow only followers to see your tweets</span>
                                        </div>
                                        <span className="note">This is the default status for all tweets.</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="radio" name="tweet-privacy" />
                                            <span>Do not allow anyone to see your tweets</span>
                                        </div>
                                        <span className="note">If selected, only you will see your Tweets. Your future Tweets will not be available publicly. Tweets posted previously will still be publicly visible.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form__group">
                                <label htmlFor="friends-privacy">Friends</label>
                                <div className="form__options">
                                    <div className="form__options--container">
                                        <div>
                                            <input type="radio" name="friends-privacy" defaultChecked />
                                            <span>Allow anyone to follow you</span>
                                        </div>
                                        <span className="note">This is the default friend status for all users.</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="radio" name="friends-privacy" />
                                            <span>Accept request before following</span>
                                        </div>
                                        <span className="note">If selected, you have to review and accept people's follow request before they can follow you.</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="radio" name="friends-privacy" />
                                            <span>Do not allow anyone to follow you</span>
                                        </div>
                                        <span className="note">If selected, nobody can follow you. Your current followers will still remain.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form__group">
                                <label htmlFor="messages">Messages</label>
                                <div className="form__options">
                                    <div className="form__options--container">
                                        <div>
                                            <input type="radio" name="messages" defaultChecked />
                                            <span>Allow anyone to message you</span>
                                        </div>
                                        <span className="note">This is the default message status for all users.</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="radio" name="messages" />
                                            <span>Only allow people you follow to message you</span>
                                        </div>
                                        <span className="note">If selected, people you follow can message you.</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="radio" name="messages" />
                                            <span>Allow people you follow and people that follow you to message you</span>
                                        </div>
                                        <span className="note">If selected, only your followers and people you follow can message you.</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="radio" name="messages" />
                                            <span>Do not allow anyone to message you</span>
                                        </div>
                                        <span className="note">If selected, nobody can message you. Your chat history will still remain.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form__group">
                                <button className="tweet">Save changes</button>
                            </div>
                        </form>
                    </div>

                    <div className="settings_divs password hidden">
                        <h3><strong>Password</strong></h3>
                        <hr />
                        <form className="form" autoComplete="off">
                            <div className="form__group">
                                <label htmlFor="curPassword">Current password</label>
                                <div>
                                    <input type="password" className="form__control" /><br />
                                    <span><a href="password/reset">Forgot your password?</a></span>
                                </div>
                            </div>

                            <div className="form__group">
                                <label htmlFor="newPassword">New password</label>
                                <div>
                                    <input type="password" className="form__control" /><br />
                                    <span>Enter your password</span>
                                </div>
                            </div>

                            <div className="form__group">
                                <label htmlFor="verPassword">Verify password</label>
                                <div>
                                    <input type="password" className="form__control" /><br />
                                    <span>Re-enter your password</span>
                                </div>
                            </div>

                            <div className="form__group">
                                <button className="tweet">Save changes</button>
                            </div>
                        </form>
                    </div>

                    <div className="settings_divs notifications hidden">
                        <h3><strong>Notifications</strong></h3>
                        <hr />
                        <form className="form checksForm" autoComplete="off">
                            <div className="form__group">
                                <label htmlFor="web-notifications">Web notifications</label>
                                <div className="form__options">
                                <div className="form__options--container">
                                        <div>
                                            <input type="checkbox" defaultChecked disabled />
                                            <span>Allow notifications from people you follow</span>
                                        </div>
                                        <span className="note">This is a default notification status. It cannot be changed.</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="checkbox" defaultChecked />
                                            <span>Allow notifications from everyone</span>
                                        </div>
                                        <span className="note">You will be notified of all notifications related to you (regardless of the action or person).</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="checkbox" />
                                            <span>Mute notifications from people you don't follow</span>
                                        </div>
                                        <span className="note">If selected, you will not be notified of any action performed by people you don't follow (even if the action is related to you)</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="checkbox" />
                                            <span>Mute notifications from people who don't follow you</span>
                                        </div>
                                        <span className="note">If selected, you will not be notified of any action performed by people who don't follow you (even if the action is related to you)</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="checkbox" />
                                            <span>Mute notifications from people who have a default profile photo</span>
                                        </div>
                                        <span className="note">If selected, you will not be notified of any action performed by people who does not have a profile photo (even if the action is related to you)</span>
                                    </div>
                                    <div className="form__options--container">
                                        <div>
                                            <input type="checkbox" />
                                            <span>Mute notifications from people who haven't confirmed their email</span>
                                        </div>
                                        <span className="note">If selected, you will not be notified of any action performed by people whose email is not verified (even if the action is related to you)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form__group">
                                <label htmlFor="desk-notifications">Desktop notifications</label>
                                <div className="form__options">
                                <div className="form__options--container">
                                        <div>
                                            <input type="checkbox" defaultChecked disabled />
                                            <span>Allow desktop notifications</span>
                                        </div>
                                        <span className="note">This is a default notification status. It cannot be changed.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form__group">
                                <button className="tweet">Save changes</button>
                            </div>
                        </form>
                    </div>

                    <div className="settings_divs blocked-account hidden">
                        <h3><strong>Accounts you're blocking</strong></h3>
                        <div id="note">
                            <span className="note">
                                You've blocked these accounts.
                                You will not see their Tweets in your timeline.
                                Additionally, blocked accounts cannot follow you or view your profile while logged in to Laratweet.
                            </span>
                        </div>
                        <hr />
                        <div className="centered">You aren't blocking any accounts.</div>
                    </div>

                    <div className="settings_divs activity hidden">
                        <h3><strong>Your activities</strong></h3>
                        <div id="note">
                            <span className="note">
                                All activities carried out by you will be shown here.
                            </span>
                        </div>
                        <hr />
                        <div className="centered">You have no activites logged yet. Start by liking a tweet :)</div>
                    </div>

                    <div className="settings_divs data hidden">
                        <h3><strong>Your Laratweet data</strong></h3>
                        <hr />
                        <div className="data__content">
                            <h4>Confirm password</h4>
                            <span className="note">This page contains personal information. Confirm your password to continue.</span><br />
                            <input type="password" placeholder="Password" /><br />
                            <span className="note"><a href="/password/reset">Forgot your password?</a></span>
                        </div>
                        <hr />
                        <button className="tweet">Confirm</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }

    render() {
        const mainLoading = this.mainLoadingTag();
        const setting = this.setting();

        return (
            <div className="container" style={{marginTop: 35}}>
                { this.state.loading ? mainLoading : setting }
            </div>
        )
    }
}

export default Settings;
