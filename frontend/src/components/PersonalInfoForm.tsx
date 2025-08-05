'use client';

import { useState, useEffect } from 'react';
import { generateMitarbeiterstammdatenPDF, type FormData as PDFFormData } from '@/utils/pdf';
import SignatureInput from './SignatureInput';
import { careerOptionsApi, registerUserApi } from '@/utils/api';

interface CareerOption {
  id: number;
  status_name: string;
}

interface FormData {
  // Basic Personal Information
  vor_nachname: string;
  anschrift: string;
  telefon: string;
  mobil: string;
  email: string;
  geburt_am: string;
  in: string;
  status: string;
  status_sonstiges: string;
  geschlecht: 'weiblich' | 'maennlich' | '';
  familienstand: string;
  unterhaltspflichtige_kinder: string;
  hoechster_abschluss: string;
  staatsangehoerigkeit: string;
  mobilitaet: string;
  bewoerbene_position: string;
  iban: string;
  bic: string;
  bank: string;
  renten_vers_nr: string;
  steuer_id: string;
  konfession: string;
  mitglied_kv: string;
  kv_nr: string;
  
  // Additional Information
  agentur_meldung: 'nein' | 'ja' | '';
  agentur_ort: string;
  weitere_beschaeftigungen: 'nein' | 'ja' | '';
  beschaeftigungen_details: string;
  arbeitgeber_adresse: string;
  kurzfristige_beschaeftigung: 'nein' | 'ja' | '';
  kurzfristige_bis: string;
  notizen: string;
  
  // Declaration
  erklarung_ort_datum: string;
  erklarung_unterschrift: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function PersonalInfoForm() {
  const [careerOptions, setCareerOptions] = useState<CareerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<FormData>({
    vor_nachname: '',
    anschrift: '',
    telefon: '',
    mobil: '',
    email: '',
    geburt_am: '',
    in: '',
    status: '',
    status_sonstiges: '',
    geschlecht: '', // Changed from 'maennlich' to blank
    familienstand: '',
    unterhaltspflichtige_kinder: '',
    hoechster_abschluss: '',
    staatsangehoerigkeit: '',
    mobilitaet: '',
    bewoerbene_position: '',
    iban: '',
    bic: '',
    bank: '',
    renten_vers_nr: '',
    steuer_id: '',
    konfession: '',
    mitglied_kv: '', // Changed from '' to blank
    kv_nr: '',
    agentur_meldung: '', // Changed from 'nein' to blank
    agentur_ort: '',
    weitere_beschaeftigungen: '', // Changed from 'nein' to blank
    beschaeftigungen_details: '',
    arbeitgeber_adresse: '',
    kurzfristige_beschaeftigung: '', // Changed from 'nein' to blank
    kurzfristige_bis: '',
    notizen: '',
    erklarung_ort_datum: '',
    erklarung_unterschrift: ''
  });

  // Load career options on component mount
  useEffect(() => {
    fetchCareerOptions();
  }, []);

  const fetchCareerOptions = async () => {
    const result = await careerOptionsApi();
    
    if (result.success && result.data) {
      setCareerOptions(result.data);
    } else {
      console.error('Error fetching career options:', result.error);
      // Fallback to mock data when backend is not available
      const mockOptions = [
        { id: 1, status_name: 'Schüler/in' },
        { id: 2, status_name: 'Auszubildende/r' },
        { id: 3, status_name: 'Student/in' },
        { id: 4, status_name: 'Angestellte/r' },
        { id: 5, status_name: 'Arbeitssuchend' },
        { id: 6, status_name: 'Rentner/in' },
        { id: 7, status_name: 'Sonstiges' }
      ];
      setCareerOptions(mockOptions);
    }
  };

  // Validation functions
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'E-Mail ist erforderlich';
    if (!emailRegex.test(email)) return 'Ungültige E-Mail-Adresse';
    return null;
  };

