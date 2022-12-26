import {Timestamp} from 'firebase/firestore';

/**
 * Converts firestore Timestamp objects to JS Dates. All fields and
 * sub-fields are checked and converted if they are Timestamp objects.
 *
 * @param data the object with timestamps
 */
export function convertTimestamps(data: any): void {
  if (!data || typeof data !== 'object') return;

  // Go through each field
  for (const field in data) {
    if (field && field.charAt(0) === '_') continue;

    // Field is a timestamp
    let v = data[field];
    if (v instanceof Timestamp) {
      data[field] = v.toDate();
      continue;
    }

    // Object or array
    if (v && typeof v === 'object') {
      if (typeof v.length === 'number') {
        const n = v.length;
        for (let i = 0; i < n; i++) {
          let v2 = v[i];
          if (v2 instanceof Timestamp) {
            v[i] = v2.toDate();
          } else {
            convertTimestamps(v2);
          }
        }
      } else {
        convertTimestamps(v);
      }
    }
  }
}
