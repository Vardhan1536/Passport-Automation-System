import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Search,
  Calendar,
  User,
  MapPin,
  Shield
} from 'lucide-react';

const StatusTracking = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications');
      setApplications(response.data.data.applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'dispatched':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'submitted':
      case 'under_verification':
      case 'police_verification':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'dispatched':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'submitted':
      case 'under_verification':
      case 'police_verification':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'draft': 'Draft',
      'submitted': 'Submitted',
      'under_verification': 'Under Verification',
      'police_verification': 'Police Verification',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'dispatched': 'Dispatched'
    };
    return statusMap[status] || status;
  };

  const getTimelineSteps = (application) => {
    const steps = [
      {
        id: 'submitted',
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully',
        completed: ['submitted', 'under_verification', 'police_verification', 'approved', 'rejected', 'dispatched'].includes(application.status),
        active: application.status === 'submitted'
      },
      {
        id: 'verification',
        title: 'Under Verification',
        description: 'Your application is being verified by our team',
        completed: ['under_verification', 'police_verification', 'approved', 'rejected', 'dispatched'].includes(application.status),
        active: application.status === 'under_verification'
      },
      {
        id: 'police',
        title: 'Police Verification',
        description: 'Police verification is in progress',
        completed: ['police_verification', 'approved', 'rejected', 'dispatched'].includes(application.status),
        active: application.status === 'police_verification'
      },
      {
        id: 'approved',
        title: 'Application Approved',
        description: 'Your passport application has been approved',
        completed: ['approved', 'dispatched'].includes(application.status),
        active: application.status === 'approved'
      },
      {
        id: 'dispatched',
        title: 'Passport Dispatched',
        description: 'Your passport has been dispatched',
        completed: application.status === 'dispatched',
        active: application.status === 'dispatched'
      }
    ];

    if (application.status === 'rejected') {
      steps.push({
        id: 'rejected',
        title: 'Application Rejected',
        description: application.remarks || 'Your application has been rejected',
        completed: true,
        active: true,
        isRejected: true
      });
    }

    return steps;
  };

  const filteredApplications = applications.filter(app =>
    app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${app.personalInfo.firstName} ${app.personalInfo.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Application Status</h1>
          <p className="text-gray-600">
            Monitor the progress of your passport applications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center mb-6">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="flex-1 border-0 focus:ring-0 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No applications found</p>
                  </div>
                ) : (
                  filteredApplications.map((application) => (
                    <div
                      key={application._id}
                      onClick={() => setSelectedApplication(application)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedApplication?._id === application._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(application.status)}
                          <span className="ml-2 font-medium text-gray-900">
                            {application.applicationNumber}
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {application.personalInfo.firstName} {application.personalInfo.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-2">
            {selectedApplication ? (
              <div className="space-y-6">
                {/* Application Header */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedApplication.applicationNumber}
                      </h2>
                      <p className="text-gray-600">
                        {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        <span className="ml-2">{getStatusText(selectedApplication.status)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Application Type:</span>
                      <p className="font-medium capitalize">{selectedApplication.applicationType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="font-medium">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Priority:</span>
                      <p className="font-medium capitalize">{selectedApplication.priority}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment:</span>
                      <p className="font-medium">
                        {selectedApplication.payment?.status === 'paid' ? 'Paid' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Timeline</h3>
                  <div className="space-y-6">
                    {getTimelineSteps(selectedApplication).map((step, index) => (
                      <div key={step.id} className="timeline-item">
                        <div className={`timeline-dot ${step.completed ? 'completed' : step.active ? 'active' : 'pending'}`}></div>
                        <div className="ml-6">
                          <div className="flex items-center">
                            <h4 className={`text-sm font-medium ${
                              step.completed ? 'text-green-600' : step.active ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {step.title}
                            </h4>
                            {step.completed && !step.isRejected && (
                              <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                            )}
                            {step.isRejected && (
                              <XCircle className="w-4 h-4 text-red-600 ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          {step.active && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Details */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Personal Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <span className="ml-2 font-medium">
                            {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Date of Birth:</span>
                          <span className="ml-2 font-medium">
                            {new Date(selectedApplication.personalInfo.dateOfBirth).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Gender:</span>
                          <span className="ml-2 font-medium capitalize">
                            {selectedApplication.personalInfo.gender}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Occupation:</span>
                          <span className="ml-2 font-medium">
                            {selectedApplication.personalInfo.occupation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Address Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Present Address:</span>
                          <p className="font-medium mt-1">
                            {selectedApplication.addressInfo.presentAddress.street},<br />
                            {selectedApplication.addressInfo.presentAddress.city},<br />
                            {selectedApplication.addressInfo.presentAddress.state} - {selectedApplication.addressInfo.presentAddress.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                {selectedApplication.remarks && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">{selectedApplication.remarks}</p>
                    </div>
                  </div>
                )}

                {/* Police Verification */}
                {selectedApplication.policeVerification && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Police Verification</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-2 font-medium ${
                          selectedApplication.policeVerification.status === 'cleared' ? 'text-green-600' :
                          selectedApplication.policeVerification.status === 'failed' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {selectedApplication.policeVerification.status.charAt(0).toUpperCase() + 
                           selectedApplication.policeVerification.status.slice(1)}
                        </span>
                      </div>
                      {selectedApplication.policeVerification.verifiedBy && (
                        <div>
                          <span className="text-gray-500">Verified By:</span>
                          <span className="ml-2 font-medium">
                            {selectedApplication.policeVerification.verifiedBy}
                          </span>
                        </div>
                      )}
                      {selectedApplication.policeVerification.remarks && (
                        <div>
                          <span className="text-gray-500">Remarks:</span>
                          <p className="font-medium mt-1">
                            {selectedApplication.policeVerification.remarks}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Application</h3>
                <p className="text-gray-600">
                  Choose an application from the list to view its status and timeline
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusTracking;

