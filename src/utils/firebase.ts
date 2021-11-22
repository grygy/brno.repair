import { initializeApp } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as authSignOut,
	onAuthStateChanged,
	User
} from 'firebase/auth';
import {
	addDoc,
	collection,
	CollectionReference,
	doc,
	DocumentReference,
	getDocs,
	getFirestore,
	limit,
	orderBy,
	query,
	Timestamp
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCXF3hRiE3zw7IMnaKRNr9q2Odeczgsz-c',
	authDomain: 'brnodotrepair.firebaseapp.com',
	projectId: 'brnodotrepair',
	storageBucket: 'brnodotrepair.appspot.com',
	messagingSenderId: '203582460583',
	appId: '1:203582460583:web:95e0064fa6bdfd717f8182'
};

// Initialize Firebase
const _app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth();

// Sign up handler
export const signUp = (email: string, password: string) =>
	createUserWithEmailAndPassword(auth, email, password);

// Sign in handler
export const signIn = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

// Sign out handler
export const signOut = () => authSignOut(auth);

// Subscribe to auth state changes
export const onAuthChanged = (callback: (u: User | null) => void) =>
	onAuthStateChanged(auth, callback);

// Firestore
const db = getFirestore();

export type Category = 'Doprava' | 'Příroda' | 'Infrastruktura';

export type Problem = {
	title: string;
	description: string;
	author: string;
	location: string;
	created: Timestamp;
	resolved: Timestamp | null;
	category: Category;
	// TODO image
};

export const getProblem = (id: string) =>
	doc(db, 'problems', id) as DocumentReference<Problem>;

const problemsCollection = collection(
	db,
	'problems'
) as CollectionReference<Problem>;

export const addProblem = async (problem: Problem) => {
	await addDoc(problemsCollection, problem);
};

export const getLastProblems = async (limited: number) => {
	const q = query(
		problemsCollection,
		orderBy('created', 'desc'),
		limit(limited)
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map(doc => doc.data());
};
