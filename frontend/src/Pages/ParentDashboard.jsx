import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../url/base';
import RecordButton from '../Components/RecordButton';

const ParentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/parent/children`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch linked children');
      const data = await response.json();
      setChildren(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChild = async () => {
    if (!inviteCode) return;
    try {
      setLinking(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/parent/link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to link child');

      setInviteCode('');
      await fetchChildren();
    } catch (err) {
      setError(err.message);
    } finally {
      setLinking(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading Dashboard...</div>;
  }

  return (
    <div className="md:px-[9rem] pb-[4rem] font-spacegroteskmedium min-h-screen">
      <div className="mb-10 mt-10">
        <h1 className="text-4xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-gray-600">Monitor your child's learning progress in NeuroAI.</p>
      </div>

      <div className="bg-blue-50 p-8 rounded-2xl mb-12 border-2 border-blue-100">
        <h2 className="text-xl font-semibold mb-4">Link a Student Account</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Invite Code (e.g. A1B2C3)"
              className="flex-1 p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            />
            <RecordButton
              bgColor="#0984E3"
              text={linking ? "Linking..." : "Link Child"}
              onClickHandler={handleLinkChild}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm font-medium">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {children.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 text-xl">
            No students linked yet. Use the invite code to connect with your child.
          </div>
        ) : (
          children.map((child) => (
            <div key={child.student._id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img src={child.student.picture} alt={child.student.name} className="w-16 h-16 rounded-full" />
                <div>
                  <h3 className="text-xl font-bold">{child.student.name}</h3>
                  <p className="text-gray-500 text-sm">Grade: {child.student.grade_level || 'N/A'}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <RecordButton
                  bgColor="#89D85D"
                  text="View Progress"
                  onClickHandler={() => navigate(`/parent/student/${child.student._id}`)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
