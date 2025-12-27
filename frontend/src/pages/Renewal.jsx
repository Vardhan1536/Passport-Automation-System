import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  RefreshCw, 
  FileText, 
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Renewal = () => {
  const [eligiblePassports, setEligiblePassports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    fetchEligiblePassports();
  }, []);

  const fetchEligiblePassports = async () => {
    try {
      const response = await axios.get('/api/renewal/eligible');
      setEligiblePassports(response.data.data.eligiblePassports);
    } catch (error) {
      console.error('Failed to fetch eligible passports:', error);
      toast.error('Failed to load passport information');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedPassport) {
      toast.error('Please select a passport to renew');
      return;
    }

    setIsSubmitting(true);
    try {
      const renewalData = {
        existingPassportNumber: selectedPassport.passportNumber,
        expiryDate: data.expiryDate,
        reason: data.reason,
        additionalInfo: data.additionalInfo
      };

      const response = await axios.post('/api/renewal', renewalData);
      toast.success('Renewal application created successfully!');
      // Redirect to dashboard or show success message
    } catch (error) {
      console.error('Renewal application error:', error);
      toast.error(error.response?.data?.message || 'Failed to create renewal application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Passport Renewal</h1>
          <p className="text-gray-600">
            Renew your existing passport with updated information
          </p>
        </div>

        {eligiblePassports.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Eligible Passports</h3>
            <p className="text-gray-600 mb-4">
              You don't have any approved passport applications that can be renewed.
            </p>
            <p className="text-sm text-gray-500">
              Please apply for a new passport first, or contact support if you believe this is an error.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Passport Selection */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Passport to Renew</h2>
              <div className="space-y-3">
                {eligiblePassports.map((passport, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPassport(passport)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedPassport?.passportNumber === passport.passportNumber
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Passport Number: {passport.passportNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Application: {passport.applicationNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Issue Date: {new Date(passport.issueDate).toLocaleDateString()} | 
                          Expiry Date: {new Date(passport.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {selectedPassport?.passportNumber === passport.passportNumber ? (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Renewal Information */}
            {selectedPassport && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Renewal Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="form-label">Expiry Date *</label>
                    <input
                      {...register('expiryDate', { required: 'Expiry date is required' })}
                      type="date"
                      className="input-field"
                      defaultValue={selectedPassport.expiryDate ? new Date(selectedPassport.expiryDate).toISOString().split('T')[0] : ''}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Reason for Renewal *</label>
                    <select
                      {...register('reason', { required: 'Please select a reason' })}
                      className="input-field"
                    >
                      <option value="">Select Reason</option>
                      <option value="expired">Passport Expired</option>
                      <option value="damaged">Passport Damaged</option>
                      <option value="lost">Passport Lost</option>
                      <option value="name_change">Name Change</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.reason && (
                      <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Additional Information</label>
                    <textarea
                      {...register('additionalInfo')}
                      rows={4}
                      className="input-field"
                      placeholder="Provide any additional information about your renewal request..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Important Information */}
            <div className="card bg-blue-50 border border-blue-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Information</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your existing personal and address information will be automatically filled</li>
                    <li>• You may need to provide updated documents if there are changes</li>
                    <li>• The renewal process typically takes 15-30 days</li>
                    <li>• You will receive notifications about the status of your renewal</li>
                    <li>• Payment of ₹1500 is required for renewal processing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !selectedPassport}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Renewal Application...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Create Renewal Application
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Renewal;

