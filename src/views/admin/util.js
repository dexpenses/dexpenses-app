import firebase from 'firebase/app';

export const categories = ['bills', 'ec', 'gas_station', 'normal', 'parking'];

export const testDataImageBucket = 'dexpenses-207219-test-images';
export const testImageUploadBucket = 'dexpenses-207219-test-image-upload';

export function storage(bucket) {
  return firebase.app().storage(`gs://${bucket}/`);
}

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
