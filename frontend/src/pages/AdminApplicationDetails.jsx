import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  MapPin,
  FileText,
  CreditCard,
  Shield,
  Save
} from 'lucide-react';

const AdminApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [policeStatus, setPoliceStatus] = useState('');
  const [policeRemarks, setPoliceRemarks] = useState('');
  const [policeVerifiedBy, setPoliceVerifiedBy] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await axios.get(`/api/admin/applications/${id}`);
      const app = response.data.data.application;
      setApplication(app);
      setStatus(app.status);
      setRemarks(app.remarks || '');
      setPoliceStatus(app.policeVerification?.status || 'pending');
      setPoliceRemarks(app.policeVerification?.remarks || '');
      setPoliceVerifiedBy(app.policeVerification?.verifiedBy || '');
    } catch (error) {
      console.error('Failed to fetch application:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await axios.put(`/api/admin/applications/${id}/status`, {
        status,
        remarks
      });
      toast.success('Application status updated successfully');
      fetchApplication(); // Refresh data
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePoliceVerificationUpdate = async () => {
    setIsUpdating(true);
    try {
      await axios.put(`/api/admin/applications/${id}/police-verification`, {
        status: policeStatus,
        remarks: policeRemarks,
        verifiedBy: policeVerifiedBy
      });
      toast.success('Police verification status updated successfully');
      fetchApplication(); // Refresh data
    } catch (error) {
      console.error('Failed to update police verification:', error);
      toast.error(error.response?.data?.message || 'Failed to update police verification');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'submitted': { class: 'status-submitted', text: 'Submitted' },
      'under_verification': { class: 'status-under-verification', text: 'Under Verification' },
      'police_verification': { class: 'status-police-verification', text: 'Police Verification' },
      'approved': { class: 'status-approved', text: 'Approved' },
      'rejected': { class: 'status-rejected', text: 'Rejected' },
      'dispatched': { class: 'status-dispatched', text: 'Dispatched' }
    };
    
    const config = statusConfig[status] || { class: 'bg-gray-100 text-gray-800', text: status };
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Applications
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                    View
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Address Proof</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    View
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Passport Photo</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    View
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Signature</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Update Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_verification">Under Verification</option>
                    <option value="police_verification">Police Verification</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="dispatched">Dispatched</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="input-field"
                    placeholder="Add remarks or comments..."
                  />
                </div>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Police Verification */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Police Verification
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Verification Status</label>
                  <select
                    value={policeStatus}
                    onChange={(e) => setPoliceStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="pending">Pending</option>
                    <option value="cleared">Cleared</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Verified By</label>
                  <input
                    type="text"
                    value={policeVerifiedBy}
                    onChange={(e) => setPoliceVerifiedBy(e.target.value)}
                    className="input-field"
                    placeholder="Officer name or ID"
                  />
                </div>
                <div>
                  <label className="form-label">Remarks</label>
                  <textarea
                    value={policeRemarks}
                    onChange={(e) => setPoliceRemarks(e.target.value)}
                    rows={3}
                    className="input-field"
                    placeholder="Police verification remarks..."
                  />
                </div>
                <button
                  onClick={handlePoliceVerificationUpdate}
                  disabled={isUpdating}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Verification
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Application Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Application Type:</span>
                  <p className="font-medium capitalize">{application.applicationType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Priority:</span>
                  <p className="font-medium capitalize">{application.priority}</p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Payment:</span>
                  <p className={`font-medium ${
                    application.payment?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {application.payment?.status === 'paid' ? 'Paid' : 'Pending'}
                  </p>
                </div>
                {application.payment?.transactionId && (
                  <div>
                    <span className="text-gray-500">Transaction ID:</span>
                    <p className="font-medium text-xs">{application.payment.transactionId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationDetails;

