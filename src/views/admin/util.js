import firebase from 'firebase/app';

export const categories = ['bills', 'ec', 'gas_station', 'normal', 'parking'];

export const testDataImageBucket = 'dexpenses-207219-test-images';
export const storage = firebase.app().storage(`gs://${testDataImageBucket}/`);

export function getUrl(path) {
  return `https://firebasestorage.googleapis.com/v0/b/${testDataImageBucket}/o/${encodeURIComponent(
    path
  )}?alt=media`;
}

export function buildIdentifier(info) {
  return [info.category, info.cityCode, info.name, info.classifier, info.paymentMethod]
    .filter(p => !!p)
    .join('-');
}
