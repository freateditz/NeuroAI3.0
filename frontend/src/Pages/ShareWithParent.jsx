import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../url/base';
import NavButton from '../Components/NavButton';
import RecordButton from '../Components/RecordButton';
import { useState, useEffect } from 'react';

const ShareWithParent = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [linkedParents, setLinkedParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInviteData();
  }, []);

  const fetchInviteData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/parent/invite`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch invite data');
      const data = await response.json();
      setInviteCode(data.data.inviteCode);
      setLinkedParents(data.data.linkedParents || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    alert('Invite code copied to clipboard!');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-2xl">Error: {error}</div>;
  }

  return (
    <div className="md:px-[9rem] pb-[4rem] font-spacegroteskmedium min-h-screen">
      <div className="mb-10 mt-10 flex justify-between items-center">
        <h1 className="text-4xl font-bold">Share With a Parent</h1>
        <NavButton
          text="Back to Home"
          currLetter=""
          onClickHandler={() => navigate('/')}
        />
      </div>

      <div className="max-w-2xl mx-auto text-center mt-20">
        <div className="bg-white p-12 rounded-3xl shadow-xl border-4 border-blue-100">
          <h2 className="text-2xl font-semibold mb-6">Connect Your Account</h2>

          <p className="text-gray-600 mb-10 text-lg">
            Connect your NeuroAI account with your parent to allow them to monitor your learning progress and celebrate your achievements.
          </p>

          {linkedParents.length > 0 ? (
            <div className="bg-green-50 p-8 rounded-2xl mb-8 border-2 border-green-200">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl">✓</span>
                <h3 className="text-2xl font-bold text-green-700">Parent Connected</h3>
              </div>
              <div className="text-gray-700 text-lg">
                You are currently linked with: <br />
                <span className="font-bold">{linkedParents.map(p => p.name).join(', ')}</span>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4">Your Unique Invite Code</h3>
              <div className="bg-gray-100 p-8 rounded-2xl mb-8">
                <span className="text-6xl font-black tracking-widest text-blue-600">{inviteCode}</span>
              </div>

              <p className="text-gray-600 mb-10 text-lg">
                Ask a parent to enter this invite code in their NeuroAI account to link their account with yours.
              </p>

              <div className="flex justify-center gap-4">
                <RecordButton
                  bgColor="#0984E3"
                  text="Copy Invite Code"
                  onClickHandler={copyToClipboard}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareWithParent;
