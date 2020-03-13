import React, { Component } from 'react';
import SignUpForm from './components/signup/SignUpForm';
import firebase from 'firebase/app';
import 'firebase/auth';
import ChirperHeader from './components/chirper/ChirperHeader';
import ChirpBox from './components/chirper/ChirpBox';
import ChirpList from './components/chirper/ChirpList';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true
    };
  }

  componentDidMount() {
    this.authUnRegFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) { //if exists, then we logged in
        console.log("Logged in as", firebaseUser.email);
        this.setState({ user: firebaseUser, loading: false });
      } else {
        console.log("Logged out");
        this.setState({ user: null, loading: false });
      }
    })
  }

  componentWillUnmount() {
    this.authUnRegFunc() //stop listening for auth changes
  }

  //A callback function for registering new users
  handleSignUp = (email, password, handle, avatar) => {
    this.setState({ errorMessage: null }); //clear any old errors
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let firebaseUser = userCredential.user;
        console.log("User created!", firebaseUser); // check
        let updatePromise = firebaseUser.updateProfile({         //add the username to their account     
          displayName: handle,
          photoURL: avatar
        });
        return updatePromise;
      })
      .then(() => {
        this.setState((prevState) => {
          let updatedUser = { ...prevState.user, displayName: prevState.user.displayName, photoURL: prevState.user.photoURL };
          return { user: updatedUser }; //updating the state
        });
      })
      .catch((err) => {
        this.setState({ errorMessage: err.message });
      })
  }

  //A callback function for logging in existing users
  handleSignIn = (email, password) => {
    this.setState({ errorMessage: null });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((err) => {
        this.setState({ errorMessage: err.message });
      })
  }

  handleSignOut = () => {
    this.setState({ errorMessage: null }); //clear
    firebase.auth().signOut();
  }

  render() {

    let content = null; //content to render

    if (!this.state.user) { //if logged out, show signup form
      content = (
        <div className="container">
          <h1>Sign Up</h1>
          <SignUpForm
            signUpCallback={this.handleSignUp}
            signInCallback={this.handleSignIn}
          />
        </div>
      );
    }
    else { //if logged in, show welcome message
      content = (
        <div>
          <ChirperHeader user={this.state.user}>
            {/* log out button is child element */}
            {this.state.user &&
              <button className="btn btn-warning" onClick={this.handleSignOut}>
                Log Out {this.state.user.displayName}
              </button>
            }
          </ChirperHeader>
          <ChirpBox currentUser={this.state.user} />
          <ChirpList currentUser={this.state.user} />
        </div>
      );
    }

    if (this.state.loading) {
      content = (
        <div className="text-center">
          <i className="fa fa-spinner fa-spin fa-3x" aria-label="Connecting..."></i>
        </div>
      );
    }

    return (
      <div>
        {this.state.errorMessage &&
          <p className="alert alert-danger">{this.state.errorMessage}</p>
        }
        {content}
      </div>
    );
  }
}

export default App;
