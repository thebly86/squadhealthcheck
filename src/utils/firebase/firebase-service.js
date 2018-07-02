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

  static _remove(url) {
    const ref = firebase.database().ref(url);
    return ref.remove();
  }

  static removeTeam(projectId, teamId) {
    const url = `projects/${projectId}/teams/${teamId}`;
    return this._remove(url);
  }

  static removeTeamFromSprint(projectId, sprintId, teamId) {
    const url = `projects/${projectId}/sprints/${sprintId}/teams/${teamId}`;
    return this._remove(url);
  }

  static saveSprint(projectId, sprint, sprintNumber) {
    const ref = firebase.database().ref(`projects/${projectId}/sprints/${sprintNumber}/teams`);
    ref.set(sprint.teams);
  }

  static createSprint(projectId, sprint) {
    return this._save(`projects/${projectId}/sprints/${sprint.id}`, sprint);
  }

  static addTeamToSprint(projectId, sprintId, team) {
    return this._save(`projects/${projectId}/sprints/${sprintId}/teams/${team.id}`, team);
  }

  static createTeam(project, team) {
    return this._save(`projects/${project.id}/teams/${team.id}`, team);
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
    this._delete(`available_projects/${project.id}`);
  }


  /**
   * Session 
   */
}