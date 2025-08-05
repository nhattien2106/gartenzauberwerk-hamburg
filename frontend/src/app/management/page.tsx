'use client';

import { useState, useEffect } from 'react';
import { generateMitarbeiterstammdatenPDF, type FormData as PDFFormData } from '@/utils/pdf';
import { getUsersApi, deleteUserApi } from '@/utils/api';
import Navbar from '@/components/Navbar';

interface User {
  id: number;
  vor_nachname: string;
  anschrift?: string;
  telefon?: string;
  mobil?: string;
  email: string;
  geburt_am?: string;
  in_ort?: string;
  status: string;
  status_sonstiges?: string;
  geschlecht: string;
  familienstand: string;
  unterhaltspflichtige_kinder?: string;
  hoechster_abschluss?: string;
  staatsangehoerigkeit?: string;
  mobilitaet?: string;
  bewoerbene_position: string;
  iban?: string;
  bic?: string;
  bank?: string;
  renten_vers_nr?: string;
  steuer_id?: string;
  konfession?: string;
  mitglied_kv?: boolean;
  kv_nr?: string;
  agentur_meldung?: string;
  agentur_ort?: string;
  weitere_beschaeftigungen?: string;
  beschaeftigungen_details?: string;
  arbeitgeber_adresse?: string;
  kurzfristige_beschaeftigung?: string;
  kurzfristige_bis?: string;
  notizen?: string;
  created_at: string;
}

