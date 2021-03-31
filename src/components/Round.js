import React,{useEffect,useState} from 'react'
import { store } from "../firebase";
import Iframe from "react-iframe";
import { Col} from "react-bootstrap";

function Round() {

    const [videos,setVideos] = useState([])
    const getVideos =  async() =>{

        const response=store.collection('videos');
        const data=await response.get();
    
        let temp = []
        data.docs.forEach(item=>{
            temp.push(item.data())
        })
        setVideos(temp)
      }
      useEffect( ()=>{
    
        getVideos()
        
      },[])
    return (
        <>
        {
            videos.map((item,i)=>{
                return(
                    <Col key = {i}>
                    <Iframe
                      url={item.url}
                      width="400px"
                      height="300px"
                      id="myId"
                      className="myClassname"
                      display="initial"
                      position="relative"
                    />
                  </Col>
                )

            })
        }
            
        </>
    )
}

export default Round
