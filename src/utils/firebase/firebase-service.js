import firebase from 'firebase';

export default class FirebaseService {

  /**  
   * Sets up the firebase connection
   */
  static initialiseDatabase() {
    const config = {
      apiKey: "AIzaSyBQ9Eo9cpSCRld4vpzjmV1XrgcDiWCE3Hc",
      authDomain: "team-health-check-9141c.firebaseapp.com",
      databaseURL: "https://team-health-check-9141c.firebaseio.com/",
      projectId: "team-health-check-9141c",
      storageBucket: "team-health-check-9141c.appspot.com",
      messagingSenderId: "60524480289"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
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

  static getAvailableProjects() {
    return this._get('available_projects').then((snapshot) => snapshot.val());
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


  static saveSprint(projectId, sprint, sprintNumber) {
    const url = `projects/${projectId}/sprints/${sprintNumber}/teams`;
    console.log('[URL]', url);
    const ref = firebase.database().ref(`projects/${projectId}/sprints/${sprintNumber}/teams`);
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