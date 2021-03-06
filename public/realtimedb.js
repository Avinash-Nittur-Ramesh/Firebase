import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js"
import { getDatabase, ref, get, child, onValue, set, update, remove, push } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCrwPR75LU8IeYAycY6maRWT3CHrvbSG48",
    authDomain: "learning-812cb.firebaseapp.com",
    databaseURL: "https://learning-812cb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "learning-812cb",
    storageBucket: "learning-812cb.appspot.com",
    messagingSenderId: "915999462569",
    appId: "1:915999462569:web:d1f076dda12ce3170f45b8"
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
        const db = getDatabase(app);
        const mydb = ref(db);

        // Get data once from DB
        await get(child(mydb, "homeAutomation")).then((data) => {
            if (data.exists()) {
                console.log("Get: ", data.val());
            }
        }).catch((error) => {
            console.log("Error: " + error);
        });

        // Attach a value listener to get values on changing in DB
        let unsubscribeListener = await onValue(child(mydb, "homeAutomation"), async (data) => {
            if (data.exists()) {
                console.log("Value: ", data.val());
            }
        }, async (error) => {
            console.log("Error: " + error);
        });

        // Redefine an entry in DB
        await set(child(mydb, "homeAutomation/parRoom"), {
            "charger": true
        }).then(() => {
            console.log("Set operation was successfull");
        }).catch((error) => {
            console.log("Error: " + error);
        });

        // Insert a new sub-field in DB
        await update(child(mydb, "homeAutomation/parRoom"), {
            "light": true,
            "fan": false
        }).then(() => {
            console.log("Update operation was successfull");
        }).catch((error) => {
            console.log("Error: " + error);
        });

        // Insert a new field in DB
        await update(child(mydb, "homeAutomation"), {
            "varanda": {
                "fan": true,
                "light": false
            }
        }).then(() => {
            console.log("Update operation was successfull");
        }).catch((error) => {
            console.log("Error: " + error);
        });

        // Delete an existing field in DB
        await remove(child(mydb, "homeAutomation/varanda")).then(() => {
            console.log("Data was deleted successfully");
        }).catch((error) => {
            console.log("Error: " + error);
        });

        unsubscribeListener();

        // Delete an existing sub-field in DB
        await remove(child(mydb, "homeAutomation/parRoom/charger")).then(() => {
            console.log("Data was deleted successfully");
        }).catch((error) => {
            console.log("Error: " + error);
        });
    }
    else {
        console.log("Unable to authenticate. Please check sign in details");
    }
};

func(firebaseConfig);
console.log("Completed execution");