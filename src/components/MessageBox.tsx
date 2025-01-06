

 import { useEffect } from 'react';
import './MessageBox.css'
import { db } from './firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

let index = 0;
let message = document.getElementById("statementArea")
let date = document.getElementById("date")

function MessageBox() {
    useEffect(() => {
        fetchDocuments()
    }, [])

  return (
    <div>
        <div className="message-box">
            <h3 id='date'></h3>
            <p id='statementArea'></p>
        </div>
        <div className="holdButtons">
            <button id="backButton" onClick={decrementStatements}>Past Day</button>
            <button id="nextButton" onClick={incrementStatements}>Next Day</button>
        </div>
    </div>
  )
}

// check what the date is 
function checkDate() {
    let todayDate = new Date();
    console.log(todayDate.toDateString())
}

// actions on buttons
function checkButtons() {
    const backButton = document.getElementById("backButton") as HTMLButtonElement
    const nextButton = document.getElementById("nextButton") as HTMLButtonElement

    if(messageDates[index] > new Date()) {
        console.log("This date is in the future")
        console.log(messageDates[index])
        console.log(new Date())
    }

    if(index <= 0) {
        backButton.disabled = true
        backButton.style.backgroundColor = "grey"
        nextButton.disabled = false
        nextButton.style.backgroundColor = "pink"
    } else if (index >= messagesObjects.length-1) {
        nextButton.disabled = true 
        nextButton.style.backgroundColor = "grey"
        backButton.disabled = false
        backButton.style.backgroundColor = "pink"
    } 
    else {
        backButton.disabled = false
        nextButton.disabled = false
        backButton.style.backgroundColor = "pink"
        nextButton.style.backgroundColor = "pink"
    }
}


function incrementStatements() {
    index++
    checkButtons()
    if(index >= messagesObjects.length) {
        index = messagesObjects.length-1
        return
    } 

    setMessage()
}

function decrementStatements() {
    index--
    checkButtons()
    if(index < 0) {
        index = 0
        return
    } 
    setMessage()
}

function setMessage() {
    message = document.getElementById("statementArea");
    if(message)
        message.innerHTML = messagesObjects[index].message

    date = document.getElementById("date");
    if(date) 
        date.innerHTML = messagesObjects[index].date

    checkDate()
}

interface message {
    id: string;
    date: string;
    message: string;
}

let messagesObjects: message[] = []
let messageDates: Date[] = []

let fetchInProgress = false;


// function getFirebase() {

    const fetchDocuments = async () => {
        console.log("Fetching documents...")

        // insurse only pushing one set of documents
        if(fetchInProgress) return;
        fetchInProgress = true

        messagesObjects = []
        messageDates = []

        const snapshot = await getDocs(collection(db, "statements"))
        snapshot.forEach((doc) => {
            const data = doc.data()

            const messageObject: message = {
                id: doc.id,
                date: data.date.toDate().toLocaleDateString('en-US', {
                    weekday: 'long', 
                    day: '2-digit', 
                    month: 'short',
                    year: 'numeric'
                }).toString(),
                message: data.message,
            }

            messagesObjects.push(messageObject)
            messageDates.push(data.date.toDate())
        })
        
        // set the <p> to the first day here because it will run only once --> or should...
        setMessage()
    }
    
    
// }

export default MessageBox