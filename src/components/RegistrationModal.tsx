import React, { useState } from 'react';
import { X, User, Mail, Home, MapPin, Phone, CreditCard, AlertCircle } from 'lucide-react';
import { RegistrationData } from '../types/Auth';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: RegistrationData) => void;
  onSwitchToLogin: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ 
  isOpen, 
  onClose, 
  onRegister, 
  onSwitchToLogin 
}) => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    houseNumber: '',
    rt: '',
    rw: '',
    phone: '',
    identityNumber: ''
  });
  const [errors, setErrors] = useState<Partial<RegistrationData>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};

    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.houseNumber.trim()) newErrors.houseNumber = 'Nomor rumah wajib diisi';
    if (!formData.rt.trim()) newErrors.rt = 'RT wajib diisi';
    if (!formData.rw.trim()) newErrors.rw = 'RW wajib diisi';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }
    if (!formData.identityNumber.trim()) {
      newErrors.identityNumber = 'Nomor identitas wajib diisi';
    } else if (formData.identityNumber.length < 16) {
      newErrors.identityNumber = 'Nomor identitas minimal 16 digit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    onRegister(formData);
    setIsLoading(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      houseNumber: '',
      rt: '',
      rw: '',
      phone: '',
      identityNumber: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Registrasi Warga Baru</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informasi Penting:</p>
                <p>Pastikan data yang Anda masukkan sesuai dengan dokumen resmi. Data akan diverifikasi oleh pengurus RT/RW.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="nama@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Home className="h-4 w-4 inline mr-2" />
                Nomor Rumah *
              </label>
              <input
                type="text"
                value={formData.houseNumber}
                onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.houseNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="A-15, B-23, C-08"
              />
              {errors.houseNumber && <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Nomor Telepon *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="08123456789"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                RT *
              </label>
              <select
                value={formData.rt}
                onChange={(e) => handleInputChange('rt', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.rt ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih RT</option>
                <option value="01">RT 01</option>
                <option value="02">RT 02</option>
                <option value="03">RT 03</option>
                <option value="04">RT 04</option>
                <option value="05">RT 05</option>
                <option value="06">RT 06</option>
                <option value="07">RT 07</option>
                <option value="08">RT 08</option>
              </select>
              {errors.rt && <p className="text-red-500 text-xs mt-1">{errors.rt}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                RW *
              </label>
              <select
                value={formData.rw}
                onChange={(e) => handleInputChange('rw', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.rw ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih RW</option>
                <option value="01">RW 01</option>
                <option value="02">RW 02</option>
                <option value="03">RW 03</option>
              </select>
              {errors.rw && <p className="text-red-500 text-xs mt-1">{errors.rw}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="h-4 w-4 inline mr-2" />
              Nomor Identitas (KTP/KK) *
            </label>
            <input
              type="text"
              value={formData.identityNumber}
              onChange={(e) => handleInputChange('identityNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.identityNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="16 digit nomor KTP/KK"
              maxLength={16}
            />
            {errors.identityNumber && <p className="text-red-500 text-xs mt-1">{errors.identityNumber}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sudah Punya Akun? Login
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;