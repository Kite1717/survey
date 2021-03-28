
import React,{useEffect} from 'react'
import './App.css';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar'
import {store} from './firebase'
import RoundInfo from './components/RoundInfo';


function App() {


  const getUsers =  async() =>{

    const response=store.collection('user');
    const data=await response.get();

    data.docs.forEach(item=>{
    console.log(item.data(),"wwwwwwwwwwwww")
    })

  }
  useEffect( ()=>{

    getUsers()
    
  },[])

  return (
      <Container>
        <RoundInfo/>
        <Navbar/>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/PKwu15ldZ7k" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </Container>
  );
}

export default App;
