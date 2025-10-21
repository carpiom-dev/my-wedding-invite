import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, CollectionReference } from '@angular/fire/firestore';
import { Person, PersonId } from '@domain/entities/person';
import { v4 as uuidv4 } from 'uuid';
import { PersonRepository } from '@domain/repositories/person.repository';

@Injectable({ providedIn: 'root' })
export class PersonFirestoreRepository implements PersonRepository {
  private firestore = inject(Firestore);
  private collectionName = 'persons';

  async add(person: Omit<Person, 'id'>): Promise<Person> {
    const idValue = uuidv4();
    const docRef = doc(collection(this.firestore, this.collectionName), idValue);
    const personWithId: Person = { ...person, id: { value: idValue } };
    await setDoc(docRef, personWithId);
    return personWithId;
  }

  async update(id: PersonId, patch: Partial<Omit<Person, 'id'>> & Partial<Pick<Person, 'confirmado' | 'fechaConfirmacion'>>): Promise<void> {
    const docRef = doc(collection(this.firestore, this.collectionName), id.value);
    await updateDoc(docRef, patch as any);
  }

  async remove(id: PersonId): Promise<void> {
    const docRef = doc(collection(this.firestore, this.collectionName), id.value);
    await deleteDoc(docRef);
  }

  async getById(id: PersonId): Promise<Person | null> {
    const docRef = doc(collection(this.firestore, this.collectionName), id.value);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as Person) : null;
  }

  async list(): Promise<Person[]> {
    const colRef = collection(this.firestore, this.collectionName);
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data() as Person);
  }

  // Tiempo real
  onSnapshot(callback: (persons: Person[]) => void) {
    const colRef = collection(this.firestore, this.collectionName) as CollectionReference<Person>;
    return onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(d => d.data());
      callback(data);
    });
  }
}
