import React,{ useEffect, useState } from 'react';
import { FormControl, InputLabel, Input } from '@material-ui/core';
import Message from './components/Message/index';
import db from './config/firebase';
import firebase from 'firebase';
import FlipMove from 'react-flip-move';
import SendIcon from '@material-ui/icons/Send';
import {IconButton} from '@material-ui/core';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState();

  useEffect(() =>{
     db.collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot =>{
       setMessages(snapshot.docs.map(doc => (
        {
           id: doc.id, 
           message: doc.data()
        }
        )))
     })
  },[])
  useEffect(() =>{
    setUsername(prompt('Please enter your username: '));

  },[])

  const sendMessage = (event) =>{
    // all the logic send message goes
    event.preventDefault();
    db.collection('messages').add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setInput('');
  }
  return (
    <div className="App">
      <img width="100" src="https://facebookbrand.com/wp-content/uploads/2020/10/Logo_Messenger_NewBlurple-399x399-1.png?w=100&h=100" alt="Fire Messenger"/>
      <h1>🔥 Fire Messenger</h1>
      <h2>Welcome {username}</h2>
      <form className="app__form">
        <FormControl className="app__formControl">
          <InputLabel>Enter to message ...</InputLabel>
          <Input className="app__inputForm" placeholder="Enter a message ..." value={input} onChange={event => setInput(event.target.value) }/>
          <IconButton className="app__iconButton" disabled={!input} variant="outlined" color="primary" type="submit" onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>

      <FlipMove>
      {
        messages.map(({id, message}) => (
          <Message key={id} username={username} message={message} />
        ))
      }
      </FlipMove>
    </div>
  );
}

export default App;
