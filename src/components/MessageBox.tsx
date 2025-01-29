
import { useEffect, useState, useRef } from 'react';
import './MessageBox.css';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Message {
    id: string;
    date: string;
    message: string;
}

function MessageBox() {
    const [index, setIndex] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageDates, setMessageDates] = useState<Date[]>([]);
    const [buttonsDisabled, setButtonsDisabled] = useState({ next: false, back: false });
    const messageTextRef = useRef<HTMLParagraphElement>(null);
    const dateRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        if (messages.length > 0 && messageDates.length > 0) {
            setFirstDay();
            updateButtonStates();
        }
    }, [messages, messageDates]);

    useEffect(() => {
        updateButtonStates();
        updateMessage();
    }, [index]);

    const fetchDocuments = async () => {
        const fetchedMessages: Message[] = [];
        const fetchedDates: Date[] = [];

        const snapshot = await getDocs(collection(db, 'test-collection')); // test-collection
        snapshot.forEach((doc) => {
            const data = doc.data();
            fetchedMessages.push({
                id: doc.id,
                date: data.date.toDate().toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }),
                message: data.message,
            });
            fetchedDates.push(data.date.toDate());
        });

        setMessages(fetchedMessages);
        setMessageDates(fetchedDates);
    };

    const setFirstDay = () => {
        let initialIndex = 0;
        while (initialIndex < messageDates.length && messageDates[initialIndex] <= new Date()) {
            initialIndex++;
        }
        initialIndex = Math.max(0, initialIndex - 1);
        setIndex(initialIndex);
    };

    const updateButtonStates = () => {
        const today = new Date();
        const isNextDisabled = index >= messages.length - 1 || messageDates[index] >= today;
        const isBackDisabled = index <= 0;



        setButtonsDisabled({ next: isNextDisabled, back: isBackDisabled });
    };

    const updateMessage = () => {
        const today = new Date();

        if (messageDates[index] >= today) {
            if (messageTextRef.current) messageTextRef.current.textContent = 'You have to wait for tomorrow';
            if (dateRef.current) dateRef.current.textContent = 'Till Next Time';
            return;
        }

        if (messageTextRef.current) messageTextRef.current.textContent = messages[index]?.message || '';
        if (dateRef.current) dateRef.current.textContent = messages[index]?.date || '';
    };

    const incrementStatements = () => {
        if (index < messages.length - 1) {
            setIndex(index + 1);
        }
    };

    const decrementStatements = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    return (
        <div className="message-block">
            <div className="message-box">
                <h3 id="date" ref={dateRef}></h3>
                <p id="statementArea" ref={messageTextRef}></p>
            </div>
            <div className="holdButtons">
                <button 
                    id="backButton" 
                    onClick={decrementStatements} 
                    disabled={buttonsDisabled.back}
                    className={buttonsDisabled.back ? 'button-disabled' : 'button-enabled'}>
                    Past Day
                </button>
                <button 
                    id="nextButton" 
                    onClick={incrementStatements} 
                    disabled={buttonsDisabled.next}
                    className={buttonsDisabled.next ? 'button-disabled' : 'button-enabled'}>
                    Next Day
                </button>
            </div>
        </div>
    );
}

export default MessageBox;
