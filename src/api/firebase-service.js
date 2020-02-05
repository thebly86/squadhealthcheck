import firebase from "firebase";

export async function get(url) {
  const response = await firebase
    .database()
    .ref(url)
    .once("value");

  if (response) {
    return await response.val();
  } else {
    throw new Error("Unable to retrieve data.");
  }
}

export async function query(url, { field, value }) {
  const results = await firebase
    .database()
    .ref(url)
    .orderByChild(field)
    .equalTo(value)
    .once("value")
    .then(snapshot => snapshot.val());

  return results;
}

/**
 * Function creates new record in firebase database
 * @param {*} url path to save data at
 * @param {*} data the data to be saved
 * @param {*} generateId whether to create new child location with unique id
 */
export async function create(url, data, generateId = true) {
  let ref = firebase.database().ref(url);

  // Generates new child location using a unique key
  ref = generateId ? ref.push() : ref;

  await ref.set(data, error => {
    if (error) {
      throw new Error("Unable to add new data.");
    }
  });

  return ref.key;
}

export function update(url, data) {
  return firebase
    .database()
    .ref(url)
    .update(data);
}

export function remove(url) {
  return firebase
    .database()
    .ref(url)
    .remove();
}
