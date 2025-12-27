import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Camera, 
  FileText,
  User,
  MapPin,
  CreditCard,
  CheckCircle
} from 'lucide-react';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biometricCaptured, setBiometricCaptured] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      sameAsPresent: false
    }
  });

  const sameAsPresent = watch('sameAsPresent');

  const steps = [
    { id: 1, title: 'Personal Details', icon: <User className="w-5 h-5" /> },
    { id: 2, title: 'Address Details', icon: <MapPin className="w-5 h-5" /> },
    { id: 3, title: 'Document Upload', icon: <FileText className="w-5 h-5" /> },
    { id: 4, title: 'Biometric Capture', icon: <Camera className="w-5 h-5" /> },
    { id: 5, title: 'Review & Submit', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/applications', data);
      toast.success('Application created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBiometricCapture = () => {
    // Simulate biometric capture
    setTimeout(() => {
      setBiometricCaptured(true);
      toast.success('Biometric data captured successfully!');
    }, 2000);
  };

  const handleFileUpload = (field, file) => {
    // Simulate file upload - in real app, upload to server
    const url = URL.createObjectURL(file);
    setValue(field, url);
    toast.success('File uploaded successfully!');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">First Name *</label>
                <input
                  {...register('personalInfo.firstName', { required: 'First name is required' })}
                  className="input-field"
                  placeholder="Enter your first name"
                />
                {errors.personalInfo?.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Last Name *</label>
                <input
                  {...register('personalInfo.lastName', { required: 'Last name is required' })}
                  className="input-field"
                  placeholder="Enter your last name"
                />
                {errors.personalInfo?.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Middle Name</label>
                <input
                  {...register('personalInfo.middleName')}
                  className="input-field"
                  placeholder="Enter your middle name (optional)"
                />
              </div>

              <div>
                <label className="form-label">Father's Name *</label>
                <input
                  {...register('personalInfo.fatherName', { required: 'Father\'s name is required' })}
                  className="input-field"
                  placeholder="Enter your father's name"
                />
                {errors.personalInfo?.fatherName && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.fatherName.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Mother's Name *</label>
                <input
                  {...register('personalInfo.motherName', { required: 'Mother\'s name is required' })}
                  className="input-field"
                  placeholder="Enter your mother's name"
                />
                {errors.personalInfo?.motherName && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.motherName.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Spouse's Name</label>
                <input
                  {...register('personalInfo.spouseName')}
                  className="input-field"
                  placeholder="Enter your spouse's name (if married)"
                />
              </div>

              <div>
                <label className="form-label">Date of Birth *</label>
                <input
                  {...register('personalInfo.dateOfBirth', { required: 'Date of birth is required' })}
                  type="date"
                  className="input-field"
                />
                {errors.personalInfo?.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Place of Birth *</label>
                <input
                  {...register('personalInfo.placeOfBirth', { required: 'Place of birth is required' })}
                  className="input-field"
                  placeholder="Enter your place of birth"
                />
                {errors.personalInfo?.placeOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.placeOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Gender *</label>
                <select
                  {...register('personalInfo.gender', { required: 'Gender is required' })}
                  className="input-field"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.personalInfo?.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.gender.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Marital Status *</label>
                <select
                  {...register('personalInfo.maritalStatus', { required: 'Marital status is required' })}
                  className="input-field"
                >
                  <option value="">Select Marital Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
                {errors.personalInfo?.maritalStatus && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.maritalStatus.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Occupation *</label>
                <input
                  {...register('personalInfo.occupation', { required: 'Occupation is required' })}
                  className="input-field"
                  placeholder="Enter your occupation"
                />
                {errors.personalInfo?.occupation && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.occupation.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Education *</label>
                <select
                  {...register('personalInfo.education', { required: 'Education is required' })}
                  className="input-field"
                >
                  <option value="">Select Education Level</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="higher_secondary">Higher Secondary</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
                {errors.personalInfo?.education && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.education.message}</p>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">Contact Name *</label>
                  <input
                    {...register('personalInfo.emergencyContact.name', { required: 'Emergency contact name is required' })}
                    className="input-field"
                    placeholder="Enter contact person's name"
                  />
                  {errors.personalInfo?.emergencyContact?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.personalInfo.emergencyContact.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Relationship *</label>
                  <input
                    {...register('personalInfo.emergencyContact.relationship', { required: 'Relationship is required' })}
                    className="input-field"
                    placeholder="e.g., Father, Mother, Brother"
                  />
                  {errors.personalInfo?.emergencyContact?.relationship && (
                    <p className="mt-1 text-sm text-red-600">{errors.personalInfo.emergencyContact.relationship.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    {...register('personalInfo.emergencyContact.phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Please enter a valid 10-digit mobile number'
                      }
                    })}
                    className="input-field"
                    placeholder="Enter phone number"
                  />
                  {errors.personalInfo?.emergencyContact?.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.personalInfo.emergencyContact.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Present Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="form-label">Street Address *</label>
                    <input
                      {...register('addressInfo.presentAddress.street', { required: 'Street address is required' })}
                      className="input-field"
                      placeholder="Enter your street address"
                    />
                    {errors.addressInfo?.presentAddress?.street && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressInfo.presentAddress.street.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">City *</label>
                    <input
                      {...register('addressInfo.presentAddress.city', { required: 'City is required' })}
                      className="input-field"
                      placeholder="Enter your city"
                    />
                    {errors.addressInfo?.presentAddress?.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressInfo.presentAddress.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">State *</label>
                    <input
                      {...register('addressInfo.presentAddress.state', { required: 'State is required' })}
                      className="input-field"
                      placeholder="Enter your state"
                    />
                    {errors.addressInfo?.presentAddress?.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressInfo.presentAddress.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Pincode *</label>
                    <input
                      {...register('addressInfo.presentAddress.pincode', { 
                        required: 'Pincode is required',
                        pattern: {
                          value: /^[1-9][0-9]{5}$/,
                          message: 'Please enter a valid 6-digit pincode'
                        }
                      })}
                      className="input-field"
                      placeholder="Enter your pincode"
                    />
                    {errors.addressInfo?.presentAddress?.pincode && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressInfo.presentAddress.pincode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Country</label>
                    <input
                      {...register('addressInfo.presentAddress.country')}
                      className="input-field"
                      defaultValue="India"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  {...register('sameAsPresent')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Permanent address is same as present address
                </label>
              </div>

              {!sameAsPresent && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Permanent Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="form-label">Street Address *</label>
                      <input
                        {...register('addressInfo.permanentAddress.street', { 
                          required: !sameAsPresent ? 'Street address is required' : false 
                        })}
                        className="input-field"
                        placeholder="Enter your permanent street address"
                      />
                      {errors.addressInfo?.permanentAddress?.street && (
                        <p className="mt-1 text-sm text-red-600">{errors.addressInfo.permanentAddress.street.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">City *</label>
                      <input
                        {...register('addressInfo.permanentAddress.city', { 
                          required: !sameAsPresent ? 'City is required' : false 
                        })}
                        className="input-field"
                        placeholder="Enter your permanent city"
                      />
                      {errors.addressInfo?.permanentAddress?.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.addressInfo.permanentAddress.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">State *</label>
                      <input
                        {...register('addressInfo.permanentAddress.state', { 
                          required: !sameAsPresent ? 'State is required' : false 
                        })}
                        className="input-field"
                        placeholder="Enter your permanent state"
                      />
                      {errors.addressInfo?.permanentAddress?.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.addressInfo.permanentAddress.state.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Pincode *</label>
                      <input
                        {...register('addressInfo.permanentAddress.pincode', { 
                          required: !sameAsPresent ? 'Pincode is required' : false,
                          pattern: {
                            value: /^[1-9][0-9]{5}$/,
                            message: 'Please enter a valid 6-digit pincode'
                          }
                        })}
                        className="input-field"
                        placeholder="Enter your permanent pincode"
                      />
                      {errors.addressInfo?.permanentAddress?.pincode && (
                        <p className="mt-1 text-sm text-red-600">{errors.addressInfo.permanentAddress.pincode.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Country</label>
                      <input
                        {...register('addressInfo.permanentAddress.country')}
                        className="input-field"
                        defaultValue="India"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h3>
            <p className="text-gray-600 mb-6">
              Please upload clear, legible copies of the required documents. All documents should be in PDF or image format.
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">ID Proof *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload ID Proof</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('documents.idProof', e.target.files[0])}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  {errors.documents?.idProof && (
                    <p className="mt-1 text-sm text-red-600">{errors.documents.idProof.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Address Proof *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload Address Proof</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('documents.addressProof', e.target.files[0])}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  {errors.documents?.addressProof && (
                    <p className="mt-1 text-sm text-red-600">{errors.documents.addressProof.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Birth Certificate</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload Birth Certificate</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('documents.birthCertificate', e.target.files[0])}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Passport Photo *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('documents.photo', e.target.files[0])}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                  {errors.documents?.photo && (
                    <p className="mt-1 text-sm text-red-600">{errors.documents.photo.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Signature *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload Signature</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('documents.signature', e.target.files[0])}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                  {errors.documents?.signature && (
                    <p className="mt-1 text-sm text-red-600">{errors.documents.signature.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Biometric Capture</h3>
            <p className="text-gray-600 mb-6">
              Please ensure good lighting and look directly at the camera for biometric capture.
            </p>

            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-6">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Biometric Capture</h4>
                <p className="text-gray-600 mb-4">
                  {biometricCaptured ? 'Biometric data captured successfully!' : 'Click the button below to capture your biometric data'}
                </p>
                
                {!biometricCaptured ? (
                  <button
                    type="button"
                    onClick={handleBiometricCapture}
                    className="btn-primary"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Biometric Data
                  </button>
                ) : (
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    <span className="font-medium">Biometric Captured</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">Important Notes:</h5>
                <ul className="text-sm text-blue-800 text-left space-y-1">
                  <li>• Ensure your face is clearly visible</li>
                  <li>• Remove glasses, hats, or any face coverings</li>
                  <li>• Look directly at the camera</li>
                  <li>• Ensure good lighting conditions</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h3>
            <p className="text-gray-600 mb-6">
              Please review all the information before submitting your application.
            </p>

            <div className="space-y-6">
              {/* Personal Information Review */}
              <div className="card">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-900">
                      {watch('personalInfo.firstName')} {watch('personalInfo.middleName')} {watch('personalInfo.lastName')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date of Birth:</span>
                    <span className="ml-2 text-gray-900">{watch('personalInfo.dateOfBirth')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Gender:</span>
                    <span className="ml-2 text-gray-900 capitalize">{watch('personalInfo.gender')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Marital Status:</span>
                    <span className="ml-2 text-gray-900 capitalize">{watch('personalInfo.maritalStatus')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Occupation:</span>
                    <span className="ml-2 text-gray-900">{watch('personalInfo.occupation')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Education:</span>
                    <span className="ml-2 text-gray-900 capitalize">{watch('personalInfo.education')}</span>
                  </div>
                </div>
              </div>

              {/* Address Information Review */}
              <div className="card">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Address Information</h4>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Present Address:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {watch('addressInfo.presentAddress.street')}, {watch('addressInfo.presentAddress.city')}, 
                      {watch('addressInfo.presentAddress.state')} - {watch('addressInfo.presentAddress.pincode')}
                    </p>
                  </div>
                  {!sameAsPresent && (
                    <div>
                      <span className="font-medium text-gray-700">Permanent Address:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {watch('addressInfo.permanentAddress.street')}, {watch('addressInfo.permanentAddress.city')}, 
                        {watch('addressInfo.permanentAddress.state')} - {watch('addressInfo.permanentAddress.pincode')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents Review */}
              <div className="card">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Documents Uploaded</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">ID Proof</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Address Proof</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Passport Photo</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Signature</span>
                  </div>
                </div>
              </div>

              {/* Biometric Review */}
              <div className="card">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Biometric Data</h4>
                <div className="flex items-center">
                  {biometricCaptured ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-600 font-medium">Biometric data captured successfully</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-red-600 font-medium">Biometric data not captured</span>
                    </>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="card bg-blue-50 border border-blue-200">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <div className="ml-3">
                    <p className="text-sm text-blue-900">
                      I declare that the information provided is true and correct to the best of my knowledge. 
                      I understand that providing false information may result in rejection of my application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {step.icon}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary flex items-center"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !biometricCaptured}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;

