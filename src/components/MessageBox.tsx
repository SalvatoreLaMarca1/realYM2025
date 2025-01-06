

 import { useEffect } from 'react';
import './MessageBox.css'
import { db } from './firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

let index = 0;
let messageText = document.getElementById("statementArea")
let date = document.getElementById("date")

function MessageBox() {
    useEffect(() => {
        fetchDocuments()
        checkButtons()
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

// on load go to the highest day that is not greater than the current day
function setFirstDay() {
    while(!checkDate()) {
        index++;
    }
    index--;
    console.log(index)
    setMessage()
    checkButtons()
}

// check what the date is -- return true if the date is ahead of current day
function checkDate() {
    let todayDate = new Date();
    console.log(todayDate.toDateString())

    if(messageDates[index] >= new Date())
        return true

    return false
}

// actions on buttons
function checkButtons() {
    const backButton = document.getElementById("backButton") as HTMLButtonElement
    const nextButton = document.getElementById("nextButton") as HTMLButtonElement

    console.log(messageDates[index])
    console.log(messageDates[index] > new Date())

    if(checkDate()) {
        nextButton.disabled = true
        nextButton.style.backgroundColor = "grey"
        return
    }

    if(index <= 0) {
        changeColors(nextButton, backButton)
    } else if (index >= messagesObjects.length-1 ) {
        changeColors(backButton, nextButton)
    } 
    else {
        backButton.disabled = false
        nextButton.disabled = false
        backButton.style.backgroundColor = "pink"
        nextButton.style.backgroundColor = "pink"
    }
}

function changeColors(onButton:HTMLButtonElement, offButton:HTMLButtonElement) {
    offButton.disabled = true
    offButton.style.backgroundColor = "grey"
    onButton.disabled = false
    onButton.style.backgroundColor = "pink"
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

    messageText = document.getElementById("statementArea");
    date = document.getElementById("date");


    console.log(checkDate())

    if(checkDate()) {
        if(messageText)
            messageText.innerHTML = "You have to wait for tomorrow"

        if(date) 
            date.innerHTML = "Till Next Time"
        return
    }
    
    if(messageText)
        messageText.innerHTML = messagesObjects[index].message

    if(date) 
        date.innerHTML = messagesObjects[index].date

}

interface message {
    id: string;
    date: string;
    message: string;
}

let messagesObjects: message[] = []
let messageDates: Date[] = []

let fetchInProgress = false;


    const fetchDocuments = async () => {
        console.log("Fetching documents...")

        // insurse only pushing one set of documents
        if(fetchInProgress) return;
        fetchInProgress = true

        messagesObjects = []
        messageDates = []

        const snapshot = await getDocs(collection(db, "test-collection")) // using test collection rn --> switch to statements for production
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

        console.log(messagesObjects)
        
        // set the <p> to the first day here because it will run only once --> or should...
        setFirstDay()
    }
    
    
// }

export default MessageBox