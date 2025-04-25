import React, { useContext, useState, useRef, useEffect } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import aiGif from '../../assets/chatbot.gif';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';


const Main = () => {
  const { 
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input
  } = useContext(Context);
  
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk(); // Add this line
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCardClick = (promptType) => {
    if (!isSignedIn) {
      alert('Please sign in to use this feature');
      return;
    }
    
    let prompt = '';
    
    const promptMap = {
      timetable: "Generate a well-structured time-table for a college student studying Computer Science. Include time slots for classes, self-study, meals, exercise, and leisure. Make sure to allocate time for 8 hours of sleep.",
      tasks: "Create a prioritized to-do list for today with the following categories: Urgent & Important, Important but Not Urgent, Urgent but Not Important, and Neither. Include 3-5 tasks in each category.",
      brainstorm: "Help me brainstorm innovative ideas for a new web application that combines AI with productivity tools. List 5 potential concepts with brief descriptions of their features and target audience.",
      motivate: "Give me an inspiring motivational message to start my day. Include a famous quote, a short story about overcoming challenges, and practical advice for staying focused on my goals."
    };
    
    prompt = promptMap[promptType] || "Hello, how can you help me today?";

    setInput(prompt);
    onSent(prompt);
  };

  return (
    <div className='main'>
      <div className="nav">
        <p>Dron</p>
        <div className="user-section" ref={dropdownRef}>
          {isSignedIn ? (
            <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
              <img 
                src={user.imageUrl || assets.user_icon} 
                alt="User profile" 
                className="profile-image"
              />
              {showDropdown && (
    <div className="dropdown-menu">
      <div className="user-info">
        <img 
          src={user.imageUrl || assets.user_icon} 
          alt="User" 
          className="dropdown-image"
        />
        <div>
          <p className="user-name">{user.fullName || 'User'}</p>
          <p className="user-email">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
      <div className="dropdown-item" onClick={() => setShowDropdown(false)}>
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="dropdown-item">
        <Link to="/settings" className="dropdown-link">
          Settings
        </Link>
      </div>
      <div className="dropdown-item">
        <Link to="/help" className="dropdown-link">
          Help & FAQ
        </Link>
      </div>
      <div className="dropdown-divider"></div>
      <div className="dropdown-item">
        <button 
          className="logout-button" 
          onClick={() => {
            signOut(() => window.location.href = '/sign-in');
            localStorage.clear();
          }}
        >
          Log out
        </button>
      </div>
    </div>
  )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/sign-in" className="auth-button">Sign In</Link>
              <Link to="/sign-up" className="auth-button">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
      <div className="main-container">
        {!isSignedIn ? (
          <div className="auth-message">
            <h2>Welcome to Dron</h2>
            <p>Please sign in to access all features</p>
          </div>
        ) : showResult ? (
          <div className="result">
            <div className='result-title'>
              <img src={assets.user_icon} alt="User" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="AI assistant" />
              {loading ? (
                <div className="loader">
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="header-content">
              <div className="gif-container">
                <img src={aiGif} alt="AI Animation" className="centered-gif" />
              </div>
              <div className="greet">
                <p><span>Hello, {user?.firstName && `, ${user.firstName}`}</span></p>
                <p>How can I help you today?</p>
              </div>
            </div>
            <div className="cards">
              <div 
                className="card" 
                role="button"
                tabIndex="0"
                onClick={() => handleCardClick('timetable')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick('timetable');
                  }
                }}
              >
                <p>Generate Time-Table</p>
                <img src={assets.compass_icon} alt="Compass icon" />
              </div>
              <div 
                className="card" 
                role="button"
                tabIndex="0"
                onClick={() => handleCardClick('tasks')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick('tasks');
                  }
                }}
              >
                <p>Daily Tasks</p>
                <img src={assets.bulb_icon} alt="Bulb icon" />
              </div>
              <div 
                className="card" 
                role="button"
                tabIndex="0"
                onClick={() => handleCardClick('brainstorm')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick('brainstorm');
                  }
                }}
              >
                <p>Brainstorming Ideas</p>
                <img src={assets.message_icon} alt="Message icon" />
              </div>
              <div 
                className="card" 
                role="button"
                tabIndex="0"
                onClick={() => handleCardClick('motivate')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick('motivate');
                  }
                }}
              >
                <p>Motivate Me</p>
                <img src={assets.code_icon} alt="Code icon" />
              </div>
            </div>
          </>
        )}

        {isSignedIn && (
          <div className="main-bottom">
            <div className="search-box">
              <input 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && input && onSent()} 
                value={input} 
                type="text" 
                placeholder='Enter a prompt here' 
              />
              <div>
                <img src={assets.gallery_icon} width={30} alt="Gallery" />
                <img src={assets.mic_icon} width={30} alt="Microphone" />
                {input && (
                  <img 
                    onClick={() => onSent()} 
                    src={assets.send_icon} 
                    width={30} 
                    alt="Send" 
                  />
                )}
              </div>
            </div>
            <p className="bottom-info">
              Dron may display inaccurate info, including about people, so double-check its responses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;