import React, { useState } from 'react';
import { X, User, Home, MapPin, Mail, Lock } from 'lucide-react';
import { mockUsers } from '../data/mockUsers';
import { User as UserType } from '../types/Auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onSwitchToRegister }) => {
  const [loginMethod, setLoginMethod] = useState<'select' | 'form'>('form');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    houseNumber: ''
  });
  const [errors, setErrors] = useState<{email?: string; houseNumber?: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: {email?: string; houseNumber?: string} = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = 'Nomor rumah wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email and house number
    const user = mockUsers.find(u => 
      u.email.toLowerCase() === formData.email.toLowerCase() && 
      u.houseNumber.toLowerCase() === formData.houseNumber.toLowerCase()
    );
    
    if (user) {
      onLogin(user);
      onClose();
      setFormData({ email: '', houseNumber: '' });
      setErrors({});
    } else {
      setErrors({ email: 'Email atau nomor rumah tidak ditemukan' });
    }
    setIsLoading(false);
  };

  const handleSelectLogin = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.id === selectedUser);
    if (user) {
      onLogin(user);
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {loginMethod === 'form' ? 'Login Warga' : 'Demo Login'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setLoginMethod('form')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'form'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login Normal
            </button>
            <button
              onClick={() => setLoginMethod('select')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'select'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Demo Mode
            </button>
          </div>

          {loginMethod === 'form' ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Masukkan email dan nomor rumah untuk login
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
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
                  Nomor Rumah
                </label>
                <input
                  type="text"
                  value={formData.houseNumber}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, houseNumber: e.target.value }));
                    if (errors.houseNumber) setErrors(prev => ({ ...prev, houseNumber: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.houseNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="A-15, B-23, C-08"
                />
                {errors.houseNumber && <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-6">
                Pilih identitas demo untuk mencoba aplikasi
              </p>

              <div className="space-y-3 mb-6">
                {mockUsers.map((user) => (
                  <label
                    key={user.id}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedUser === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="user"
                      value={user.id}
                      checked={selectedUser === user.id}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{user.name}</span>
                        {user.role !== 'resident' && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {user.role === 'rt_head' ? 'Ketua RT' : 
                             user.role === 'rw_head' ? 'Ketua RW' : 'Admin'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Home className="h-4 w-4" />
                          <span>Rumah {user.houseNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>RT {user.rt}/RW {user.rw}</span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={loginMethod === 'form' ? handleFormLogin : handleSelectLogin}
              disabled={(loginMethod === 'form' ? (!formData.email || !formData.houseNumber) : !selectedUser) || isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Masuk...' : 'Masuk ke Forum'}
            </button>
            
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Belum Punya Akun? Daftar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;