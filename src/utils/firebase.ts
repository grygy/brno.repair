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
	getDoc,
	getDocs,
	getFirestore,
	limit,
	orderBy,
	query,
	setDoc,
	Timestamp,
	updateDoc
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// Constants
const IMAGES = 'images/';
const PROBLEMS = 'problems';
const USER_PROFILES = 'userProfiles';

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

// Storage
const storage = getStorage();

export const categories = [
	'Doprava',
	'Příroda',
	'Infrastruktura',
	'Ine'
] as const;
export type Category = typeof categories[number];

export type Problem = {
	title: string;
	description: string;
	author: string;
	location: string;
	created: Timestamp;
	resolved: Timestamp | null;
	category: Category;
};

export type ProblemWithId = { id: string } & Problem;

export const getProblem = async (id: string) => {
	const res = await getDoc(doc(db, PROBLEMS, id));
	return { ...res.data(), id } as ProblemWithId;
};

const problemsCollection = collection(
	db,
	PROBLEMS
) as CollectionReference<Problem>;

/**
 * Uploads problem to the databse
 * @param problem problem to upload
 * @returns id of added problem
 */
export const addProblem = async (problem: Problem) =>
	(await addDoc(problemsCollection, problem)).id;

export const getLastProblems = async (limited: number) => {
	const q = query(
		problemsCollection,
		orderBy('created', 'desc'),
		limit(limited)
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map(doc => {
		const problem = doc.data() as Problem;
		const id = doc.id;
		const problemWithId = { id, ...problem };
		return problemWithId as ProblemWithId;
	});
};

export const uploadImage = async (image: File) => {
	await uploadBytes(ref(storage, `${IMAGES}${image.name}`), image);
};

export const getImage = async (id: string) =>
	await getDownloadURL(ref(storage, `${IMAGES}${id}.jpg`));

export const resolveProblem = async (id: string) => {
	await updateDoc(doc(db, PROBLEMS, id), { resolved: Timestamp.now() });
};

// -------------------- USER PROFILE ----------------------
export type UserProfile = {
	email: string;
	name: string;
	surname: string;
};

const profileCollection = collection(
	db,
	USER_PROFILES
) as CollectionReference<UserProfile>;

export const getUserProfile = async (email: string) => {
	try {
		// todo tady je problem
		console.log(email);
		const res = await getDoc(doc(db, USER_PROFILES, email));
		console.log(res);
		if (res.exists()) {
			return res.data() as UserProfile;
		} else {
			// todo tohle se provadi
			console.log('Neexi suje pico');
		}
	} catch (err) {
		console.error(err);
		return undefined;
	}
};

export const updateUserProfile = async (
	email: string,
	name: string,
	surname: string
) => {
	await updateDoc(doc(db, USER_PROFILES, email), {
		name,
		surname
	});
};

export const addUserProfile = async (userProfile: UserProfile) =>
	await setDoc(doc(db, USER_PROFILES, userProfile.email), {
		name: userProfile.name,
		surname: userProfile.surname
	});
