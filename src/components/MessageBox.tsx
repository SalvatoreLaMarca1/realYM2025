

 import './MessageBox.css'
import { db } from './firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

let index = 0;
let statements:string[] = ["Number zero test", "Number one test", "number two test", "Three Test bro"];
let message = document.getElementById("statementArea")

function MessageBox() {

    fetchDocuments()

  return (
    <div>
        <div className="message-box">
            <p id='statementArea'>This is a cool message about something</p>
        </div>
        <div className="holdButtons">
            <button onClick={decrementStatements}>Past Day</button>
            <button onClick={incrementStatements}>Next Day</button>
        </div>
    </div>
  )
}



function incrementStatements() {
    index++
    if(index >= messagesObjects.length) index = statements.length-1
    setMessage()
}

function decrementStatements() {
    index--
    if(index < 0) index = 0
    setMessage()
}

function setMessage() {
    message = document.getElementById("statementArea");
    if(message)
        message.innerHTML = messagesObjects[index].message

    console.log(message);

    console.log(messagesObjects[index].message)
}

interface message {
    id: string;
    date: string;
    message: string;
}

let messagesObjects: message[] = []



// function getFirebase() {

    const fetchDocuments = async () => {
        const snapshot = await getDocs(collection(db, "statements"))
        snapshot.forEach((doc) => {
            const data = doc.data()

            const messageObject: message = {
                id: doc.id,
                date: data.date.toDate().toString(),
                message: data.message,
            }

            messagesObjects.push(messageObject)
        })

        console.log(messagesObjects)
    }
    
    
// }

export default MessageBox