import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';
import { BrowserRouter, Route, Switch, Link, NavLink } from "react-router-dom";
import EditForm from './components/EditForm';
import Form from './components/form/Form';
import LoginButton from './components/LoginButton';
import ProductGrid from './components/ProductGrid/ProductGrid';
import ProductSingle from './components/ProductSingle/ProductSingle';
import testProducts from './testProducts';
import SiteHeadline from './components/SiteHeadline/SiteHeadline';
import Footer from './components/Footer/Footer';

const config = {
  apiKey: "AIzaSyA3sIWuCGhRnsMM2uxTlOIZ8RDSk1oS4mo",
  authDomain: "phone-phax.firebaseapp.com",
  databaseURL: "https://phone-phax.firebaseio.com",
  projectId: "phone-phax",
  storageBucket: "phone-phax.appspot.com",
  messagingSenderId: "690418395994"
};

firebase.initializeApp(config);

class App extends Component {
  constructor() {
    super();

    this.state = {
      adminButtonText: 'Add inventory',
      adminFormVisible: false,
      currentUser: '',
      currentUserId: '',
      currentUserRole: '',
      editFormVisible: false,
      keyToEdit: '',
      loggedIn: false,
      products: {}
    };

    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
    this.editItem = this.editItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }


  componentDidMount() {
    this.usersDbRef = firebase.database().ref("users");
    this.productsDbRef = firebase.database().ref('products').orderByKey();

    this.productsDbRef.on("value", snapshot => {
      const savedProducts = snapshot.val();
      this.setState({
        products: savedProducts
      })
    })

    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        let dbRefUser = firebase.database().ref("users/" + user.uid);

        // checks to see if current user exists; if not, creates user
        dbRefUser.on("value", snapshot => {
          if (snapshot.exists()) {
            let loggedInUser = snapshot.val();

            this.setState({
              loggedIn: true,
              currentUser: loggedInUser,
              currentUserId: loggedInUser.userId,
              currentUserRole: loggedInUser.userRole
            });
            this.dbRefUser = dbRefUser;
          } else {
            let loggedInUser = {
              userId: user.uid,
              userName: user.displayName,
              userRole: 'consumer'
            };
            this.setState({
              loggedIn: true,
              currentUser: loggedInUser,
              currentUserId: loggedInUser.userId,
              currentUserRole: loggedInUser.userRole
            });
            dbRefUser.set(loggedInUser);
          }
        });
      } else {
        this.usersDbRef.off("value");
        this.setState({
          loggedIn: false,
          currentUser: null,
          currentUserId: '',
          currentUserRole: ''
        });
      }
    });
  }

  adminPage = () => {
    const visible = this.state.adminFormVisible === false ? true : false;
    const buttonText = this.state.adminFormVisible === false ? 'Hide form' : 'Add inventory';
    this.setState({
      editFormVisible: false,
      adminFormVisible: visible,
      adminButtonText: buttonText
    });
  };

  closeEditForm(e) {
    this.setState({
      editFormVisible: false,
      keyToEdit: ''
    })
  }

  editItem(keyToEdit) {
    window.scrollTo(0, 0);
    this.setState({
      adminFormVisible: false,
      editFormVisible: true,
      keyToEdit
    })
  }

  loadTestProducts = () => {
    Object.keys(testProducts).map((key) => {
      let dbRef = firebase.database().ref(`products/${key}`);
      dbRef.set(testProducts[key]);
    })
  }

  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(user => {
        console.log(user);
      })
      .catch(err => {
        console.log(err);
      });
  }

  logout() {
    firebase.auth().signOut();
  }

  removeItem(keyToRemove) {
    console.log(keyToRemove);
    firebase
      .database()
      .ref(`products/${keyToRemove}`)
      .remove();
  }

  render() {
    const FormContainer = (props) => {
      return (
        <Form
          submit={this.submitHandler}
        />
      )
    }

    return <BrowserRouter>
      <div className="app">
        <header>
        <SiteHeadline />
        <div className="utility-nav">
          {this.state.currentUserRole === 'admin' && <Route path="/" exact render={() => <button onClick={this.adminPage}>{this.state.adminButtonText}</button>} />}
          {this.state.currentUserRole === 'admin' && <Route path="/" exact render={() => <button onClick={this.loadTestProducts}>Load sample products</button>} />}
          <LoginButton loggedIn={this.state.loggedIn} loginWithGoogle={this.loginWithGoogle} logout={this.logout} />
        </div>
        </header>


        <main>
          {this.state.adminFormVisible === true && <Route path="/" exact render={() => <Form adminPage={this.adminPage} />} />}
          {this.state.editFormVisible === true && <Route path="/" exact render={() => <EditForm keyToEdit={this.state.keyToEdit} closeEditForm={this.closeEditForm} />} />}
          <div className="wrapper">
          <Route path="/" exact render={() => <ProductGrid products={this.state.products} currentUserRole={this.state.currentUserRole} removeItem={this.removeItem} editItem={this.editItem} />} />
          <Route path="/products/:productId" component={ProductSingle} />
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>;

  }

}

export default App;