export default function ManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [exportingPDF, setExportingPDF] = useState<number | null>(null);
  const [deletingUser, setDeletingUser] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getUsersApi();
      
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        console.error('Error fetching users:', result.error);
        setError('Fehler beim Laden der Benutzerdaten');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Fehler beim Laden der Benutzerdaten');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Sind Sie sicher, dass Sie ${userName} löschen möchten?`)) {
      return;
    }

    setDeletingUser(userId);
    
    try {
      const result = await deleteUserApi(userId);
      
      if (result.success && result.data?.success) {
        // Remove the user from the local state
        setUsers(users.filter(user => user.id !== userId));
        alert('Benutzer erfolgreich gelöscht');
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Fehler beim Löschen des Benutzers');
    } finally {
      setDeletingUser(null);
    }
  };

  const exportUserPDF = async (user: User) => {
    setExportingPDF(user.id);
    
    try {
      // Convert user data to PDFFormData format
      const pdfFormData: PDFFormData = {
        ...user,
        in: user.in_ort || '', // Map in_ort to in
        mitglied_kv: user.mitglied_kv || false,
        geschlecht: (user.geschlecht as 'weiblich' | 'maennlich') || 'maennlich',
        agentur_meldung: (user.agentur_meldung as 'nein' | 'ja') || 'nein',
        weitere_beschaeftigungen: (user.weitere_beschaeftigungen as 'nein' | 'ja') || 'nein',
        kurzfristige_beschaeftigung: (user.kurzfristige_beschaeftigung as 'nein' | 'ja') || 'nein'
      };
      
      await generateMitarbeiterstammdatenPDF(pdfFormData);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Fehler beim Erstellen der PDF-Datei');
    } finally {
      setExportingPDF(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Fehler beim Laden der Daten</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Verwaltung - Gespeicherte Formulare</h1>
            <button
              onClick={fetchUsers}
              className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              🔄 Aktualisieren
            </button>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Formulare gefunden</h3>
              <p className="text-gray-500">Es wurden noch keine Mitarbeiterstammdaten gespeichert.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-Mail
                    </th>
                    <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="hidden xl:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Erstellt am
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.vor_nachname}</div>
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.status}</div>
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.bewoerbene_position || '-'}</div>
                      </td>
                      <td className="hidden xl:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(user.created_at)}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="text-blue-600 hover:text-blue-900 transition-colors text-xs sm:text-sm"
                          >
                            👁️ Details
                          </button>
                          <button
                            onClick={() => exportUserPDF(user)}
                            disabled={exportingPDF === user.id}
                            className={`text-green-600 hover:text-green-900 transition-colors text-xs sm:text-sm ${
                              exportingPDF === user.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {exportingPDF === user.id ? '⏳ Exporting...' : '📄 PDF Export'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.vor_nachname)}
                            disabled={deletingUser === user.id}
                            className={`text-red-600 hover:text-red-900 transition-colors text-xs sm:text-sm ${
                              deletingUser === user.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {deletingUser === user.id ? '⏳ Löschen...' : '🗑️ Löschen'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Details für {selectedUser.vor_nachname}
              </h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Persönliche Daten</h3>
                  <div className="space-y-2 text-gray-800">
                    <div><strong className="text-gray-900">Name:</strong> <span className="text-gray-700">{selectedUser.vor_nachname}</span></div>
                    <div><strong className="text-gray-900">Anschrift:</strong> <span className="text-gray-700">{selectedUser.anschrift || '-'}</span></div>
                    <div><strong className="text-gray-900">Telefon:</strong> <span className="text-gray-700">{selectedUser.telefon || '-'}</span></div>
                    <div><strong className="text-gray-900">Mobil:</strong> <span className="text-gray-700">{selectedUser.mobil || '-'}</span></div>
                    <div><strong className="text-gray-900">E-Mail:</strong> <span className="text-gray-700">{selectedUser.email}</span></div>
                    <div><strong className="text-gray-900">Geburt am:</strong> <span className="text-gray-700">{selectedUser.geburt_am || '-'}</span></div>
                    <div><strong className="text-gray-900">in:</strong> <span className="text-gray-700">{selectedUser.in_ort || '-'}</span></div>
                    <div><strong className="text-gray-900">Geschlecht:</strong> <span className="text-gray-700">{selectedUser.geschlecht}</span></div>
                  </div>
                </div>

                {/* Career & Education */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Karriere & Ausbildung</h3>
                  <div className="space-y-2 text-gray-800">
                    <div><strong className="text-gray-900">Status:</strong> <span className="text-gray-700">{selectedUser.status}</span></div>
                    {selectedUser.status_sonstiges && (
                      <div><strong className="text-gray-900">Status Details:</strong> <span className="text-gray-700">{selectedUser.status_sonstiges}</span></div>
                    )}
                    <div><strong className="text-gray-900">Beworbene Position:</strong> <span className="text-gray-700">{selectedUser.bewoerbene_position || '-'}</span></div>
                    <div><strong className="text-gray-900">Höchster Abschluss:</strong> <span className="text-gray-700">{selectedUser.hoechster_abschluss || '-'}</span></div>
                    <div><strong className="text-gray-900">Staatsangehörigkeit:</strong> <span className="text-gray-700">{selectedUser.staatsangehoerigkeit || '-'}</span></div>
                    <div><strong className="text-gray-900">Mobilität:</strong> <span className="text-gray-700">{selectedUser.mobilitaet || '-'}</span></div>
                  </div>
                </div>

                {/* Banking Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bankdaten</h3>
                  <div className="space-y-2 text-gray-800">
                    <div><strong className="text-gray-900">IBAN:</strong> <span className="text-gray-700">{selectedUser.iban || '-'}</span></div>
                    <div><strong className="text-gray-900">BIC:</strong> <span className="text-gray-700">{selectedUser.bic || '-'}</span></div>
                    <div><strong className="text-gray-900">Bank:</strong> <span className="text-gray-700">{selectedUser.bank || '-'}</span></div>
                    <div><strong className="text-gray-900">Renten-Vers. Nr.:</strong> <span className="text-gray-700">{selectedUser.renten_vers_nr || '-'}</span></div>
                    <div><strong className="text-gray-900">Steuer-ID:</strong> <span className="text-gray-700">{selectedUser.steuer_id || '-'}</span></div>
                    <div><strong className="text-gray-900">Konfession:</strong> <span className="text-gray-700">{selectedUser.konfession || '-'}</span></div>
                    <div><strong className="text-gray-900">KV-Nr.:</strong> <span className="text-gray-700">{selectedUser.kv_nr || '-'}</span></div>
                    <div><strong className="text-gray-900">Mitglied in gesetzl. KV:</strong> <span className="text-gray-700">{selectedUser.mitglied_kv ? 'Ja' : 'Nein'}</span></div>
                  </div>
                </div>

                {/* Insurance & Additional */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Versicherung & Zusätzliches</h3>
                  <div className="space-y-2 text-gray-800">
                    <div><strong className="text-gray-900">Familienstand:</strong> <span className="text-gray-700">{selectedUser.familienstand}</span></div>
                    <div><strong className="text-gray-900">Unterhaltspflichtige Kinder:</strong> <span className="text-gray-700">{selectedUser.unterhaltspflichtige_kinder || '0'}</span></div>
                    <div><strong className="text-gray-900">Agentur Meldung:</strong> <span className="text-gray-700">{selectedUser.agentur_meldung || 'Nein'}</span></div>
                    {selectedUser.agentur_ort && (
                      <div><strong className="text-gray-900">Agentur Ort:</strong> <span className="text-gray-700">{selectedUser.agentur_ort}</span></div>
                    )}
                  </div>
                </div>

                {/* Employment Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Beschäftigungsdetails</h3>
                  <div className="space-y-2 text-gray-800">
                    <div><strong className="text-gray-900">Weitere Beschäftigungen:</strong> <span className="text-gray-700">{selectedUser.weitere_beschaeftigungen || 'Nein'}</span></div>
                    {selectedUser.beschaeftigungen_details && (
                      <div><strong className="text-gray-900">Beschäftigungen Details:</strong> <span className="text-gray-700">{selectedUser.beschaeftigungen_details}</span></div>
                    )}
                    {selectedUser.arbeitgeber_adresse && (
                      <div><strong className="text-gray-900">Arbeitgeber Adresse:</strong> <span className="text-gray-700">{selectedUser.arbeitgeber_adresse}</span></div>
                    )}
                    <div><strong className="text-gray-900">Kurzfristige Beschäftigung:</strong> <span className="text-gray-700">{selectedUser.kurzfristige_beschaeftigung || 'Nein'}</span></div>
                    {selectedUser.kurzfristige_bis && (
                      <div><strong className="text-gray-900">Kurzfristige bis:</strong> <span className="text-gray-700">{selectedUser.kurzfristige_bis}</span></div>
                    )}
                  </div>
                </div>

                {/* Notes & System */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notizen & System</h3>
                  <div className="space-y-2 text-gray-800">
                    {selectedUser.notizen && (
                      <div><strong className="text-gray-900">Notizen:</strong> <span className="text-gray-700">{selectedUser.notizen}</span></div>
                    )}
                    <div><strong className="text-gray-900">Erstellt am:</strong> <span className="text-gray-700">{formatDate(selectedUser.created_at)}</span></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Schließen
                </button>
                <button
                  onClick={() => exportUserPDF(selectedUser)}
                  disabled={exportingPDF === selectedUser.id}
                  className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
                    exportingPDF === selectedUser.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {exportingPDF === selectedUser.id ? '⏳ Exporting...' : '📄 PDF Export'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 