import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Vote,
  UserPlus,
  Mail,
  CheckCircle,
  Info,
  ArrowRight,
  Lock,
  Globe,
  CheckSquare
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
const EVotingInterface = () => {
  const [step, setStep] = useState(1);
  const [commonName, setCommonName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("voter");
  const navigate = useNavigate();

  const ADMIN_EMAILS = ["admin@evoting.com", "root@evoting.com"];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      
      AOS.init({
        duration: 1000,
        once: true
      });
    }
  }, []);

  const handleRegistration = async () => {
    try {
      if (userType === "admin" && !ADMIN_EMAILS.includes(email)) {
        toast.error("Unauthorized admin email");
        return;
      }

      const endpoint = userType === "admin"
        ? "https://e-voting-platform.onrender.com/api/register-admin"
        : "https://e-voting-platform.onrender.com/api/register-voter";

      const response = await axios.post(endpoint, {
        commonName,
        email,
      });

      toast.success(response.data.message);

      if (userType === "admin") {
        navigate("/admin-dashboard");
      } else {
        setStep(2);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.details || error.response?.data?.error || "Registration Failed";
      toast.error(errorMsg);
    }
  };

  const enterVotingDashboard = () => {
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", commonName);
    navigate("/dashboard", {
      state: {
        email: email,
        name: commonName,
      },
    });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col md:flex-row">
      <Toaster position="top-right" />

      {/* Left Side - Features */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center"
        data-aos="fade-right"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
          >
            <Vote className="text-blue-600 h-12 w-12" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E-Voting Platform
            </h1>
          </motion.div>

          <div className="space-y-6">
            <motion.div 
              className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <ShieldCheck className="text-blue-500 h-8 w-8" />
              <div>
                <h3 className="font-semibold text-blue-700">Secure Voting</h3>
                <p className="text-blue-600/80">End-to-end encryption for maximum security</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <Globe className="text-purple-500 h-8 w-8" />
              <div>
                <h3 className="font-semibold text-purple-700">Accessible Anywhere</h3>
                <p className="text-purple-600/80">Vote from any device, anytime</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4 p-4 bg-pink-50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <CheckSquare className="text-pink-500 h-8 w-8" />
              <div>
                <h3 className="font-semibold text-pink-700">Transparent Process</h3>
                <p className="text-pink-600/80">Full audit trail and verification</p>
              </div>
            </motion.div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <p className="text-lg italic">
              "Empowering democracy through secure and accessible digital voting"
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Registration Form */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12"
        data-aos="fade-left"
      >
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          {step === 1 && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center space-x-6 mb-8">
                <motion.label 
                  className="relative inline-flex items-center cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                >
                  <input
                    type="radio"
                    value="voter"
                    checked={userType === "voter"}
                    onChange={() => setUserType("voter")}
                    className="hidden"
                  />
                  <div className={`px-6 py-3 rounded-lg flex items-center space-x-2 ${userType === 'voter' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    <UserPlus size={20} />
                    <span>Voter</span>
                  </div>
                </motion.label>

                <motion.label 
                  className="relative inline-flex items-center cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                >
                  <input
                    type="radio"
                    value="admin"
                    checked={userType === "admin"}
                    onChange={() => setUserType("admin")}
                    className="hidden"
                  />
                  <div className={`px-6 py-3 rounded-lg flex items-center space-x-2 ${userType === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                    <Lock size={20} />
                    <span>Admin</span>
                  </div>
                </motion.label>
              </div>

              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {userType === "admin" ? "Admin Registration" : "Voter Registration"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className=" text-gray-700 mb-2 flex items-center">
                    <UserPlus className="mr-2 text-blue-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={commonName}
                    onChange={(e) => setCommonName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder={userType === "admin" ? "Admin Full Name" : "Enter your full name"}
                  />
                </div>

                <div>
                  <label className=" text-gray-700 mb-2 flex items-center">
                    <Mail className="mr-2 text-purple-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder={userType === "admin" ? "Admin Email" : "Enter your email"}
                  />
                </div>
              </div>

              <motion.button
                onClick={handleRegistration}
                disabled={!commonName || !email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{userType === "admin" ? "Register Admin" : "Register Voter"}</span>
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              className="text-center space-y-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CheckCircle size={80} className="mx-auto text-green-500" />
              </motion.div>

              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent cursor-pointer">
                Registration Complete!
              </h2>

              <p className="text-gray-600">
                You're now ready to participate in secure digital voting.
              </p>

              <motion.button
                onClick={enterVotingDashboard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg transition duration-300 hover:shadow-lg couser-pointer"
              >
                Enter Voting Dashboard
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EVotingInterface;