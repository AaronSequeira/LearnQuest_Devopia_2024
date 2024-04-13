import React, { createContext, useReducer } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Sidebar, Navbar } from './components';
import { Home, Profile, CreateCampaign, CampaignDetails, UserDonation, Search, Update, Dashboard } from './pages'
import { initialState , reducer } from './UseReducer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lookup from './pages/Lookup';
import Quiz from './pages/Quiz';
import Leaderoard from './pages/Leaderoard';
import Duel from './pages/Duel';
import Docs from './pages/Docs';
import DuelQuiz from './pages/DuelQuiz';
import Recommender from './pages/Recommender';


export const UserContext = createContext();

const App = () => {

  const [state , dispatch] = useReducer( reducer , initialState )
  //dispacth is used to change the state to check wether user is loggen or not
  return (
    <UserContext.Provider value={{state , dispatch}}>
      <div className="relative min-w-full sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>

        <div className="flex-1 max-sm:w-full max-w-[1280px] min-w-screen mx-auto sm:pr-5">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recommender" element={<Recommender />} />
            <Route path="/profile" element={<Dashboard />} />
         </Routes>
          
        </div>
        <ToastContainer
            position="bottom-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
      </div>
    </UserContext.Provider>
  )
}

export default App