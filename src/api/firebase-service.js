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

export async function create(url, data) {
  const ref = firebase
    .database()
    .ref(url)
    .push();

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
