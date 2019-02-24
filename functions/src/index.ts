import * as functions from 'firebase-functions';
import * as vision from '@google-cloud/vision';
import * as admin from 'firebase-admin';
import * as path from 'path';

admin.initializeApp();

export const detectText = functions.storage.object().onFinalize(async object => {
  if (!object.name) {
    return;
  }
  const userId = path.basename(path.dirname(object.name));
  const fileName = path.basename(object.name);
  const [downloadUrl] = await admin.storage().bucket(object.bucket).file(object.name).getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  });
  console.log('OCR', userId, fileName);

  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.documentTextDetection(`gs://${object.bucket}/${object.name}`);
  const fullTextAnnotation = result.fullTextAnnotation;
  return admin.firestore()
    .collection('receiptTextsByUser').doc(userId).collection('receiptTexts')
    .doc(fileName)
    .set(
      {
        downloadUrl,
        text: fullTextAnnotation.text
      }
    );
});
