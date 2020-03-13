const firebasemock = require('firebase-mock');
  
const mockdatabase = new firebasemock.MockFirebase();
const mockauth = new firebasemock.MockFirebase();
const mocksdk = new firebasemock.MockFirebaseSdk(path => {
  return path ? mockdatabase.child(path) : mockdatabase;
}, () => {
  return mockauth;
});

const firebase = mocksdk.initializeApp(); // can take a path arg to database url
// optional - expose the mock
global.firebase = firebase;

module.exports = firebase;