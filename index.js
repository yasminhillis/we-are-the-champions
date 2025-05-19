const publishBtn = document.getElementById('publish-btn');
const endorsementText = document.getElementById('endorsement-text');
const sender = document.getElementById('sender');
const receiver = document.getElementById('receiver');
import { getDatabase, ref, push, onValue, update } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

const appSettings = {
    databaseURL: "https://champions-d4fc8-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

const referenceInDB = ref(database, 'endorsements-v2')

const endorsementSection = document.getElementById('endorsements-section');


onValue(referenceInDB, function (snapshot) {
    console.log(snapshot.exists(), 'snapshot.exists()')
    endorsementSection.innerHTML = '';

    if (snapshot.exists()) {

        let endorsementsInDB = Object.entries(snapshot.val());
        endorsementsInDB = endorsementsInDB.reverse()

        for (let i = 0; i < endorsementsInDB.length; i++) {

            let [key, endorsementObj] = endorsementsInDB[i]
            let endorsement = document.createElement('div');
            endorsement.classList.add('endorsement-div')

            endorsement.innerHTML = `
            <h3 class="receiver">To ${endorsementObj.receiver}</h3>
            ${endorsementObj.text}
            <div class="container">
                <h3 class="sender">From ${endorsementObj.sender}</h3>
                <div class="likes-container">
                    <i id="heart" data-like=${key} class="${endorsementObj.isLiked ? 'bx bxs-heart' : 'bx bx-heart'}"></i>
                    <span id="likes-num">${endorsementObj.likes ? endorsementObj.likes : 0}</span>
                </div>
            </div>
            `;
            addLikes(key, endorsementObj)
            endorsementSection.append(endorsement);    
        }
        
    } else {
        endorsementSection.innerHTML = "No endorsements yet..."
        endorsementSection.classList.add('endorsement-section-empty')
    }
})

publishBtn.addEventListener('click', function () {
    const endorsement = {
        text: endorsementText.value,
        sender: sender.value,
        receiver: receiver.value,
        likes: 0,
        isLiked: false
    }

    push(referenceInDB, endorsement)
    endorsementText.value = ''
    sender.value = ''
    receiver.value = ''
})

function addLikes(id, obj) {
    document.addEventListener('click', (e) => {
        if (e.target.dataset.like === id) {
            let exactLocation = ref(database, `endorsements-v2/${id}`)
            update(exactLocation, { isLiked: !obj.isLiked });
            if (obj.isLiked) {
                update(exactLocation, { likes: obj.likes - 1 } )
            } else if (!obj.isLiked) {
                update(exactLocation, { likes: obj.likes + 1 } )
            }
        }
    })
}
