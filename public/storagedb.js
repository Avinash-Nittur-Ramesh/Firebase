import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js"
import { getStorage, ref, listAll, list, uploadString, getBlob } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js"
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
        const storage = getStorage();
        const rootRef = ref(storage);

        // List all files or folders in DB
        await list(ref(rootRef)).then((result) => {
            result.prefixes.forEach((ele) => {
                console.log("Folders: " + ele.toString());
            });
            result.items.forEach((ele) => {
                console.log("Files: " + ele.toString());
            });
        }).catch((error) => {
            console.log("Error: ", error)
        });

        // Upload a string to DB
        await uploadString(ref(rootRef, "homeAutomation/string_data"), "Avinash is a good boy").then((result) => {
            console.log("Upload was successful");
        }).catch((eror) => {
            console.log("Error:", error);
        })

        // Download a file to DB
        await getBlob(ref(rootRef, "homeAutomation/string_data")).then((result) => {
            result.text().then((text) => {
                console.log("Downloaded content: ", text);
            });
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