import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js"
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, writeBatch, deleteDoc, onSnapshot, query } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCrwPR75LU8IeYAycY6maRWT3CHrvbSG48",
    authDomain: "learning-812cb.firebaseapp.com",
    databaseURL: "https://learning-812cb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "learning-812cb",
    storageBucket: "learning-812cb.appspot.com",
    messagingSenderId: "915999462569",
    appId: "1:915999462569:web:d1f076dda12ce3170f45b8",
    measurementId: "G-9GQ4KBD8NS"
};

const func = async (firebaseConfig) => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Enable Google Analytics
    const analytics = getAnalytics(app);
    // Authenticate User
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let authenticated = false;
    await signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log("Welcome: " + user.displayName);
        authenticated = true;
    }).catch((error) => {
        console.log("Error: " + error);
    });

    if (authenticated) {
        const db = getFirestore();
        const mycollection = collection(db, "homeAutomation");

        // Get all docs from DB
        await getDocs(mycollection).then((result) => {
            result.forEach((myDoc) => {
                console.log(myDoc.id, myDoc.data());
            });
        }).catch((error) => {
            console.log("Error: ", error)
        });

        // Get one particular doc from DB
        await getDoc(doc(mycollection, "myRoom")).then((result) => {
            if (result.exists()) {
                console.log(result.id, result.get("fan"));
                console.log(result.id, result.data());
            }
            else {
                console.log("The document does not exist");
            }
        }).catch((error) => {
            console.log("Error: ", error);
        });

        // Attach a value listener to get values on changing in DB
        const unsubListener = await onSnapshot(query(mycollection), (snapshot) => {
            console.log("Listener: ");
            snapshot.forEach((arrayElement) => {
                console.log(arrayElement.id, arrayElement.data())
            });
        }, (error) => {
            console.log("Listener Error: ", error);
        });

        // Update a document in DB
        await updateDoc(doc(mycollection, "myRoom"), {
            "fan": true
        }).then(() => {
            console.log("Update operation was successful");
        }).catch((error) => {
            console.log("Error: ", error);
        });

        // Insert a new document in DB
        await setDoc(doc(mycollection, "parRoom"), {
            "fan": false,
            "light": false
        }).then(() => {
            console.log("Set operation was successful");
        }).catch((error) => {
            console.log("Error: ", error);
        });

        // Unsubscribe to changes in DB
        unsubListener();

        // Batch insert documents in DB
        const wb = writeBatch(db);
        await wb.set(doc(mycollection, "balcony"), {
            "fan": false,
            "light": false
        }).set(doc(mycollection, "gParRoom"), {
            "fan": false,
            "light": true
        }).set(doc(mycollection, "hall"), {
            "fan": true,
            "light": true
        }).set(doc(mycollection, "varanda"), {
            "fan": false,
            "light": true
        }).commit().then(() => {
            console.log("Batch operation was successful");
        }).catch((error) => {
            console.log("Error: ", error);
        });

        // Delete an existing field in DB
        await deleteDoc(doc(mycollection, "varanda")).then(() => {
            console.log("Delete operation was successful");
        }).catch((error) => {
            console.log("Error: ", error);
        });
    }
    else {
        console.log("Unable to authenticate. Please check sign in details");
    }
};

func(firebaseConfig);
console.log("Completed execution");