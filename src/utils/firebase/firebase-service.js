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
  static _get(url) {
    const ref = firebase.database().ref(url);
    return new Promise(function(resolve, reject) {
      const data = ref.once('value');
      !_.isNil(data) ? resolve(data) : reject(Error('Unable to load data.'));
    });
  }

  static getProjects() {
    return this._get('projects').then((snapshot) => snapshot.val());
  }

  static getProject(id) {
    if (sessionStorage.getItem(id)) {
      return JSON.parse(sessionStorage.getItem(id));
    } 
    return this._get(`projects/${id}`).then((snapshot) => snapshot.val());
  }

  static getCriteria() {
    return this._get('criteria').then((snapshot) => snapshot.val());
  }

  static getSprints(project) {
    if (sessionStorage.getItem(`${project}.sprints`)) {
      return JSON.parse(sessionStorage.getItem(`${project}.sprints`));
    }
    return this._get(`sprints/${project}`).then((snapshot) => snapshot.val());
  }


  /*
   * Saving Data
   */
  static _save(url, data) {
    const ref = firebase.database().ref(url);
    return ref.set(data);
  }


  static saveSprint(projectId, sprint) {
    const ref = firebase.database().ref(`sprints/${projectId}/${sprint.id}/teams`);
    ref.set(sprint.teams);
  }

  static createSprint(project, ) {
    return this._save();
  }

  static createTeam(project, team) {
    const teamKey = _.camelCase(team);
    return this._save(`projects/${project.id}/teams/${teamKey}`, team);
  }

  static createProject(project) {
    if (_.isObject(project)) {
      this._save(`projects/${project.id}`, project);
    }
  }


  /**
   * Deleting Data
   */
  static _delete(url) {
    const ref = firebase.database().ref(url);
    ref.remove();
  }

  static deleteProject(project) {
    this._delete(`projects/${project.id}`);
  }


  /**
   * Session 
   */
}