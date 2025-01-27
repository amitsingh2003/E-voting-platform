import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Vote,
  Award,
  Mail,
  User,
  Plus,
  RefreshCcw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminDashboard = () => {
  const [data, setData] = useState({
    users: [],
    candidates: [],
    results: {
      totalVotes: 0,
      candidates: [],
    },
    stats: {
      totalUsers: 0,
      votedUsers: 0,
    },
  });

  
    const [isRefreshing, setIsRefreshing] = useState(false);
  
    

  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    photo: "",
    partyName: "",
    logo: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, candidatesRes, resultsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/candidates"),
        fetch("/api/results"),
      ]);

      const users = await usersRes.json();
      const candidates = await candidatesRes.json();
      const results = await resultsRes.json();
      setIsRefreshing(true); 
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      setIsRefreshing(false); 

      setData({
        users,
        candidates,
        results,
        stats: {
          totalUsers: users.length,
          votedUsers: users.filter((user) => user.hasVoted).length,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCandidate),
      });

      if (response.ok) {
        setShowAddCandidate(false);
        setNewCandidate({
          name: "",
          photo: "",
          partyName: "",
          logo: "",
          description: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
    setLoading(false);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Election Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddCandidate(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Candidate</span>
          </button>
          <button
      onClick={fetchData}
      className="flex items-center cursor-pointer space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
    >
      <RefreshCcw
        className={`w-5 h-5 transition-transform ${
          isRefreshing ? "animate-spin" : ""
        }`}
      />
      <span>Refresh</span>
    </button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          data-aos="fade-up"
          className="bg-white rounded-lg shadow-md p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-4">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Registered
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {data.stats.totalUsers}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          data-aos="fade-up"
          data-aos-delay="100"
          className="bg-white rounded-lg shadow-md p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-4">
            <Vote className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Votes Cast</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {data.stats.votedUsers}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          data-aos="fade-up"
          data-aos-delay="200"
          className="bg-white rounded-lg shadow-md p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-4">
            <Award className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Voting Progress
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {data.stats.totalUsers > 0
                  ? `${Math.round(
                      (data.stats.votedUsers / data.stats.totalUsers) * 100
                    )}%`
                  : "0%"}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          data-aos="fade-up"
          data-aos-delay="300"
          className="bg-white rounded-lg shadow-md p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Votes</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {data.results.totalVotes}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          data-aos="fade-right"
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Vote Distribution
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.results.candidates}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="voteCount" fill="#4F46E5" name="Votes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          data-aos="fade-left"
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Vote Share
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data.results.candidates}
                  dataKey="voteCount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label
                >
                  {data.results.candidates.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Candidates Grid */}
      <motion.div
        data-aos="fade-up"
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Candidates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.candidates.map((candidate, index) => (
            <motion.div
              key={index}
              className="border rounded-lg p-4 hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={candidate.photo}
                  alt={candidate.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/64";
                  }}
                />
                <div>
                  <h3 className="font-semibold text-lg">{candidate.name}</h3>
                  <div className="flex items-center space-x-2">
                    <img
                      src={candidate.logo}
                      alt={candidate.partyName}
                      className="w-6 h-6"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/24";
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      {candidate.partyName}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                {candidate.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-medium text-blue-600">
                  Votes: {candidate.voteCount || 0}
                </span>
                <span className="text-sm text-gray-500">
                  {
                    data.results.candidates.find(
                      (c) => c.name === candidate.name
                    )?.percentage
                  }
                  % of total
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal for Adding Candidate */}
      {showAddCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Candidate</h2>
            <form onSubmit={handleAddCandidate}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Candidate Name"
                  className="w-full p-2 border rounded"
                  value={newCandidate.name}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Photo URL"
                  className="w-full p-2 border rounded"
                  value={newCandidate.photo}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, photo: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Party Name"
                  className="w-full p-2 border rounded"
                  value={newCandidate.partyName}
                  onChange={(e) =>
                    setNewCandidate({
                      ...newCandidate,
                      partyName: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Party Logo URL"
                  className="w-full p-2 border rounded"
                  value={newCandidate.logo}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, logo: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  value={newCandidate.description}
                  onChange={(e) =>
                    setNewCandidate({
                      ...newCandidate,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddCandidate(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Candidate"}
                </button>
              </div>
            </form>
          </motion.div>
          {/* Registered Voters Table */}
         
        </div>
      )}

      {/* Registered Voters Table */}
<motion.div
  data-aos="fade-up"
  className="bg-white rounded-lg shadow-md p-6"
>
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-gray-800">
      Registered Voters
    </h2>
    <div className="flex items-center space-x-2">
      <span className="flex items-center space-x-1 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span>{data.stats.votedUsers} Voted</span>
      </span>
      <span className="flex items-center space-x-1 text-red-600">
        <AlertTriangle className="w-4 h-4" />
        <span>{data.stats.totalUsers - data.stats.votedUsers} Not Voted</span>
      </span>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Username</span>
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Registration Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.users.map((user, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="hover:bg-gray-50 transition-colors"
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.username}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{user.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.hasVoted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <span className={`w-2 h-2 mr-2 rounded-full ${
                  user.hasVoted ? 'bg-green-400' : 'bg-red-400'
                }`}></span>
                {user.hasVoted ? 'Voted' : 'Not Voted'}
              </span>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>

    {/* Empty State */}
    {data.users.length === 0 && (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No registered voters are available at the moment.
        </p>
      </div>
    )}
  </div>

  {/* Pagination (Optional) */}
  {data.users.length > 0 && (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing {data.users.length} users
      </div>
      <div className="flex items-center space-x-2">
        <button className="px-3 py-1 border rounded hover:bg-gray-50">
          Previous
        </button>
        <button className="px-3 py-1 border rounded hover:bg-gray-50">
          Next
        </button>
      </div>
    </div>
  )}
</motion.div>
    </div>
  );
};

export default AdminDashboard;
