import React, { Component } from 'react';
import axios from 'axios';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            following_count: 0,
            followers_count: 0,
            likes_count: 0,
            imageArray: [],
            videoArray: [],
            body: '',
            bio: '',
            location: '',
            website: '',
            dob: '',
            video: [],
            posts: [],
            retweets: [],
            loading: false,
            profilePhoto: [],
            coverPhoto: [],
            who_to_follow: [],
            trends: [],
            following: [],
            followers: [],
            post_likes: [],
            retweet_likes: [],
            profile_visited: {},
            can_follow: false,
            slide_class: 'mySlides',
            slideIndex: 1,
            modal_id: 'myModal',
            verified: false,
            edit_state: false,
            token: ''
        };
        this.buildProfileButton = this.buildProfileButton.bind(this);
        this.buildMainProfile = this.buildMainProfile.bind(this);
        this.buildCoverPhoto = this.buildCoverPhoto.bind(this);
        this.buildProfilePhoto = this.buildProfilePhoto.bind(this);
        this.buildBioTag = this.buildBioTag.bind(this);
        this.buildLocationTag = this.buildLocationTag.bind(this);
        this.buildWebsiteTag = this.buildWebsiteTag.bind(this);
        this.buildBirthdayTag = this.buildBirthdayTag.bind(this);
    }

    getUserInfo() {
        this.setState({ loading: true });
        let user = window.location.href.split('/')[4];
        axios.get(`/user/${user}`).then(
            response => this.setState({
                can_follow: response.data.can_follow,
                profile_visited: response.data.profile_visited,
                following_count: response.data.following_count,
                followers_count: response.data.followers_count,
                likes_count: response.data.likes_count,
                user: response.data.user,
                posts: [...response.data.posts],
                retweets: response.data.retweets,
                who_to_follow: response.data.who_to_follow,
                trends: response.data.trends,
                verified: response.data.verified,
                loading: false
            }, () => {
                if (this.state.verified === false) {
                    alert('This user is not verified');
                    location.replace('/');
                }
            })
        );
    }

    getFollowing() {
        this.setState({ loading: true });
        let user = window.location.href.split('/')[4];
        axios.get(`/user/${user}/following`).then(
            response => this.setState({
                following: response.data.following,
                loading: false
            })
        );
    }

    getFollowers() {
        this.setState({ loading: true });
        let user = window.location.href.split('/')[4];
        axios.get(`/user/${user}/followers`).then(
            response => this.setState({
                followers: response.data.followers,
                loading: false
            })
        );
    }

    getLikes() {
        this.setState({ loading: true });
        let user = window.location.href.split('/')[4];
        axios.get(`/user/${user}/likes`).then(
            response => this.setState({
                post_likes: response.data.post_likes,
                retweet_likes: response.data.retweet_likes,
                loading: false
            })
        );
    }

    componentWillMount() {
        this.getUserInfo();
        this.getFollowing();
        this.getFollowers();
        this.getLikes();
    }

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
    }

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
        if (this.state.user.username === this.state.profile_visited.username && this.state.loading ===  false && (this.state.posts === undefined || this.state.posts.length === 0)) {
            return <React.Fragment>
                {
                    <div className="no_tweet">
                        <h1>What? No Tweets yet?</h1>
                        <p>This empty timeline won't be around for long. Start following people and you'll see Tweets show up here.</p>
                        <button className="tweet">Find people to follow</button>
                    </div>
                }
            </React.Fragment>
        } else if (this.state.loading ===  false && (this.state.posts === undefined || this.state.posts.length === 0)) {
            return <React.Fragment>
                <div className="no_tweet">
                    <h1>This timeline has no tweets currently</h1>
                </div>
            </React.Fragment>
        }
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
                        <a href={`/users/${trend.username}`}><strong>{trend.name}</strong></a><br/>
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
                                <a href={`/retweet/${retweet.id}`}>
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
                                <a href={`/retweet/${post.id}`}>
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

    handleEditSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('bio', this.state.bio);
        formData.append('location', this.state.location);
        formData.append('website', this.state.website);
        formData.append('dob', this.state.dob);
        axios.post('/edit_user_info', formData)
            .then(response => {
                console.log('from handle edit submit', response);
                this.setState({
                    user: response.data.user,
                    profile_visited: response.data.user
                });
            });
        this.setState({
            edit_state: false,
            bio: '',
            location: '',
            website: '',
            dob: ''
        });
    }

    buildMainProfile() {
        const imgTag = this.buildImgTag();
        const videoTag = this.buildVideoTag();
        const noTweet = this.noTweetTag();
        const tweet = this.buildTweetTag();
        const retweet = this.buildRetweetTag();
        if (this.state.user.username === this.state.profile_visited.username) {
            return <React.Fragment>
                <div className="col-md-6" id="main_profile">
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
                                    src={this.state.profile_visited.profile_picture == null ? '/images/avatar-default.png' : `${this.state.profile_visited.profile_picture}`}
                                    alt="User Avatar"
                                    className={this.state.profile_visited.profile_picture == '' ? 'user-avatar' : 'user-avatar image'}/>
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
                            {!this.state.loading ? tweet : ''}
                            {noTweet}
                        </div>
                        <div className="card-footer">
                            <ion-icon name="arrow-dropup-circle" class="back-to-top" title="Back to Top"
                                      onClick={this.scrollToTop.bind(this, 1000)}></ion-icon>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        } else {
            return <React.Fragment>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body" style={{minHeight: '50vh', position: 'relative'}}>
                            {!this.state.loading ? retweet : ''}
                            {!this.state.loading ? tweet : ''}
                            {noTweet}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        }
    }

    buildFollowing() {
        if (this.state.loading === false) {
            return <React.Fragment>
                <div className="container">
                    <div className="row">
                        {
                            this.state.following.map(
                                user => <div className="col-md-3 hidden following-selected" key={user.id}>
                                    <div className="card follow">
                                        <div className="card-header follow-cover-photo">
                                            {
                                                user.cover_photo == null ? '' :
                                                    <img src={`${user.cover_photo}`} alt="Cover Photo" className="follow-cover-image"/>
                                            }
                                        </div>
                                        <div className="follow-profile-photo">
                                            {
                                                user.profile_picture == null ?
                                                    <img className="follow-profile-image" src={`../../images/avatar-default.png`} alt="Profile photo" /> :
                                                    <img className="follow-profile-image" src={`${user.profile_picture}`} alt="Profile photo" />
                                            }
                                        </div>
                                        <div className="card-body follow-content">
                                            <div className="follow-button float-right">
                                                {
                                                    user.can_follow == true ?
                                                        <a onClick={this.handleUnfollow.bind(this, user.username)} className="tweet transparent">Follow</a> :
                                                        <a onClick={this.handleUnfollow.bind(this, user.username)} className="tweet transparent">Unfollow</a>
                                                }
                                            </div>
                                            <div className="follow-user-name">
                                                <a href={`/users/${user.username}`}><span><strong>{user.name.substring(0, user.name.search(" "))}</strong></span></a><br />
                                                <a href={`/users/${user.username}`}><span>@{user.username}</span></a>
                                            </div>
                                            <div className="follow-user-description">
                                                { user.short_description == null ? '' : user.short_description.substring(0, 99)+' ...' }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </React.Fragment>
        }
    }

    buildFollowers() {
        if (this.state.loading === false) {
            return <React.Fragment>
                <div className="container">
                    <div className="row">
                    {
                        this.state.followers.map(
                            user => <div className="col-md-3 hidden followers-selected" key={user.id}>
                                <div className="card follow">
                                    <div className="card-header follow-cover-photo">
                                        {
                                            user.cover_photo == null ? '' :
                                                <img src={`${user.cover_photo}`} alt="Cover Photo" className="follow-cover-image"/>
                                        }
                                    </div>
                                    <div className="follow-profile-photo">
                                        {
                                            user.profile_picture == null ?
                                                <img className="follow-profile-image" src={`../../images/avatar-default.png`} alt="Profile photo" /> :
                                                <img className="follow-profile-image" src={`${user.profile_picture}`} alt="Profile photo" />
                                        }
                                    </div>
                                    <div className="card-body follow-content">
                                        <div className="follow-button float-right">
                                            {
                                                user.can_follow == true ?
                                                    <a onClick={this.handleUnfollow.bind(this, user.username)} className="tweet transparent">Follow</a> :
                                                    <a onClick={this.handleUnfollow.bind(this, user.username)} className="tweet transparent">Unfollow</a>
                                            }
                                        </div>
                                        <div className="follow-user-name">
                                            <a href={`/users/${user.username}`}><span><strong>{user.name.substring(0, user.name.search(" "))}</strong></span></a><br />
                                            <a href={`/users/${user.username}`}><span>@{user.username}</span></a>
                                        </div>
                                        <div className="follow-user-description">
                                            { user.short_description == null ? '' : user.short_description.substring(0, 99)+' ...' }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    </div>
                </div>
            </React.Fragment>
        }
    }

    buildRetweetLikes() {
        if (this.state.retweet_likes.length > 0 && this.state.post_likes.length < 0) {
            return <React.Fragment>
                <div className="col-md-6 hidden likes-selected">
                    <div className="card">
                        <div className="card-body">
                            {this.state.retweet_likes.map(
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
                                                                <img src={`${JSON.parse(retweet.image)[0]}`} alt="Retweet image" className="retweet-image" />
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
                                                <a href={`/retweet/${retweet.id}`}>
                                                    { this.state.user.id === retweet.owner ? '' : <ion-icon class="ion-icon retweet" name="repeat"></ion-icon> }
                                                    <span className="tooltiptext">Retweet</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="card-footer">
                            <ion-icon name="arrow-dropup-circle" class="back-to-top" title="Back to Top"
                                      onClick={this.scrollToTop.bind(this, 1000)}></ion-icon>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        } else if (this.state.retweet_likes.length > 0 && this.state.post_likes.length > 0) {
            return <React.Fragment>
                {this.state.retweet_likes.map(
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
                                                    <img src={`${JSON.parse(retweet.image)[0]}`} alt="Retweet image" className="retweet-image" />
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
                                    <a href={`/retweet/${retweet.id}`}>
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
    }

    buildLikes() {
        const retweetLikes = this.buildRetweetLikes();
        if (this.state.post_likes.length > 0) {
            return <React.Fragment>
                <div className="col-md-6 hidden likes-selected">
                    <div className="card">
                        <div className="card-body">
                            {this.state.post_likes.map(
                                post => <div className="tweets" key={post.post_id}>
                                    <div className="tweets--img">
                                        <img src={post.profile_picture == null ? '/images/avatar-default.png' : `${post.profile_picture}`} alt="User Image" className={post.profile_picture == '' ? '' : 'image'}/>
                                    </div>
                                    <div className="tweets--content">
                                        <div className="tweets--heading">
                                            <a href={`/users/${post.username}`}><strong>{post.name}</strong></a>
                                            <span className="tweets--username">@{post.username}</span>
                                            <span className="dot">.</span>
                                            <span className="tweets--time"><b>{post.time}</b></span>
                                        </div>
                                        <p> {post.body} </p>
                                        <div className="tweets__img">
                                            { JSON.parse(post.image) == null ? '' :
                                                <div>
                                                    <img src={`${JSON.parse(post.image)[0]}`} alt="Post image" />
                                                    {
                                                        JSON.parse(post.image).length > 1 ?
                                                            <div className='img-transparent-box' onClick={this.openModal.bind(this, post.post_id, JSON.parse(post.image).length)}>
                                                                <span>{`+${JSON.parse(post.image).length - 1}`}</span>
                                                            </div> : ''
                                                    }
                                                    <div id={this.state.modal_id+'-'+post.id} className="my-modal">
                                                        <span className="my-close my-cursor" onClick={this.closeModal.bind(this, post.post_id)}>&times;</span>
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
                                                <a onClick={this.handleLike.bind(this, post.post_id)}>
                                                    { <img src="https://img.icons8.com/color/24/000000/hearts.png" className="ion-icon heart" /> }
                                                    { <span className="tooltiptext">Unlike</span> }
                                                </a>
                                                <span>{post.likes}</span>
                                            </div>
                                            <div>
                                                <a href={`/retweet/${post.post_id}`}>
                                                    { this.state.user.id === post.id ? '' : <ion-icon class="ion-icon retweet" name="repeat"></ion-icon> }
                                                    <span className="tooltiptext">Retweet</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {retweetLikes}
                        </div>
                        <div className="card-footer">
                            <ion-icon name="arrow-dropup-circle" class="back-to-top" title="Back to Top"
                                      onClick={this.scrollToTop.bind(this, 1000)}></ion-icon>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        }
    }

    handleBodyChange(e) {
        this.setState({
            body: e.target.value
        })
    }

    handleBioChange(e) { this.setState({ bio: e.target.value }); }
    handleLocationChange(e) { this.setState({ location: e.target.value }); }
    handleWebsiteChange(e) { this.setState({ website: e.target.value}); }
    handleBirthdayChange(e) { this.setState({ dob: e.target.value }); }

    handleFileChange(e){
        this.readURI(e, 'image');
        if (this.props.onChange !== undefined) {
            this.props.onChange(e);
        }
    }

    // handleVideoChange(e) {
    //     this.readURI(e, 'video');
    //     if (this.props.onChange !== undefined) {
    //         this.props.onChange(e);
    //     }
    //     this.setState({ video: e.target.value })
    // }

    handleProfilePhotoSubmit(e) {
        if (e.target.files) {
            let reader = new FileReader();
            reader.onload = function(ev) {
                this.setState (
                    {
                        profilePhoto: ev.target.result,
                        loading: true
                    }, () => {
                        const formData = new FormData();
                        formData.append('file', this.state.profilePhoto);
                        axios.post('/add_profile_photo', formData, {
                            onUploadProgress: progressEvent => {
                                console.log(progressEvent.loaded / progressEvent.total)
                            }
                        }).then(
                            response => {
                                console.log('from profile photo submit', response);
                                this.setState({
                                    user: response.data.user,
                                    profile_visited: response.data.user,
                                    loading: false
                                });
                            }
                        );
                    }
                )
            }.bind(this);
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    handleCoverPhotoSubmit(e) {
        if (e.target.files) {
            let reader = new FileReader();
            reader.onload = function(ev) {
                this.setState (
                    {
                        coverPhoto: ev.target.result,
                        loading: true
                    }, () => {
                        const formData = new FormData();
                        formData.append('file', this.state.coverPhoto);
                        axios.post('/add_cover_photo', formData, {
                            onUploadProgress: progressEvent => {
                                console.log(progressEvent.loaded / progressEvent.total)
                            }
                        }).then(
                            response => {
                                console.log('from cover photo submit', response);
                                this.setState({
                                    user: response.data.user,
                                    profile_visited: response.data.user,
                                    loading: false
                                });
                            }
                        );
                    }
                )
            }.bind(this);
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    handleLike(post) {
        axios.get(`/likes/${post}`)
            .then(response => {
                console.log('from handle like', response);
                this.setState(prevState => ({
                    posts: prevState.posts.map(el => el.id === post ? response.data.post[0] : el)
                }));
            })
    }

    handleRetweetLike(retweet) {
        axios.get(`/retweet/likes/${retweet}`)
            .then(response => {
                console.log('from handle retweet like', response);
                this.setState(prevState => ({
                    retweets: prevState.retweets.map(el => el.retweet_id === retweet ? response.data.retweet[0] : el)
                }))
            })
    }

    handleFollow(username) {
        axios.get(`/users/${username}/follow`)
            .then(response => {
                console.log('from handle follow', response);
                this.setState({
                    who_to_follow: response.data.who_to_follow,
                    following_count: response.data.following,
                    following: [response.data.user, ...this.state.following]
                });
            });
    }

    handleUnfollow(username) {
        axios.get(`/users/${username}/unfollow`)
            .then(response => {
                console.log('from handle unfollow', response);
                this.setState({
                    who_to_follow: response.data.who_to_follow,
                    following_count: response.data.following,
                    following: this.state.following.filter(following => following.username != username)
                });
            });
    }

    buildProfileButton() {
        if (this.state.profile_visited.username === this.state.user.username && this.state.edit_state === false) {
            return <React.Fragment>
                <a onClick={this.editProfile.bind(this)} className="tweet transparent">Edit Profile</a>
            </React.Fragment>
        } else if (this.state.can_follow === true && this.state.edit_state === false) {
            return <React.Fragment>
                <a onClick={this.handleFollow.bind(this, this.state.profile_visited.username)} className="tweet transparent">Follow</a>
            </React.Fragment>
        } else if (this.state.can_follow === false && this.state.edit_state === false) {
            return <React.Fragment>
                <a onClick={this.handleUnfollow.bind(this, this.state.profile_visited.username)} className="tweet transparent">Unfollow</a>
            </React.Fragment>
        } else if (this.state.edit_state === true) {
            return <React.Fragment>
                <div className="edit-profile">
                    <a onClick={this.editProfile.bind(this)} className="tweet transparent">Cancel</a>
                    <a onClick={this.handleEditSubmit.bind(this)} className="tweet transparent">Save Changes</a>
                </div>
            </React.Fragment>
        }
    }

    buildCoverPhoto() {
        if (this.state.profile_visited.cover_photo !== null && this.state.edit_state === false) {
            return <React.Fragment>
                <img className="cover-image" src={this.state.profile_visited.cover_photo} alt="Cover photo" />
            </React.Fragment>
        } else if (this.state.edit_state === true && this.state.user.cover_photo !== null) {
            return <React.Fragment>
                <img className="cover-image" src={this.state.profile_visited.cover_photo} alt="Cover photo" />
                <input id="cover-photo"
                       type="file"
                       name=""
                       accept="image/gif,image/jpeg,image/jpg,image/png"
                       title="Add a cover photo"
                       className="upload-photo"
                       onChange={this.handleCoverPhotoSubmit.bind(this)}
                />
                <div className='cover-transparent-box'>
                    <label htmlFor="cover-photo" className={this.state.profile_visited.cover_photo == null || this.state.edit_state === true ? '' : 'hidden'}>
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="27"
                                 viewBox="0 0 20 17" className="upload-icon">
                                <path
                                    d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/>
                            </svg>
                        </figure>
                        <span className="tooltiptext">Add a cover photo</span>
                    </label>
                    <span>Change your cover photo</span>
                </div>
            </React.Fragment>
        } else if (this.state.edit_state === true && this.state.user.cover_photo == null) {
            return <React.Fragment>
                <input id="cover-photo"
                       type="file"
                       name=""
                       accept="image/gif,image/jpeg,image/jpg,image/png"
                       title="Add a cover photo"
                       className="upload-photo"
                       onChange={this.handleCoverPhotoSubmit.bind(this)}
                />
                <label htmlFor="cover-photo" className={this.state.profile_visited.cover_photo == null || this.state.edit_state === true ? '' : 'hidden'}>
                    <figure>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="27"
                             viewBox="0 0 20 17" className="upload-icon">
                            <path
                                d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/>
                        </svg>
                    </figure>
                    <span className="tooltiptext">Add a cover photo</span>
                </label>
            </React.Fragment>
        }
    }

    buildProfilePhoto() {
        if (this.state.profile_visited.profile_picture !== null && this.state.edit_state === false) {
            return <React.Fragment>
                <img className="profile-image" src={this.state.profile_visited.profile_picture} alt="Profile photo" />
            </React.Fragment>
        } else if (this.state.edit_state === true && this.state.user.profile_picture !== null) {
            return <React.Fragment>
                <img className="profile-image" src={this.state.profile_visited.profile_picture} alt="Profile photo" />
                <input id="profile-photo"
                       type="file"
                       name=""
                       accept="image/gif,image/jpeg,image/jpg,image/png"
                       title="Add a profile photo"
                       className="upload-photo"
                       onChange={this.handleProfilePhotoSubmit.bind(this)}
                />
                <div className='transparent-box'>
                    <label htmlFor="profile-photo" className={this.state.profile_visited.profile_picture == null || this.state.edit_state === true ? '' : 'hidden'}>
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="27"
                                 viewBox="0 0 20 17" className="upload-icon">
                                <path
                                    d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/>
                            </svg>
                        </figure>
                        <span className="tooltiptext">Add a profile photo</span>
                    </label>
                    <span>Change your profile photo</span>
                </div>
            </React.Fragment>
        } else if (this.state.edit_state === true && this.state.user.profile_picture == null) {
            return <React.Fragment>
                <input id="profile-photo"
                       type="file"
                       name=""
                       accept="image/gif,image/jpeg,image/jpg,image/png"
                       title="Add a profile photo"
                       className="upload-photo"
                       onChange={this.handleProfilePhotoSubmit.bind(this)}
                />
                <label htmlFor="profile-photo" className={this.state.profile_visited.profile_picture == null || this.state.edit_state === true ? '' : 'hidden'}>
                    <figure>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="27"
                             viewBox="0 0 20 17" className="upload-icon">
                            <path
                                d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/>
                        </svg>
                    </figure>
                    <span className="tooltiptext">Add a profile photo</span>
                </label>
            </React.Fragment>
        } else if (this.state.profile_visited.profile_picture == null && this.state.profile_visited.username == this.state.user.username) {
            return <React.Fragment>
                <input id="profile-photo"
                       type="file"
                       name=""
                       accept="image/gif,image/jpeg,image/jpg,image/png"
                       title="Add a profile photo"
                       className="upload-photo"
                       onChange={this.handleProfilePhotoSubmit.bind(this)}
                />
                <label htmlFor="profile-photo" className={this.state.profile_visited.profile_picture == null || this.state.edit_state === true ? '' : 'hidden'}>
                    <figure>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="27"
                             viewBox="0 0 20 17" className="upload-icon">
                            <path
                                d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/>
                        </svg>
                    </figure>
                    <span className="tooltiptext">Add a profile photo</span>
                </label>
            </React.Fragment>
        }
    }

    buildBioTag() {
        if (this.state.edit_state === true) {
            return <React.Fragment>
                <input type="text" placeholder="Bio" className='user-info-input' onChange={this.handleBioChange.bind(this)} value={this.state.user.short_description ? this.state.user.short_description : ''} />
            </React.Fragment>
        } else if (this.state.profile_visited.short_description && this.state.edit_state === false) {
            return <React.Fragment>
                <div>
                    <img className="profile-info-icon bio" src="https://img.icons8.com/material-outlined/24/000000/resume.png" />
                    <span> { this.state.profile_visited.short_description } </span>
                </div>
            </React.Fragment>
        }
    }

    buildLocationTag() {
        if (this.state.edit_state === true) {
            return <React.Fragment>
                <input type="text" placeholder='Location' className='user-info-input' onChange={this.handleLocationChange.bind(this)} value={this.state.user.location ? this.state.user.location : ''} />
            </React.Fragment>
        } else if (this.state.profile_visited.location && this.state.edit_state === false) {
            return <React.Fragment>
                <div>
                    <ion-icon name="pin" class="profile-info-icon"></ion-icon>
                    <span> { this.state.profile_visited.location } </span>
                </div>
            </React.Fragment>
        }
    }

    buildWebsiteTag() {
        if (this.state.edit_state === true) {
            return <React.Fragment>
                <input type="url" placeholder='Website' className='user-info-input' onChange={this.handleWebsiteChange.bind(this)} value={this.state.user.website ? this.state.user.website : ''} />
            </React.Fragment>
        } else if (this.state.profile_visited.website && this.state.edit_state === false) {
            return <React.Fragment>
                <div>
                    <ion-icon name="globe" class="profile-info-icon"></ion-icon>
                    <a href={this.state.profile_visited.website} target='_blank'> { this.state.profile_visited.website.substring(0, 30)+'...' } </a>
                </div>
            </React.Fragment>
        }
    }

    buildBirthdayTag() {
        if (this.state.edit_state === true) {
            return <React.Fragment>
                <input type="date" className='user-info-input' onChange={this.handleBirthdayChange.bind(this)} value={this.state.user.dob ? this.state.user.dob : ''} />
            </React.Fragment>
        } else if (this.state.profile_visited.dob && this.state.edit_state === false) {
            return <React.Fragment>
                <div>
                    <img className="profile-info-icon" src="https://img.icons8.com/material/24/000000/birthday.png" />
                    <span> { this.state.profile_visited.dob } </span>
                </div>
            </React.Fragment>
        }
    }

    buildSideBar() {
        const whoToFollow = this.whoToFollowTag();
        const trends = this.trendsTag();
        return <React.Fragment>
            <div className="col-md-3" id="sidebar">
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

                <div className="trends">
                    <h3>Trending users</h3>
                    <div className="trends__list">
                        {trends}
                    </div>
                </div>
            </div>
        </React.Fragment>
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

    changeURL(index) {
        let a = this.state.user;
        switch (index) {
            case 0:
                document.getElementsByClassName('selected')[0].classList.remove('selected');
                document.getElementsByClassName('selected-tweet')[0].classList.add('selected');
                document.getElementById('main_profile').classList.remove('hidden');
                for (let i = 0; i < document.getElementsByClassName('following-selected').length; i++) {
                    document.getElementsByClassName('following-selected')[i].classList.add('hidden');
                }
                for (let i = 0; i < document.getElementsByClassName('followers-selected').length; i++) {
                    document.getElementsByClassName('followers-selected')[i].classList.add('hidden');
                }
                for (let i = 0; i < document.getElementsByClassName('likes-selected').length; i++) {
                    document.getElementsByClassName('likes-selected')[i].classList.add('hidden');
                }
                document.getElementsByClassName('user-detail-container')[0].classList.remove('hidden');
                document.getElementById('sidebar').classList.remove('hidden');
            break;
            case 1:
                document.getElementsByClassName('selected')[0].classList.remove('selected');
                document.getElementsByClassName('following')[0].classList.add('selected');
                document.getElementById('main_profile').classList.add('hidden');
                for (let i = 0; i < document.getElementsByClassName('following-selected').length; i++) {
                    document.getElementsByClassName('following-selected')[i].classList.remove('hidden');
                }
                for (let i = 0; i < document.getElementsByClassName('followers-selected').length; i++) {
                    document.getElementsByClassName('followers-selected')[i].classList.add('hidden');
                }
                for (let i = 0; i < document.getElementsByClassName('likes-selected').length; i++) {
                    document.getElementsByClassName('likes-selected')[i].classList.add('hidden');
                }
                document.getElementsByClassName('user-detail-container')[0].classList.add('hidden');
                document.getElementById('sidebar').classList.add('hidden');
            break;
            case 2:
                document.getElementsByClassName('selected')[0].classList.remove('selected');
                document.getElementsByClassName('followers')[0].classList.add('selected');
                document.getElementById('main_profile').classList.add('hidden');
                for (let i = 0; i < document.getElementsByClassName('following-selected').length; i++) {
                    document.getElementsByClassName('following-selected')[i].classList.add('hidden');
                }
                for (let i = 0; i < document.getElementsByClassName('followers-selected').length; i++) {
                    document.getElementsByClassName('followers-selected')[i].classList.remove('hidden');
                }
                for (let i = 0; i < document.getElementsByClassName('likes-selected').length; i++) {
                    document.getElementsByClassName('likes-selected')[i].classList.add('hidden');
                }
                document.getElementsByClassName('user-detail-container')[0].classList.add('hidden');
                document.getElementById('sidebar').classList.add('hidden');
            break;
            case 3:
                document.getElementsByClassName('selected')[0].classList.remove('selected');
                document.getElementsByClassName('likes')[0].classList.add('selected');
                document.getElementById('main_profile').classList.add('hidden');
                for (let i = 0; i < document.getElementsByClassName('following-selected').length; i++) {
                    document.getElementsByClassName('following-selected')[i].classList.add('hidden');
                }
                for (let i = 0; i < document.getElementsByClassName('followers-selected').length; i++) {
                    document.getElementsByClassName('followers-selected')[i].classList.add('hidden');
                }
                for (let i = 0; i < document.getElementsByClassName('likes-selected').length; i++) {
                    document.getElementsByClassName('likes-selected')[i].classList.remove('hidden');
                }
                document.getElementsByClassName('user-detail-container')[0].classList.remove('hidden');
                document.getElementById('sidebar').classList.remove('hidden');
            break;
        }
    }

    editProfile() {
        if (this.state.edit_state === false) {
            this.setState({ edit_state: true});
        } else {
            this.setState({ edit_state: false });
        }
    }

    formatNumber(type) {
        let num, numSplit, int;
        switch(type) {
            case 'tweets': num = this.state.profile_visited.tweets + this.state.retweets.length; break;
            case 'following': num = this.state.following_count; break;
            case 'followers': num = this.state.followers_count; break;
            case 'likes': num = this.state.likes_count; break;
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

    user() {
        const profileButton = this.buildProfileButton();
        const mainProfile = this.buildMainProfile();
        const following = this.buildFollowing();
        const followers = this.buildFollowers();
        const retweetLikes = this.state.post_likes.length < 0 ? this.buildRetweetLikes() : '';
        const likes = this.buildLikes();
        const sideBar = this.buildSideBar();
        const coverPhoto = this.buildCoverPhoto();
        const profilePhoto = this.buildProfilePhoto();
        const buildBioTag = this.buildBioTag();
        const buildLocationTag = this.buildLocationTag();
        const buildWebsiteTag = this.buildWebsiteTag();
        const buildBirthdayTag = this.buildBirthdayTag();

        return <React.Fragment>
            <div className="user-photo-container">
                <div className="user-cover-photo">
                    {coverPhoto}
                </div>
                <div className="user-profile-photo">
                    <div className='choose-photo user-choose-photo'>
                        {profilePhoto}
                    </div>
                    <div className="user-parent-info">
                        <div className="user-info user-profile-info">
                                <span className="selected selected-tweet" onClick={this.changeURL.bind(this, 0)}>
                                    <strong>Tweets</strong><br/>
                                    <label>
                                        {this.formatNumber('tweets').length > 3 ? this.formatNumber('tweets').substr(0, this.formatNumber('tweets').search(',')) + 'K' : this.formatNumber('tweets')}
                                        <span className="tooltiptext">{this.formatNumber('tweets')} Tweets</span>
                                    </label>
                                </span>
                            <span className="following" onClick={this.changeURL.bind(this, 1)}>
                                    <strong>Following</strong><br/>
                                    <label>
                                        {this.formatNumber('following').length > 3 ? this.formatNumber('following').substr(0, this.formatNumber('following').search(',')) + 'K' : this.formatNumber('following')}
                                        <span className="tooltiptext">{this.formatNumber('following')} Following</span>
                                    </label>
                                </span>
                            <span className="followers" onClick={this.changeURL.bind(this, 2)}>
                                    <strong>Followers</strong><br/>
                                    <label>
                                        {this.formatNumber('followers').length > 3 ? this.formatNumber('followers').substr(0, this.formatNumber('followers').search(',')) + 'K' : this.formatNumber('followers')}
                                        <span className="tooltiptext">{this.formatNumber('followers')} Followers</span>
                                    </label>
                                </span>
                            <span className="likes" onClick={this.changeURL.bind(this, 3)}>
                                    <strong>Likes</strong><br/>
                                    <label>
                                        {this.formatNumber('likes').length > 3 ? this.formatNumber('likes').substr(0, this.formatNumber('likes').search(',')) + 'K' : this.formatNumber('likes')}
                                        <span className="tooltiptext">{this.formatNumber('likes')} Likes</span>
                                    </label>
                                </span>
                        </div>
                        <div className="user-profile-button">
                            {profileButton}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container user-detail-container" style={{marginTop: 35}}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="profile-info">
                            <span>
                                <a href={`/users/${this.state.profile_visited.username}`}
                                   className="user-firstname"><strong>{this.state.profile_visited.name}</strong></a><br/>
                                <a href={`/users/${this.state.profile_visited.username}`}
                                   className="user-username">@{this.state.profile_visited.username}</a>
                            </span>
                            <span>
                                <ion-icon name="calendar" class="profile-info-icon calendar"></ion-icon>
                                <span>Joined {this.state.profile_visited.created_at ? new Date(Date.parse(this.state.profile_visited.created_at)).toDateString().substring(new Date(Date.parse(this.state.profile_visited.created_at)).toDateString().search(" "), new Date(Date.parse(this.state.profile_visited.created_at)).toDateString().length) : ''}</span>
                            </span>
                            <span>
                                {buildBioTag}
                            </span>
                            <span>
                                {buildLocationTag}
                            </span>
                            <span>
                                {buildWebsiteTag}
                            </span>
                            <span>
                                {buildBirthdayTag}
                            </span>
                        </div>
                    </div>
                    {mainProfile} {likes} {retweetLikes}
                    {sideBar}
                </div>
            </div>
            {following} {followers}
        </React.Fragment>
    }

    render() {
        const mainLoading = this.mainLoadingTag();
        const user = this.user();

        return (
            <div className="container-fluid" style={{padding: 0}}>
                { this.state.loading ? mainLoading : user }
            </div>
        );
    }
}

export default Users;
