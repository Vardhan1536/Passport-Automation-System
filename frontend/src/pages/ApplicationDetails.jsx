import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Calendar,
  User,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await axios.get(`/api/applications/${id}`);
      setApplication(response.data.data.application);
    } catch (error) {
      console.error('Failed to fetch application:', error);
      toast.error('Failed to load application details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    try {
      await axios.post(`/api/applications/${id}/submit`);
      toast.success('Application submitted successfully!');
      fetchApplication(); // Refresh data
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    }
  };

  const handlePayment = async () => {
    try {
      await axios.post(`/api/applications/${id}/payment`);
      toast.success('Payment processing initiated. You will be notified once completed.');
      setTimeout(() => {
        fetchApplication(); // Refresh after 3 seconds
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'draft': { class: 'bg-gray-100 text-gray-800', text: 'Draft' },
      'submitted': { class: 'status-submitted', text: 'Submitted' },
      'under_verification': { class: 'status-under-verification', text: 'Under Verification' },
      'police_verification': { class: 'status-police-verification', text: 'Police Verification' },
      'approved': { class: 'status-approved', text: 'Approved' },
      'rejected': { class: 'status-rejected', text: 'Rejected' },
      'dispatched': { class: 'status-dispatched', text: 'Dispatched' }
    };
    
    const config = statusConfig[status] || statusConfig['draft'];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {application.applicationNumber}
              </h1>
              <p className="text-gray-600">
                {application.personalInfo.firstName} {application.personalInfo.lastName}
              </p>
            </div>
            <div className="text-right">
              {getStatusBadge(application.status)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {application.status === 'draft' && (
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to Submit?</h3>
                <p className="text-gray-600">Review your application and submit it for processing</p>
              </div>
              <button
                onClick={handleSubmitApplication}
                className="btn-primary"
              >
                Submit Application
              </button>
            </div>
          </div>
        )}

        {/* Payment Section */}
        {application.status === 'submitted' && application.payment?.status === 'pending' && (
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Required</h3>
                <p className="text-gray-600">Complete payment to proceed with your application</p>
                <p className="text-sm text-gray-500 mt-1">Amount: ₹{application.payment?.amount || 1500}</p>
              </div>
              <button
                onClick={handlePayment}
                className="btn-primary flex items-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Application Details */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">
                    {application.personalInfo.firstName} {application.personalInfo.middleName} {application.personalInfo.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Father's Name</label>
                  <p className="text-gray-900">{application.personalInfo.fatherName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mother's Name</label>
                  <p className="text-gray-900">{application.personalInfo.motherName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">
                    {new Date(application.personalInfo.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Place of Birth</label>
                  <p className="text-gray-900">{application.personalInfo.placeOfBirth}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900 capitalize">{application.personalInfo.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Marital Status</label>
                  <p className="text-gray-900 capitalize">{application.personalInfo.maritalStatus}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Occupation</label>
                  <p className="text-gray-900">{application.personalInfo.occupation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Education</label>
                  <p className="text-gray-900 capitalize">{application.personalInfo.education}</p>
                </div>
                {application.personalInfo.spouseName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Spouse's Name</label>
                    <p className="text-gray-900">{application.personalInfo.spouseName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Name</label>
                  <p className="text-gray-900">{application.personalInfo.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relationship</label>
                  <p className="text-gray-900">{application.personalInfo.emergencyContact.relationship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-900">{application.personalInfo.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Present Address</h3>
                <div className="space-y-2">
                  <p className="text-gray-900">{application.addressInfo.presentAddress.street}</p>
                  <p className="text-gray-900">
                    {application.addressInfo.presentAddress.city}, {application.addressInfo.presentAddress.state}
                  </p>
                  <p className="text-gray-900">
                    {application.addressInfo.presentAddress.pincode}, {application.addressInfo.presentAddress.country}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Permanent Address</h3>
                <div className="space-y-2">
                  <p className="text-gray-900">{application.addressInfo.permanentAddress.street}</p>
                  <p className="text-gray-900">
                    {application.addressInfo.permanentAddress.city}, {application.addressInfo.permanentAddress.state}
                  </p>
                  <p className="text-gray-900">
                    {application.addressInfo.permanentAddress.pincode}, {application.addressInfo.permanentAddress.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">ID Proof</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Address Proof</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Passport Photo</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Signature</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Biometric Data */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Biometric Data</h2>
            <div className="flex items-center">
              {application.biometricData?.captured ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-green-600 font-medium">Biometric data captured</p>
                    <p className="text-sm text-gray-500">
                      Captured on {new Date(application.biometricData.capturedAt).toLocaleDateString()}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="w-6 h-6 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-yellow-600 font-medium">Biometric data pending</p>
                    <p className="text-sm text-gray-500">Please complete biometric capture</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-gray-900">₹{application.payment?.amount || 1500}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className={`font-medium ${
                  application.payment?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {application.payment?.status === 'paid' ? 'Paid' : 'Pending'}
                </p>
              </div>
              {application.payment?.transactionId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                  <p className="text-gray-900">{application.payment.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status History */}
          {application.statusHistory && application.statusHistory.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Status History</h2>
              <div className="space-y-4">
                {application.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{history.status}</p>
                      <p className="text-sm text-gray-500">{history.remarks}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(history.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remarks */}
          {application.remarks && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Remarks</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">{application.remarks}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;

