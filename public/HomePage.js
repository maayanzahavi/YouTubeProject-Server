import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import VideoCollection from '../VideoCollection/VideoCollection';
import './HomePage.css';

const HomePage = ({ isDarkMode, setIsDarkMode }) => {
  const [originalVideoList, setOriginalVideoList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
          const res = await fetch('http://localhost:8200/api/videos/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setOriginalVideoList(data);
        setVideoList(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const doSearch = (query) => {
    if (query.trim() === '') {
      setVideoList(originalVideoList);
    } else {
      setVideoList(originalVideoList.filter((video) => video.title.toLowerCase().includes(query.toLowerCase())));
    }
    navigate('/YouTube/home');
  };

  return (
    <div className="main-screen">
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} doSearch={doSearch} />
      <div className="main-content">
        <div className="video-content">
          <VideoCollection videos={videoList} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
