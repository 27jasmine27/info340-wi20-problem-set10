import React, { Component } from 'react'; //import React Component
import Moment from 'react-moment';
import './Chirper.css'; //load module-specific CSS
import firebase from 'firebase/app';



//A list of chirps that have been posted
export default class ChirpList extends Component {
  constructor(props){
    super(props);
    this.state = {chirps:[]};
  }

// make chirp list listen for changes in DB and when there is
// redownload data and display it on le screen
componentDidMount() {
  let chirpsRef = firebase.database().ref('chirps');
  
  //add event listner--> add event is a change in db event
  //give snapshot of value of what is there at that point in time
  chirpsRef.on('value', (snapshot) => {
    let data = snapshot.val();

    //convert object into array by looping thru to get keys
    let keyArray = Object.keys(data);
    let chirpArray = keyArray.map((eachKey) => {
      let chirpObj = data[eachKey];

      //give object unique id aka the reference name in db
      chirpObj.id = eachKey; //where they live
      return chirpObj;
    })
    this.setState({ chirps: chirpArray}); //adds to state
  })
}


  render() {
    if(!this.state.chirps) return null; //if no chirps, don't display

    /* TODO: produce a list of `<ChirpItems>` to render */
    let chirpItems = this.state.chirps.map((chirp) => {
      return <ChirpItem  key={chirp.id} chirp={chirp} currentUser={this.props.currentUser} />
    })
    
     //REPLACE THIS with an array of actual values!    

    return (
      <div className="container">
          {chirpItems}
      </div>);
  }
}

//A single Chirp
class ChirpItem extends Component {

  likeChirp = () => {
    /* TODO: update the chirp when it is liked */
    let chirp = firebase.database().ref('chirps/' + this.props.chirp.id + '/likes');//.child(this.props.chirp.id).child('likes');
    let current = this.props.chirp.likes;
    let id = this.props.currentUser.uid;
    if (current === undefined) {
      current = {};
    }
    if (current[id] !== undefined) {
      current[id] = null;
    } else {
      current[id] = true;
    }
    chirp.set(current)
      .catch((err) => {
        console.log(err);
      });
  }
 
  render() {
    let chirp = this.props.chirp; //current chirp (convenience)

    //counting likes
    let likeCount = 0; //count likes
    let userLikes = false; //current user has liked
    if(chirp.likes){
      likeCount = Object.keys(chirp.likes).length;
      if(chirp.likes[this.props.currentUser.uid]) //if user id is listed
        userLikes = true; //user liked!
    }

    return (
      <div className="row py-4 bg-white border">
        <div className="col-1">
          <img className="avatar" src={chirp.userPhoto} alt={chirp.userName+' avatar'} />
        </div>
        <div className="col pl-4 pl-lg-1">

          <span className="handle">{chirp.userName} {/*space*/}</span>

          <span className="time"><Moment date={chirp.time} fromNow/></span>

          <div className="chirp">{chirp.text}</div>

          {/* A section for showing chirp likes */}
          <div className="likes">          
            <i className={'fa fa-heart '+(userLikes ? 'user-liked': '')} aria-label="like" onClick={this.likeChirp} ></i>
            <span>{/*space*/} {likeCount}</span>
          </div>
        </div>
      </div>      
    );
  }
}