  const validateIBAN = (iban: string): string | null => {
    if (!iban) return 'IBAN ist erforderlich';
    if (iban.length < 15 || iban.length > 34) return 'IBAN muss zwischen 15 und 34 Zeichen lang sein';
    return null;
  };

  const validateDate = (date: string): string | null => {
    if (!date) return null;
    const dateObj = new Date(date);
    const today = new Date();
    if (dateObj > today) return 'Datum kann nicht in der Zukunft liegen';
    return null;
  };

  const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === '') return `${fieldName} ist erforderlich`;
    return null;
  };

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'iban':
        return validateIBAN(value);
      case 'geburt_am':
        return validateDate(value);
      case 'vor_nachname':
        return validateRequired(value, 'Vor & Nachname');
      case 'anschrift':
        return validateRequired(value, 'Anschrift');
      case 'mobil':
        return validateRequired(value, 'Mobil');
      case 'in':
        return validateRequired(value, 'Geburtsort');
      case 'status':
        return validateRequired(value, 'Status');
      case 'geschlecht':
        return validateRequired(value, 'Geschlecht');
      case 'familienstand':
        return validateRequired(value, 'Familienstand');
      case 'staatsangehoerigkeit':
        return validateRequired(value, 'Staatsangehörigkeit');
      case 'bewoerbene_position':
        return validateRequired(value, 'Beworbene Position');
      case 'erklarung_ort_datum':
        return validateRequired(value, 'Ort, Datum');
      case 'erklarung_unterschrift':
        return validateRequired(value, 'Unterschrift');
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Debug logging for radio button changes
    if (type === 'radio') {
      console.log('Radio button changed:', { name, value, type });
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
      
      // Debug logging for form data updates
      if (type === 'radio') {
        console.log('Form data updated:', newData);
      }
      
      return newData;
    });

    // Real-time validation
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  // Helper function to render error message
  const renderError = (fieldName: string) => {
    const error = validationErrors[fieldName];
    if (error) {
      return <div className="text-red-500 text-xs mt-1">{error}</div>;
    }
    return null;
  };

  // Helper function to get input className with validation styling
  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-black";
    const hasError = validationErrors[fieldName];
    
    if (hasError) {
      return `${baseClass} border-red-500 focus:ring-red-500`;
    }
    return `${baseClass} border-gray-300 focus:ring-blue-500`;
  };

  // Validate all fields before submission
  const validateAllFields = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Validate all required fields
    const requiredFields = [
      'vor_nachname', 'anschrift', 'mobil', 'email', 'geburt_am', 'in',
      'status', 'geschlecht', 'familienstand', 'staatsangehoerigkeit', 'bewoerbene_position', 'iban',
      'erklarung_ort_datum', 'erklarung_unterschrift'
    ];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof FormData] as string);
      if (error) {
        errors[field] = error;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      setMessage({ type: 'error', text: 'Bitte korrigieren Sie die Fehler im Formular.' });
      return;
    }
    
    setShowReview(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setMessage(null);

    const result = await registerUserApi(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Formular erfolgreich eingereicht!' });
      setShowReview(false);
    } else {
      console.error('Backend not available, using local storage:', result.error);
      // Store data locally when backend is not available
      const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
      submissions.push({
        ...formData,
        id: Date.now(),
        created_at: new Date().toISOString()
      });
      localStorage.setItem('formSubmissions', JSON.stringify(submissions));
      
      setMessage({ type: 'success', text: 'Formular erfolgreich gespeichert (lokaler Speicher)!' });
      setShowReview(false);
    }
    
    setLoading(false);
  };

  const exportToPDF = async () => {
    try {
      // Debug logging for PDF export
      console.log('Exporting PDF with form data:', formData);
      
      // Convert formData to PDFFormData format
      const pdfFormData: PDFFormData = {
        ...formData,
        mitglied_kv: formData.mitglied_kv === 'Ja' ? true : false
      };
      
      console.log('PDF form data after conversion:', pdfFormData);
      
      await generateMitarbeiterstammdatenPDF(pdfFormData);
      setMessage({ type: 'success', text: 'PDF erfolgreich erstellt!' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage({ type: 'error', text: 'Fehler beim PDF-Export. Bitte versuchen Sie es erneut.' });
    }
  };

  // Review page component
  const ReviewPage = () => {
    const getCareerOptionName = (status: string) => {
      const option = careerOptions.find(opt => opt.status_name === status);
      return option ? option.status_name : status;
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">Überprüfung</h2>
          <p className="text-gray-600">Bitte überprüfen Sie Ihre Angaben vor der Einreichung</p>
        </div>

        <div id="review-content" className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Personal Data */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black border-b border-gray-300 pb-2">
                Persönliche Daten
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-black">Vor & Nachname:</span>
                  <span className="ml-2 text-black">{formData.vor_nachname || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Anschrift:</span>
                  <span className="ml-2 text-black">{formData.anschrift || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Telefon:</span>
                  <span className="ml-2 text-black">{formData.telefon || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Mobil:</span>
                  <span className="ml-2 text-black">{formData.mobil || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">E-Mail:</span>
                  <span className="ml-2 text-black">{formData.email || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Geburt am:</span>
                  <span className="ml-2 text-black">{formData.geburt_am || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">In:</span>
                  <span className="ml-2 text-black">{formData.in || 'Nicht angegeben'}</span>
                </div>
              </div>

              <div>
                <span className="font-medium text-black">Status:</span>
                <span className="ml-2 text-black">{getCareerOptionName(formData.status) || 'Nicht angegeben'}</span>
                {formData.status === 'Sonstiges' && formData.status_sonstiges && (
                  <span className="ml-2 text-black">({formData.status_sonstiges})</span>
                )}
              </div>

              <div>
                <span className="font-medium text-black">Geschlecht:</span>
                <span className="ml-2 text-black">
                  {formData.geschlecht === 'weiblich' ? 'Weiblich' : 
                   formData.geschlecht === 'maennlich' ? 'Männlich' : 'Nicht angegeben'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-medium text-black">Familienstand:</span>
                  <span className="ml-2 text-black">{formData.familienstand || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">unterhaltspflichtige Kinder:</span>
                  <span className="ml-2 text-black">{formData.unterhaltspflichtige_kinder || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Höchster Abschluss:</span>
                  <span className="ml-2 text-black">{formData.hoechster_abschluss || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Staatsangehörigkeit:</span>
                  <span className="ml-2 text-black">{formData.staatsangehoerigkeit || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Mobilität:</span>
                  <span className="ml-2 text-black">{formData.mobilitaet || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Beworbene Position:</span>
                  <span className="ml-2 text-black">{formData.bewoerbene_position || 'Nicht angegeben'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-black mb-2">Bankdaten:</h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-black">IBAN:</span>
                    <span className="ml-2 text-black">{formData.iban || 'Nicht angegeben'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-black">BIC:</span>
                    <span className="ml-2 text-black">{formData.bic || 'Nicht angegeben'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-black">Bank:</span>
                    <span className="ml-2 text-black">{formData.bank || 'Nicht angegeben'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-black mb-2">Deutsche Angaben:</h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-black">Renten-Vers. Nr.:</span>
                    <span className="ml-2 text-black">{formData.renten_vers_nr || 'Nicht angegeben'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-black">Steuer-ID:</span>
                    <span className="ml-2 text-black">{formData.steuer_id || 'Nicht angegeben'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-black">Konfession:</span>
                    <span className="ml-2 text-black">{formData.konfession || 'Nicht angegeben'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-black">Mitglied in gesetzl. KV:</span>
                    <span className="ml-2 text-black">{formData.mitglied_kv || 'Nicht angegeben'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-black">KV-Nr.:</span>
                    <span className="ml-2 text-black">{formData.kv_nr || 'Nicht angegeben'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black border-b border-gray-300 pb-2">
                Zusätzliche Informationen
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-black">Agentur für Arbeit:</span>
                  <span className="ml-2 text-black">
                    {formData.agentur_meldung === 'ja' ? 'Ja' : 'Nein'}
                    {formData.agentur_meldung === 'ja' && formData.agentur_ort && ` (${formData.agentur_ort})`}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-black">Weitere Beschäftigungen:</span>
                  <span className="ml-2 text-black">
                    {formData.weitere_beschaeftigungen === 'ja' ? 'Ja' : 'Nein'}
                    {formData.weitere_beschaeftigungen === 'ja' && formData.beschaeftigungen_details && ` (${formData.beschaeftigungen_details})`}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-black">Arbeitgeber Adresse:</span>
                  <span className="ml-2 text-black">{formData.arbeitgeber_adresse || 'Nicht angegeben'}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Kurzfristige Beschäftigung:</span>
                  <span className="ml-2 text-black">
                    {formData.kurzfristige_beschaeftigung === 'ja' ? 'Ja' : 'Nein'}
                    {formData.kurzfristige_beschaeftigung === 'ja' && formData.kurzfristige_bis && ` (bis ${formData.kurzfristige_bis})`}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-black">Notizen:</span>
                  <span className="ml-2 text-black">{formData.notizen || 'Nicht angegeben'}</span>
                </div>
              </div>



              <div>
                <h4 className="font-medium text-black mb-2">Erklärung:</h4>
                <p className="text-sm text-black">
                  Ich versichere, dass die auf diesem Dokument gemachten Angaben der Wahrheit entsprechen und ich verpflichte mich, den Arbeitgeber über alle Änderungen unverzüglich zu informieren.
                </p>
                <div className="flex items-center justify-between space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-black">Ort, Datum:</span>
                    <span className="text-sm text-black">{formData.erklarung_ort_datum || 'Nicht angegeben'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-black">Unterschrift:</span>
                    <span className="text-sm text-black">{formData.erklarung_unterschrift ? 'Unterschrieben' : 'Nicht unterschrieben'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setShowReview(false)}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Zurück zum Formular
          </button>
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Wird eingereicht...' : 'Formular einreichen'}
          </button>
          <button
            type="button"
            onClick={exportToPDF}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Als PDF exportieren
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {message && (
        <div className={`p-3 sm:p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {showReview ? (
        <ReviewPage />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Hinweis:</span> Felder mit einem Stern (*) sind Pflichtfelder und müssen ausgefüllt werden.
            </p>
          </div>
        <div id="form-content" className="space-y-4 sm:space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Left Column - Personal Data */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black border-b border-gray-300 pb-2">
                  Persönliche Daten
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Vor & Nachname *
                    </label>
                    <input
                      type="text"
                      name="vor_nachname"
                      value={formData.vor_nachname}
                      onChange={handleInputChange}
                      required
                      className={getInputClassName('vor_nachname')}
                    />
                    {renderError('vor_nachname')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Anschrift *
                    </label>
                    <textarea
                      name="anschrift"
                      value={formData.anschrift}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className={getInputClassName('anschrift')}
                    />
                    {renderError('anschrift')}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Mobil *
                      </label>
                      <input
                        type="tel"
                        name="mobil"
                        value={formData.mobil}
                        onChange={handleInputChange}
                        required
                        className={getInputClassName('mobil')}
                      />
                      {renderError('mobil')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={getInputClassName('email')}
                    />
                    {renderError('email')}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Geburt am *
                      </label>
                      <input
                        type="date"
                        name="geburt_am"
                        value={formData.geburt_am}
                        onChange={handleInputChange}
                        required
                        className={getInputClassName('geburt_am')}
                      />
                      {renderError('geburt_am')}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Geburt Ort *
                      </label>
                      <input
                        type="text"
                        name="in"
                        value={formData.in}
                        onChange={handleInputChange}
                        required
                        className={getInputClassName('in')}
                      />
                      {renderError('in')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Status *</h3>
                <div className="space-y-2 sm:space-y-3">
                  {careerOptions.map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={option.status_name}
                        checked={formData.status === option.status_name}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label className="ml-2 block text-sm text-black">
                        {option.status_name}
                      </label>
                    </div>
                  ))}
                  {formData.status === 'Sonstiges' && (
                    <div className="ml-6">
                      <input
                        type="text"
                        name="status_sonstiges"
                        value={formData.status_sonstiges}
                        onChange={handleInputChange}
                        placeholder="Sonstiges"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                  )}
                  {renderError('status')}
                </div>
              </div>

              {/* Gender Section */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Geschlecht *</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="geschlecht"
                      value="weiblich"
                      checked={formData.geschlecht === 'weiblich'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label className="ml-2 block text-sm text-black">Weiblich</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="geschlecht"
                      value="maennlich"
                      checked={formData.geschlecht === 'maennlich'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label className="ml-2 block text-sm text-black">Männlich</label>
                  </div>
                  {renderError('geschlecht')}
                </div>
              </div>

              {/* Additional Personal Data */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-black">Weitere Angaben</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Familienstand *
                    </label>
                    <select
                      name="familienstand"
                      value={formData.familienstand}
                      onChange={handleInputChange}
                      required
                      className={getInputClassName('familienstand')}
                    >
                      <option value="">Bitte wählen Sie...</option>
                      <option value="ledig">Ledig</option>
                      <option value="verheiratet">Verheiratet</option>
                      <option value="geschieden">Geschieden</option>
                      <option value="verwitwet">Verwitwet</option>
                      <option value="partnerschaft">Partnerschaft</option>
                    </select>
                    {renderError('familienstand')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      unterhaltspflichtige Kinder
                    </label>
                    <select
                      name="unterhaltspflichtige_kinder"
                      value={formData.unterhaltspflichtige_kinder}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    >
                      <option value="">Bitte wählen Sie...</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Höchster Abschluss
                    </label>
                    <input
                      type="text"
                      name="hoechster_abschluss"
                      value={formData.hoechster_abschluss}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    {renderError('hoechster_abschluss')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Staatsangehörigkeit *
                    </label>
                                          <input
                        type="text"
                        name="staatsangehoerigkeit"
                        value={formData.staatsangehoerigkeit}
                        onChange={handleInputChange}
                        required
                        className={getInputClassName('staatsangehoerigkeit')}
                      />
                    {renderError('staatsangehoerigkeit')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Mobilität
                    </label>
                    <input
                      type="text"
                      name="mobilitaet"
                      value={formData.mobilitaet}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Beworbene Position *
                    </label>
                                          <input
                        type="text"
                        name="bewoerbene_position"
                        value={formData.bewoerbene_position}
                        onChange={handleInputChange}
                        required
                        className={getInputClassName('bewoerbene_position')}
                      />
                    {renderError('bewoerbene_position')}
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-black">Bankdaten</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      IBAN *
                    </label>
                                          <input
                        type="text"
                        name="iban"
                        value={formData.iban}
                        onChange={handleInputChange}
                        required
                        className={getInputClassName('iban')}
                      />
                    {renderError('iban')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      BIC
                    </label>
                    <input
                      type="text"
                      name="bic"
                      value={formData.bic}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Bank
                    </label>
                    <input
                      type="text"
                      name="bank"
                      value={formData.bank}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                </div>
              </div>

              {/* German-specific Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-black">Deutsche Angaben</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Renten-Vers. Nr.
                    </label>
                    <input
                      type="text"
                      name="renten_vers_nr"
                      value={formData.renten_vers_nr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Steuer-ID
                    </label>
                    <input
                      type="text"
                      name="steuer_id"
                      value={formData.steuer_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Konfession
                    </label>
                    <input
                      type="text"
                      name="konfession"
                      value={formData.konfession}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Mitglied in gesetzl. KV
                    </label>
                    <input
                      type="text"
                      name="mitglied_kv"
                      value={formData.mitglied_kv}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      KV-Nr.
                    </label>
                    <input
                      type="text"
                      name="kv_nr"
                      value={formData.kv_nr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Information */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Zusätzliche Informationen</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-sm text-black mb-3">
                      Liegt zu Beginn des Beschäftigungsverhältnisses eine Meldung als arbeits- oder ausbildungssuchend bei der Agentur für Arbeit vor oder/und lautet der dortige Status &ldquo;beschäftigungslos&rdquo;?
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="agentur_meldung"
                          value="nein"
                          checked={formData.agentur_meldung === 'nein'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 block text-sm text-black">Nein</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="agentur_meldung"
                          value="ja"
                          checked={formData.agentur_meldung === 'ja'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 block text-sm text-black">Ja bei der Agentur für Arbeit in</label>
                      </div>
                      {formData.agentur_meldung === 'ja' && (
                        <input
                          type="text"
                          name="agentur_ort"
                          value={formData.agentur_ort}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-black mb-3">
                      Bestehen derzeit weitere Beschäftigungsverhältnisse?
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="weitere_beschaeftigungen"
                          value="nein"
                          checked={formData.weitere_beschaeftigungen === 'nein'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 block text-sm text-black">Nein</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="weitere_beschaeftigungen"
                          value="ja"
                          checked={formData.weitere_beschaeftigungen === 'ja'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 block text-sm text-black">Ja, ich übe folgende Beschäftigungen aus</label>
                      </div>
                      {formData.weitere_beschaeftigungen === 'ja' && (
                        <textarea
                          name="beschaeftigungen_details"
                          value={formData.beschaeftigungen_details}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Arbeitgeber und Arbeitgeber Adresse
                    </label>
                    <textarea
                      name="arbeitgeber_adresse"
                      value={formData.arbeitgeber_adresse}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-black mb-3">
                      Wurde in den letzten zwölf Kalendermonaten einer kurzfristigen Beschäftigung nachgegangen?
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="kurzfristige_beschaeftigung"
                          value="nein"
                          checked={formData.kurzfristige_beschaeftigung === 'nein'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 block text-sm text-black">Nein</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="kurzfristige_beschaeftigung"
                          value="ja"
                          checked={formData.kurzfristige_beschaeftigung === 'ja'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 block text-sm text-black">Ja und zwar bis zum</label>
                      </div>
                      {formData.kurzfristige_beschaeftigung === 'ja' && (
                        <input
                          type="date"
                          name="kurzfristige_bis"
                          value={formData.kurzfristige_bis}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Notizen
                    </label>
                    <textarea
                      name="notizen"
                      value={formData.notizen}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                </div>
              </div>



              {/* Declaration */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Erklärung</h3>
                <p className="text-sm text-black leading-relaxed mb-4 sm:mb-6">
                  Ich versichere, dass die auf diesem Dokument gemachten Angaben der Wahrheit entsprechen und ich verpflichte mich, den Arbeitgeber über alle Änderungen unverzüglich zu informieren.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-black">Ort, Datum:</span>
                      <div className="flex-1 border-b-2 border-gray-400">
                        <input
                          type="text"
                          name="erklarung_ort_datum"
                          value={formData.erklarung_ort_datum}
                          onChange={handleInputChange}
                          placeholder="Hamburg, 15.12.2024"
                          className="w-full px-2 py-1 border-none outline-none bg-transparent text-black placeholder-gray-500 text-sm"
                        />
                        {renderError('erklarung_ort_datum')}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-2">
                      Unterschrift:
                    </label>
                    <SignatureInput
                      value={formData.erklarung_unterschrift}
                      onChange={(value) => setFormData(prev => ({ ...prev, erklarung_unterschrift: value }))}
                      placeholder="Unterschrift hier zeichnen"
                      className="w-full"
                    />
                    {renderError('erklarung_unterschrift')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Wird eingereicht...' : 'Formular einreichen'}
          </button>
          <button
            type="button"
            onClick={exportToPDF}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Als PDF exportieren
          </button>
        </div>
        </form>
      )}
    </div>
  );
} 