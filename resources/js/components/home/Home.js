import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: {},
            following: 0,
            followers: 0,
            imageArray: [],
            videoArray: [],
            body: '',
            video: [],
            posts: [],
            retweets: [],
            loading: false,
            profilePhoto: [],
            who_to_follow: [],
            trends: [],
            slide_class: 'mySlides',
            slideIndex: 1,
            modal_id: 'myModal',
            onlineUsers: [],
            token: ''
        };
    }

    getPosts() {
        this.setState({ loading: true });
        axios.get('/posts').then(
            (response) => {
                this.setState({
                    user: response.data.user,
                    following: response.data.following,
                    followers: response.data.followers,
                    who_to_follow: response.data.who_to_follow,
                    trends: response.data.trends,
                    posts: [...response.data.posts],
                    retweets: response.data.retweets,
                    loading: false
                });
            }
        );
    }

    componentWillMount() { this.getPosts(); }

    componentDidMount() {
        this.state.token = $('meta[name="csrf-token"]').attr('content');

        Echo.private('new-post').listen('PostCreated', (e) => {
            this.setState({ posts: [e.post, ...this.state.posts] });
        });

        Echo.private('new-chat')
                .listen('BroadcastChat', e => {
                    console.log('from broadcasting', e.chat);
                    $('.chatting-body-parent').append(
                        `<div class="receiver">
                            <img src=${ $('.chat--heading-img').attr('src') } alt="User Image">
                            <div class="receiver-msg">
                                <div><span>${e.chat.chat}</span></div>
                            </div>
                        </div>`
                    );
                });

        Echo.join('Online')
                .here((users) => {
                    console.log('from old online', users); // old online
                    this.setState({ onlineUsers: users });
                })
                .joining((user) => {
                    console.log('from new online', user); // new online
                    this.setState({ onlineUsers: [user, ...this.state.onlineUsers] });
                })
                .leaving((user) => {
                    console.log('offline'); // offline
                    this.setState({ onlineUsers: this.state.onlineUsers.filter((u) => {u != user}) })
                })
        // this.interval = setInterval(()=>this.getPosts(), 10000);
    }

    //componentWillUnmount() { //clearInterval(this.interval); }

    openModal(post, length) {
        if (document.getElementById('myModal-'+post)) {
            document.getElementById('myModal-'+post).style.display = 'block';
            this.currentSlide(1, length);
        }
    }

    closeModal(post) {
        if (document.getElementById(this.state.modal_id+'-'+post))
            document.getElementById(this.state.modal_id+'-'+post).style.display = 'none';
    }

    prevSlides(post) { this.showSlides(this.state.slideIndex - 1, post); }
    nextSlides(post) { this.showSlides(this.state.slideIndex + 1, post); }
    currentSlide(n, post) { this.showSlides(n, post); }

    showSlides(n, post) {
        let i;
        this.state.slideIndex = n;
        let slides = document.getElementsByClassName(this.state.slide_class);
        let dots = document.getElementsByClassName('my-demo');
        let captionText = document.getElementsByClassName('my-caption');
        if (n > post) this.state.slideIndex = 1;
        if (n < 1) this.state.slideIndex = post;
        let slideIndex = this.state.slideIndex;
        for (i = 0; i < post; i++) {
            slides[i].style.display = 'none';
        }
        for (i = 0; i < post; i++) {
            dots[i].className = dots[i].className.replace(' active', '');
        }
        if (slides[slideIndex - 1]) {
            slides[slideIndex - 1].style.display = 'block';
            dots[slideIndex - 1].className += ' active';
            captionText.innerHTML = dots[slideIndex - 1].alt;
        }
    }

    scrollToTop(scrollDuration) {
        let cosParameter = window.scrollY / 2,
            scrollCount = 0,
            oldTimestamp = performance.now();
        function step(newTimestamp) {
            scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
            if (scrollCount >= Math.PI) window.scrollTo(0, 0);
            if (window.scrollY === 0) return;
            window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
            oldTimestamp = newTimestamp;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }

    noTweetTag() {
        if (this.state.loading ===  false && (this.state.posts === undefined || this.state.posts.length === 0)) {
            return <React.Fragment>
                {
                    <div className="no_tweet">
                        <h1>What? No Tweets yet?</h1>
                        <p>This empty timeline won't be around for long. Start following people and you'll see Tweets show up here.</p>
                        <button className="tweet">Find people to follow</button>
                    </div>
                }
            </React.Fragment>
        }
    }

    loadingTag() {
        if (this.state.loading === true) {
            return <React.Fragment>
                {
                    <div className="loading">
                        <img src='/images/index.flat-ajax-syncing-loading-icon.gif' alt=""/>
                    </div>
                }
            </React.Fragment>
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
                        <div className="user-info">
                            <span>
                                <strong>Tweets</strong><br />
                                <a href={`/users/${this.state.user.username}`}>
                                    <label>
                                        {this.formatNumber('tweets').length > 3 ? this.formatNumber('tweets').substr(0, this.formatNumber('tweets').search(','))+'K' : this.formatNumber('tweets')}
                                        <span className="tooltiptext">{this.formatNumber('tweets')} Tweets</span>
                                    </label>
                                </a>
                            </span>
                            <span>
                                <strong>Following</strong><br />
                                <a href={`/users/${this.state.user.username}/following`}>
                                    <label>
                                        {this.formatNumber('following').length > 3 ? this.formatNumber('following').substr(0, this.formatNumber('following').search(','))+'K' : this.formatNumber('following')}
                                        <span className="tooltiptext">{this.formatNumber('following')} Following</span>
                                    </label>
                                </a>
                            </span>
                            <span>
                                <strong>Followers</strong><br />
                                <a href={`/users/${this.state.user.username}/followers`}>
                                    <label>
                                        {this.formatNumber('followers').length > 3 ? this.formatNumber('followers').substr(0, this.formatNumber('followers').search(','))+'K' : this.formatNumber('followers')}
                                        <span className="tooltiptext">{this.formatNumber('followers')} Followers</span>
                                    </label>
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    }

    whoToFollowTag() {
        if (this.state.who_to_follow.length !== 0) {
            return <React.Fragment>
                {
                    this.state.who_to_follow.map(
                        user => <div className="body" key={user.id}>
                            <img
                                src={user.profile_picture == null ? '/images/avatar-default.png' : `${user.profile_picture}`}
                                alt="Profile Image"/>
                            <div>
                                <span><b>{user.name}</b></span><br/>
                                <a onClick={this.handleFollow.bind(this, user.username)} className="tweet transparent">Follow</a>
                            </div>
                        </div>
                    )
                }
            </React.Fragment>
        } else {
            return <React.Fragment>
                {
                    <div className="heading">
                        <div className="alert alert-danger">
                            <strong>
                                Sorry, we could not suggest who to follow for you based on insufficient data.
                                You can click the link below to find people you know manually.
                            </strong>
                        </div>
                    </div>
                }
            </React.Fragment>
        }
    }

    trendsTag() {
        return <React.Fragment>
            {
                this.state.trends.map(
                    trend => <div key={trend.id}>
                        <a href={`/users/${trend.username}`}><strong>{trend.name}</strong></a><br />
                        <span>{trend.tweets} Tweet(s)</span>
                    </div>
                )
            }
        </React.Fragment>
    }

    buildRetweetTag() {
        return <React.Fragment>
            {this.state.retweets.map(
                retweet => <div className="tweets" key={retweet.id}>
                    <div className="tweets--img">
                        <img src={retweet.owner_profile_picture == '' ? '/images/avatar-default.png' : `${retweet.owner_profile_picture}`} alt="User Image" className={retweet.owner_profile_picture == '' ? '' : 'image'}/>
                    </div>
                    <div className="tweets--content">
                        <div className="tweets--heading">
                            <a href={`/users/${retweet.owner_username}`}><strong>{retweet.owner_name}</strong></a>
                            <span className="tweets--username">@{retweet.owner_username}</span>
                            <span className="dot">.</span>
                            <span className="tweets--time"><b>{retweet.retweet_time}</b></span>
                            <span className="retweet_status">Retweeted</span>
                        </div>
                        <div className="retweet__body">
                            <div className="tweets">
                                <div className="tweets--img">
                                    <img src={retweet.profile_picture == null ? '/images/avatar-default.png' : `${retweet.profile_picture}`} alt="User Image" className={retweet.profile_picture == '' ? '' : 'image'} />
                                </div>
                                <div className="tweets--content">
                                    <div className="tweets--heading">
                                        <a href={`/users/${retweet.username}`}><strong>{retweet.name}</strong></a>
                                        <span className="tweets--username">@{retweet.username}</span>
                                        <span className="dot">.</span>
                                        <span className="tweets--time"><b>{retweet.post_time}</b></span>
                                    </div>
                                    <p> {retweet.body} </p>
                                    <div>
                                        { JSON.parse(retweet.image) == null ? '' :
                                            <div className='retweet__img'>
                                                <img src={`${JSON.parse(retweet.image)[0]}`} alt="Retweet image" className="retweet-image" onClick={this.openModal.bind(this, retweet.id, JSON.parse(retweet.image).length)} />
                                                {
                                                    JSON.parse(retweet.image).length > 1 ?
                                                        <div className='img-transparent-box' onClick={this.openModal.bind(this, retweet.id, JSON.parse(retweet.image).length)}>
                                                            <span>{`+${JSON.parse(retweet.image).length - 1}`}</span>
                                                        </div> : ''
                                                }
                                                <div id={this.state.modal_id+'-'+retweet.id} className="my-modal">
                                                    <span className="my-close my-cursor" onClick={this.closeModal.bind(this, retweet.id)}>&times;</span>
                                                    <div className="my-modal-content">
                                                        {
                                                            JSON.parse(retweet.image) == null ? '' : JSON.parse(retweet.image).map(
                                                                (img, index) => <div className={this.state.slide_class} key={index}>
                                                                    <div className="my-numbertext">{index + 1} / {JSON.parse(retweet.image).length}</div>
                                                                    <img src={`${JSON.parse(retweet.image)[index]}`} alt="Post image" style={{width: '100%'}}/>
                                                                </div>
                                                            )
                                                        }
                                                        <a onClick={this.prevSlides.bind(this, JSON.parse(retweet.image).length)} className="my-prev">&#10094;</a>
                                                        <a onClick={this.nextSlides.bind(this, JSON.parse(retweet.image).length)} className="my-next">&#10095;</a>
                                                        <div className="my-caption-container">
                                                            <p id="my-caption"></p>
                                                        </div>
                                                        {
                                                            JSON.parse(retweet.image) == null ? '' : JSON.parse(retweet.image).map(
                                                                (img, index) => <div className="my-column" key={index}>
                                                                    <img onClick={this.currentSlide.bind(this, index + 1, JSON.parse(retweet.image).length)} src={`${JSON.parse(retweet.image)[index]}`} alt="Retweet image" className="my-demo my-cursor" style={{width: '100%'}}/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tweets--footer">
                            <div>
                                <a onClick={this.handleRetweetLike.bind(this, retweet.retweet_id)}>
                                    { retweet.liked === true ? <img src="https://img.icons8.com/color/24/000000/hearts.png" className="ion-icon heart" /> : <img src="https://img.icons8.com/ios/24/000000/hearts.png" className="ion-icon heart" /> }
                                    { retweet.liked === true ? <span className="tooltiptext">Unlike</span> : <span className="tooltiptext">Like</span> }
                                </a>
                                <span>{retweet.retweet_likes}</span>
                            </div>
                            <div>
                                <a onClick={this.handleRetweet.bind(this, retweet.retweet_id)}>
                                    { this.state.user.id === retweet.owner ? '' : <ion-icon class="ion-icon retweet" name="repeat"></ion-icon> }
                                    <span className="tooltiptext">Retweet</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    }

    buildTweetTag() {
        return <React.Fragment>
            {this.state.posts.map(
                post => <div className="tweets" key={post.id}>
                    <div className="tweets--img">
                        <img src={post.user.profile_picture == null ? '/images/avatar-default.png' : `${post.user.profile_picture}`} alt="User Image" className={post.user.profile_picture == '' ? '' : 'image'}/>
                    </div>
                    <div className="tweets--content">
                        <div className="tweets--heading">
                            <a href={`/users/${post.user.username}`}><strong>{post.user.name}</strong></a>
                            <span className="tweets--username">@{post.user.username}</span>
                            <span className="dot">.</span>
                            <span className="tweets--time"><b>{post.time}</b></span>
                        </div>
                        <p> {post.body} </p>
                        <div className="tweets__img">
                            { JSON.parse(post.image) == null ? '' :
                                <div>
                                    <img src={`${JSON.parse(post.image)[0]}`} alt="Post image" onClick={this.openModal.bind(this, post.id, JSON.parse(post.image).length)} />
                                    {
                                        JSON.parse(post.image).length > 1 ?
                                            <div className='img-transparent-box' onClick={this.openModal.bind(this, post.id, JSON.parse(post.image).length)}>
                                                <span>{`+${JSON.parse(post.image).length - 1}`}</span>
                                            </div> : ''
                                    }
                                    <div id={this.state.modal_id+'-'+post.id} className="my-modal">
                                        <span className="my-close my-cursor" onClick={this.closeModal.bind(this, post.id)}>&times;</span>
                                        <div className="my-modal-content">
                                            {
                                                JSON.parse(post.image) == null ? '' : JSON.parse(post.image).map(
                                                    (img, index) => <div className={this.state.slide_class} key={index}>
                                                        <div className="my-numbertext">{index + 1} / {JSON.parse(post.image).length}</div>
                                                        <img src={`${JSON.parse(post.image)[index]}`} alt="Post image" style={{width: '100%'}}/>
                                                    </div>
                                                )
                                            }
                                            <a onClick={this.prevSlides.bind(this, JSON.parse(post.image).length)} className="my-prev">&#10094;</a>
                                            <a onClick={this.nextSlides.bind(this, JSON.parse(post.image).length)} className="my-next">&#10095;</a>
                                            <div className="my-caption-container">
                                                <p id="my-caption"></p>
                                            </div>
                                            {
                                                JSON.parse(post.image) == null ? '' : JSON.parse(post.image).map(
                                                    (img, index) => <div className="my-column" key={index}>
                                                        <img onClick={this.currentSlide.bind(this, index + 1, JSON.parse(post.image).length)} src={`${JSON.parse(post.image)[index]}`} alt="Post image" className="my-demo my-cursor" style={{width: '100%'}}/>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="tweets--footer">
                            <div>
                                <a onClick={this.handleLike.bind(this, post.id)}>
                                    { post.liked === true ? <img src="https://img.icons8.com/color/24/000000/hearts.png" className="ion-icon heart" /> : <img src="https://img.icons8.com/ios/24/000000/hearts.png" className="ion-icon heart" /> }
                                    { post.liked === true ? <span className="tooltiptext">Unlike</span> : <span className="tooltiptext">Like</span> }
                                </a>
                                <span>{post.likes}</span>
                            </div>
                            <div>
                                <a onClick={this.handleRetweet.bind(this, post.id)}>
                                    { this.state.user.id === post.user.id ? '' : <ion-icon class="ion-icon retweet" name="repeat"></ion-icon> }
                                    <span className="tooltiptext">Retweet</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    }

    buildImgTag(){
        return <React.Fragment>
            {
                this.state.imageArray.map(
                    (imageURI, index) => <img key={index} className="photo-uploaded" src={imageURI} alt="Photo uploaded" />
                )
            }
        </React.Fragment>
    }

    buildVideoTag() {
        return <React.Fragment>
            {
                this.state.videoArray.map(
                    (videoURI, index) => <video key={index} controls autoPlay className="video-uploaded">
                        <source src={videoURI} />
                    </video>
                )
            }
        </React.Fragment>
    }

    readURI(e, type){
        if (e.target.files) {
            const files = Array.from(e.target.files);

            const promises = files.map(file => {
                return (new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        resolve(ev.target.result);
                    });
                    reader.addEventListener('error', reject);
                    reader.readAsDataURL(file);
                }))
            });

            if (type == 'image') {
                Promise.all(promises).then(images => {
                    this.setState({
                        imageArray: images
                    })
                }, error => {
                    console.error(error);
                });
            } else if (type == 'video') {
                Promise.all(promises).then(videos => {
                    this.setState({
                        videoArray: videos
                    });
                }, error => {
                    console.error(error);
                });
            }
        }
    }

    formatNumber(type) {
        let num, numSplit, int;
        switch(type) {
            case 'tweets': num = this.state.user.tweets; break;
            case 'following': num = this.state.following; break;
            case 'followers': num = this.state.followers; break;
            default: num = 0;
        }
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            let start;
            start = int.length % 3 === 0 ? 3 : int.length % 3;
            while(start < int.length) {
                int = int.substr(0, start) + ',' + int.substr(start);
                start += 4;
            }
        }
        return ' ' + int;
    }

    handleFileChange(e){
        this.readURI(e, 'image');
        if (this.props.onChange !== undefined) {
            this.props.onChange(e);
        }
    }

    handleVideoChange(e) {
        this.readURI(e, 'video');
        if (this.props.onChange !== undefined) {
            this.props.onChange(e);
        }
        this.setState({ video: e.target.value })
    }

    handleBodyChange(e) {
        this.setState({
            body: e.target.value
        })
    }

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

    handleSubmit(e) {
        e.preventDefault();
        let lastId = this.state.posts[this.state.posts.length - 1].id++;
        let file = [];
        let body = this.state.body;
        let token = this.state.token;

        const formData = new FormData();
        this.state.videoArray.forEach((video_file) => {
            formData.append('video[]', video_file);
        });
        this.state.imageArray.forEach((image_file) => {
            this.file.push(image_file);
            formData.append('file[]', image_file);
        });
        formData.append('body', this.state.body);
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready
                .then(sw => {
                    let post = {
                        id: lastId,
                        file: file,
                        text: body,
                        token: token
                    };
                    writeData('sync-posts', post)
                        .then(() => {
                            return sw.sync.register('sync-new-posts')
                        })
                        .then(() => {
                            toastr.options.closeButton = true;
                            toastr.options.showMethod = 'slideDown';
                            toastr.options.hideMethod = 'slideUp';
                            toastr.options.closeMethod = 'slideUp';
                            toastr.options.closeMethod = 'fadeOut';
                            toastr.options.closeDuration = 300;
                            toastr.options.showEasing = 'easeOutBounce';
                            toastr.options.hideEasing = 'easeInBack';
                            toastr.options.closeEasing = 'easeInBack';
                            toastr.options.closeEasing = 'swing';
                            toastr.options.newestOnTop = false;
                            toastr.options.timeOut = 30;
                            toastr.options.extendedTimeOut = 60;
                            toastr.options.progressBar = true;
                            toastr.success('Your post have been saved for syncing', 'Laratweet');
                        })
                        .catch(err => console.log(err));
                })
        } else {
            axios.post('/posts', formData, {
                onUploadProgress: progressEvent => {
                    console.log(progressEvent.loaded / progressEvent.total)
                }
            }).then(response => {
                console.log('from handle submit', response);
                this.setState({
                    posts: [response.data, ...this.state.posts]
                })
            });
        }

        this.setState({
            body: '',
            imageArray: [],
            videoArray: []
        });
    }

    handleLike(post) {
        axios.get(`/likes/${post}`)
            .then(response => {
                console.log('from handle like', response);
                this.setState(prevState => ({
                    posts: prevState.posts.map(el => el.id === post ? response.data.post[0] : el)
                }))
            });
    }

    handleRetweetLike(retweet) {
        axios.get(`/retweet/likes/${retweet}`)
            .then(response => {
                console.log('from handle retweet like', response);
                this.setState(prevState => ({
                    retweets: prevState.retweets.map(el => el.retweet_id === retweet ? response.data.retweet[0] : el)
                }))
            });
    }

    handleFollow(username) {
        axios.get(`/users/${username}/follow`)
            .then(response => {
                console.log('from handle follow', response);
                this.setState({
                    posts: [...response.data.post, ...this.state.posts],
                    who_to_follow: response.data.who_to_follow,
                    following: response.data.following
                });
            });
    }

    handleRetweet(post) {
        axios.get(`/retweet/${post}`)
            .then(response => {
                console.log('from handle retweet', response);
                this.setState({ retweets: [...response.data.retweet, ...this.state.retweets] });
            });
    }

    home() {
        const imgTag = this.buildImgTag();
        const videoTag = this.buildVideoTag();
        const noTweet = this.noTweetTag();
        const tweet = this.buildTweetTag();
        const retweet = this.buildRetweetTag();
        const loading = this.loadingTag();
        const userDetail = this.userDetailTag();
        const whoToFollow = this.whoToFollowTag();
        const trends = this.trendsTag();
        return <React.Fragment>
                <div className="row justify-content-center">
                    <div className="col-md-3">
                        {userDetail}

                        <div className="trends">
                            <h3>Trending users</h3>
                            <div className="trends__list">
                                {trends}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header"
                                 style={
                                     {
                                         backgroundColor: 'rgb(232, 245, 253)',
                                         borderTopLeftRadius: '4px',
                                         borderTopRightRadius: '4px',
                                         display: 'flex',
                                         height: 'fit-content',
                                         overflow: 'hidden'
                                     }
                                 }
                            >
                                <div className="avatar">
                                    <img
                                        src={this.state.user.profile_picture == null ? '/images/avatar-default.png' : `${this.state.user.profile_picture}`}
                                        alt="User Avatar"
                                        className={this.state.user.profile_picture == '' ? 'user-avatar' : 'user-avatar image'}/>
                                </div>
                                <div id="textEditor">
                                    <form method="post" encType="multipart/form-data" onSubmit={this.handleSubmit.bind(this)}>
                                            <textarea
                                                value={this.state.body}
                                                name=""
                                                id="richTextArea"
                                                placeholder="What's happening?"
                                                required
                                                maxLength="500"
                                                onChange={this.handleBodyChange.bind(this)}
                                            />
                                        <div className="photo-container">
                                            {imgTag} {videoTag}
                                        </div>
                                        <div id="theRibbon">
                                            <div className="uploading">
                                                <div>
                                                    <input
                                                        id="upload-photo"
                                                        type="file"
                                                        name=""
                                                        accept="image/gif,image/jpeg,image/jpg,image/png"
                                                        title="Add photos or video"
                                                        onChange={this.handleFileChange.bind(this)}
                                                        multiple
                                                        className="upload-photo"
                                                    />
                                                    <label htmlFor="upload-photo">
                                                        <figure>
                                                            <ion-icon name="images" class="upload-icon"></ion-icon>
                                                        </figure>
                                                        <span className="tooltiptext">Add photos</span>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input
                                                        id="upload-video"
                                                        type="file"
                                                        name="video"
                                                        accept="video/mp4,video/x-m4v"
                                                        title="Add photos or video"
                                                        onChange={this.handleVideoChange.bind(this)}
                                                        multiple
                                                        className="upload-photo"
                                                    />
                                                    <label htmlFor="upload-video">
                                                    <figure>
                                                        <ion-icon name="videocam" class="upload-icon"></ion-icon>
                                                    </figure>
                                                        <span className="tooltiptext">Add videos</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                id="tweet"
                                                className={this.state.body === '' ? 'tweet disabled' : 'tweet'}
                                                disabled={this.state.body === '' ? true : false}
                                            >Tweet
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="card-body" style={{minHeight: '50vh', position: 'relative'}}>
                                {!this.state.loading ? retweet : ''}
                                {!this.state.loading ? tweet : loading}
                                {noTweet}
                            </div>
                            <div className="card-footer">
                                <ion-icon name="arrow-dropup-circle" class="back-to-top" title="Back to Top"
                                          onClick={this.scrollToTop.bind(this, 1000)}></ion-icon>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="who-to-follow">
                            <div className="heading">
                                <h3>Who to follow</h3>
                            </div>
                            <div className="body-parent">
                                {whoToFollow}
                            </div>
                            <hr/>
                            <div className="footer">
                                <a href="">Find people to follow</a>
                            </div>
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
                </div>
        </React.Fragment>
    }

    render() {
        const mainLoading = this.mainLoadingTag();
        const home = this.home();

        return (
            <div className="container" style={{marginTop: 35}}>
                { this.state.loading ? mainLoading : home }
            </div>
        );
    }
}

export default Home;
