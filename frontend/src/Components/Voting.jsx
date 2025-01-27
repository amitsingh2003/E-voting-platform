import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  ArrowRight, 
  Info, 
  CheckCircle, 
  X, 
  User, 
  Award, 
  Shield, 
  ChevronRight,
  Clock,
  Users,
  Vote as VoteIcon
} from "lucide-react";
import { useLocation } from "react-router-dom";

const VotingDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [activeModalCandidate, setActiveModalCandidate] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [activeSection, setActiveSection] = useState("candidates");

  const location = useLocation();

  useEffect(() => {
    const savedUserEmail = localStorage.getItem("userEmail");
    const savedUserName = localStorage.getItem("userName");

    if (savedUserEmail) {
      setUserEmail(savedUserEmail);
      setUserName(savedUserName);
    } else {
      toast.error("User email not found. Please log in again.");
    }
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/candidates");
        setCandidates(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch candidates", error);
        setIsLoading(false);
        setError("Unable to load candidates. Please try again later.");
      }
    };

    fetchCandidates();
  }, []);

  const openVoteConfirmation = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleConfirmVote = async (selectedCandidate, userEmail) => {
    if (!userEmail) {
      toast.error("User email is required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/vote", {
        email: userEmail,
        candidateId: selectedCandidate._id,
      });

      toast.success("Vote cast successfully!");
      setSelectedCandidate(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Vote submission failed");
    }
  };

  const openCandidateModal = (candidate) => {
    setActiveModalCandidate(candidate);
    setShowCandidateModal(true);
  };

  const closeCandidateModal = () => {
    setShowCandidateModal(false);
    setActiveModalCandidate(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Election 2024
          </div>
          <div className="text-2xl text-gray-300">Loading Ballot...</div>
        </motion.div>
      </div>
    );
  }

  const NavButton = ({ icon: Icon, label, active, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all ${
        active 
          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30" 
          : "hover:bg-white/5"
      }`}
    >
      <Icon className={`${active ? "text-blue-400" : "text-gray-400"}`} size={24} />
      <span className={`${active ? "text-blue-400" : "text-gray-400"} font-medium`}>{label}</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Toaster position="top-center" />
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <VoteIcon className="text-blue-400" size={32} />
            <h1 className="text-2xl font-bold text-white">E-Voting Platform</h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
              <User className="text-blue-400" size={20} />
              <span className="text-gray-200">{userName || "Guest"}</span>
            </div>
          </motion.div>
        </div>
      </nav>

      <div className="pt-24 px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 space-y-6"
          >
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Election 2024
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Secure your future with a click. Every vote counts in shaping tomorrow.
            </p>
            
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <Users className="text-blue-400 mb-2" size={28} />
                <div className="text-3xl font-bold text-white mb-1">{candidates.length}</div>
                <div className="text-gray-400">Candidates</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <Clock className="text-purple-400 mb-2" size={28} />
                <div className="text-3xl font-bold text-white mb-1">24h</div>
                <div className="text-gray-400">Remaining</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <Shield className="text-pink-400 mb-2" size={28} />
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-gray-400">Secure</div>
              </motion.div>
            </div>
          </motion.header>

          {/* Candidates Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                data-aos="fade-up"
                className="group bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={candidate.photo || candidate.logo}
                    alt={candidate.name}
                    className="w-full h-80 object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openCandidateModal(candidate)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all"
                  >
                    <Info size={20} className="text-white" />
                  </motion.button>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold mb-2">{candidate.name}</h2>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <Award size={20} />
                      <span>{candidate.partyName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-300 mb-6 line-clamp-3">
                    {candidate.description}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openVoteConfirmation(candidate)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all flex items-center justify-center space-x-2 group"
                  >
                    <span>Cast Your Vote</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Candidate Modal */}
          <AnimatePresence>
            {showCandidateModal && activeModalCandidate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
                >
                  <div className="relative">
                    <img
                      src={activeModalCandidate.photo || activeModalCandidate.logo}
                      alt={activeModalCandidate.name}
                      className="w-full h-96 object-cover brightness-75 rounded-t-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeCandidateModal}
                      className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-3 rounded-full"
                    >
                      <X size={20} className="text-white" />
                    </motion.button>

                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h2 className="text-4xl font-bold mb-2">
                        {activeModalCandidate.name}
                      </h2>
                      <div className="flex items-center space-x-2 text-blue-400">
                        <Award size={24} />
                        <span className="text-xl">{activeModalCandidate.partyName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {activeModalCandidate.description}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        closeCandidateModal();
                        openVoteConfirmation(activeModalCandidate);
                      }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all flex items-center justify-center space-x-2 group"
                      >
                        <span>Vote for {activeModalCandidate.name}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
  
            {/* Vote Confirmation Modal */}
            <AnimatePresence>
              {selectedCandidate && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-lg w-full p-8 border border-white/20"
                  >
                    <div className="text-center space-y-6">
                      <div className="mx-auto w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CheckCircle className="text-blue-400" size={40} />
                      </div>
  
                      <h2 className="text-3xl font-bold text-white">Confirm Your Vote</h2>
                      
                      <p className="text-gray-300">
                        You are about to cast your vote for <span className="text-blue-400 font-semibold">{selectedCandidate.name}</span>. 
                        This action cannot be undone.
                      </p>
  
                      <div className="bg-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between text-gray-300">
                          <span>Candidate:</span>
                          <span className="font-semibold text-white">{selectedCandidate.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-300">
                          <span>Party:</span>
                          <span className="font-semibold text-white">{selectedCandidate.partyName}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-300">
                          <span>Your Email:</span>
                          <span className="font-semibold text-white">{userEmail}</span>
                        </div>
                      </div>
  
                      <div className="flex space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCandidate(null)}
                          className="flex-1 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                        >
                          Cancel
                        </motion.button>
  
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleConfirmVote(selectedCandidate, userEmail)}
                          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all flex items-center justify-center space-x-2 group"
                        >
                          <span>Confirm Vote</span>
                          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
  
            {/* Error Message */}
            {error && (
              <div className="text-center mt-8">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default VotingDashboard;