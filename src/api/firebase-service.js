import firebase from "firebase";

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
      const data = ref.once("value");
      !_.isNil(data) ? resolve(data) : reject(Error("Unable to load data."));
    });
  }

  static getProjects() {
    return this._get("projects").then(snapshot => snapshot.val());
  }

  static getProject(id) {
    return this._get(`projects/${id}`).then(snapshot => snapshot.val());
  }

  /*
   * Saving Data
   */
  static _save(url, data) {
    const ref = firebase
      .database()
      .ref(url)
      .push();
    const refId = ref.key;
    ref.set(data);
    return Promise.resolve(refId);
  }

  static addProject(project) {
    return this._save(`projects`, project);
  }

  static addTeamToProject(projectId, team) {
    return this._save(`projects/${projectId}/teams`, team);
  }

  static addSprintToProject(projectId, sprint) {
    return this._save(`projects/${projectId}/sprints`, sprint);
  }

  static addTeamToSprint(projectId, sprintId, team) {
    return this._save(
      `projects/${projectId}/sprints/${sprintId}/teams/${team.id}`,
      team
    );
  }

  /*
   * Updating Data
   */
  static _update(url, data) {
    const ref = firebase.database().ref(url);
    return ref.update(data);
  }

  static updateProject(project, keys) {
    return this._update(`projects/${project.id}`, _.pick(project, keys));
  }

  static updateTeam(projectId, team, keys) {
    return this._update(
      `projects/${projectId}/teams/${team.id}`,
      _.pick(team, keys)
    );
  }

  static updateSprints(projectId, sprints) {
    return this._update(`projects/${projectId}/sprints`, sprints);
  }

  static updateSprint(projectId, sprintId, sprint) {
    return this._update(`projects/${projectId}/sprints/${sprintId}`, sprint);
  }

  // Method to update the main team health data
  static updateTeamsSprintData(projectId, sprintId, sprint) {
    return this._update(
      `projects/${projectId}/sprints/${sprintId}/teams`,
      sprint.teams
    );
  }

  /**
   * Deleting Data
   */
  static _delete(url) {
    const ref = firebase.database().ref(url);
    return ref.remove();
  }

  static deleteProject(projectId) {
    return this._delete(`projects/${projectId}`);
  }

  static deleteTeamFromProject(projectId, teamId) {
    const url = `projects/${projectId}/teams/${teamId}`;
    return this._delete(url);
  }

  static deleteSprintFromProject(projectId, sprintId) {
    const url = `projects/${projectId}/sprints/${sprintId}`;
    return this._delete(url);
  }

  static deleteTeamFromSprint(projectId, sprintId, teamId) {
    const url = `projects/${projectId}/sprints/${sprintId}/teams/${teamId}`;
    return this._delete(url);
  }

  static removeSprint(projectId, sprintId) {
    const url = `projects/${projectId}/sprints/${sprintId}`;
    return this._remove(url);
  }

  static removeTeam(projectId, teamId) {
    const url = `projects/${projectId}/teams/${teamId}`;
    return this._remove(url);
  }

  static removeTeamFromSprint(projectId, sprintId, teamId) {
    const url = `projects/${projectId}/sprints/${sprintId}/teams/${teamId}`;
    return this._remove(url);
  }
}
