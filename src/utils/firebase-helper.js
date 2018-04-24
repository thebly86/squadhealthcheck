import firebase from 'firebase';

export default class ProjectsService {
  constructor() {
    this.database = firebase.database();
  }

  getProject(id) {
    return this.database.ref(`projects/${id}`).once('value')
      .then((snapshot) => snapshot.val());
  }
}