import firebase from 'firebase';

export default class FirebaseService {

  /**  
   * Sets up the firebase connection
   */
  static initialiseDatabase() {
    const config = {
      apiKey: "AIzaSyCaB22KDhV98fl6xyFHe5QSE6SAcYX5MZQ",
      authDomain: "squad-health-check-c6d92.firebaseapp.com",
      databaseURL: "https://squad-health-check-c6d92.firebaseio.com",
      projectId: "squad-health-check-c6d92",
      storageBucket: "squad-health-check-c6d92.appspot.com",
      messagingSenderId: "229194561034"
    };

    if (!firebase.apps.length) 
      firebase.initializeApp(config);
  }


  /*
   * Getting Data
   */ 
  static getProjects() {
    let database = firebase.database();
    return database.ref('projects').once('value')
      .then((snapshot) => snapshot.val());
  }

  static getProject(id) {
    let database = firebase.database();
    return database.ref(`projects/${id}`).once('value')
      .then((snapshot) => snapshot.val());
  }

  static getCriteria() {
    let database = firebase.database();
    return database.ref('criteria').once('value')
      .then((snapshot) => snapshot.val());
  }

  static getSprints(project) {
    let database = firebase.database();
    return database.ref(`sprints/${project}`).once('value')
      .then((snapshot) => snapshot.val());
  }


  /*
   * Saving Data
   */
  static saveProject(project) {
    let ref = firebase.database().ref(`projects/${project.id}`);
    ref.set(project);
  }

  static saveSprint(projectId, sprint) {
    let ref = firebase.database().ref(`sprints/${projectId}/${sprint.id}/teams`);
    ref.set(sprint.teams);
  }
}