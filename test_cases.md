# Personal Information Form - Comprehensive Test Cases

## Test Case: Complete Form Submission with Signature

### **Test Objective:**
Verify that the complete form can be filled out and submitted successfully, including all required fields, optional fields, and signature functionality.

### **Test Data:**
```json
{
  "vor_nachname": "Max Mustermann",
  "anschrift": "Musterstraße 123, 12345 Hamburg",
  "telefon": "040 12345678",
  "mobil": "0170 1234567",
  "email": "max.mustermann@example.com",
  "geburt_am": "1990-05-15",
  "in": "Deutschland",
  "status": "Angestellte/r",
  "status_sonstiges": "",
  "geschlecht": "maennlich",
  "familienstand": "verheiratet",
  "unterhaltspflichtige_kinder": "2",
  "hoechster_abschluss": "Abitur",
  "staatsangehoerigkeit": "Deutschland",
  "mobilitaet": "Führerschein Klasse B",
  "bewoerbene_position": "Gärtner",
  "iban": "DE89370400440532013000",
  "bic": "COBADEFFXXX",
  "bank": "Commerzbank",
  "renten_vers_nr": "12345678901",
  "steuer_id": "12 345 678 901",
  "konfession": "evangelisch",
  "mitglied_kv": "Ja, gesetzlich versichert",
  "kv_nr": "A123456789",
  "agentur_meldung": "nein",
  "agentur_ort": "",
  "weitere_beschaeftigungen": "ja",
  "beschaeftigungen_details": "Nebenjob als Taxifahrer",
  "arbeitgeber_adresse": "Taxi Hamburg GmbH, Taxistraße 1, 20000 Hamburg",
  "kurzfristige_beschaeftigung": "nein",
  "kurzfristige_bis": "",
  "notizen": "Verfügbar ab sofort",
  "erklarung_ort_datum": "Hamburg, 05.08.2025",
  "erklarung_unterschrift": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

### **Test Steps:**

#### **1. Form Navigation Test**
- [ ] Navigate to the form page
- [ ] Verify all sections are visible: Personal Data, Status, Gender, Additional Information, Banking, German-specific, Declaration
- [ ] Verify all required fields are marked with asterisk (*)

#### **2. Personal Data Section Test**
- [ ] Fill in "Vor & Nachname": "Max Mustermann"
- [ ] Fill in "Anschrift": "Musterstraße 123, 12345 Hamburg"
- [ ] Fill in "Telefon": "040 12345678"
- [ ] Fill in "Mobil": "0170 1234567"
- [ ] Fill in "E-Mail": "max.mustermann@example.com"
- [ ] Fill in "Geburt am": "1990-05-15"
- [ ] **Test Country Dropdown**: Click "Geburt Ort" field
  - [ ] Verify dropdown opens with searchable country list
  - [ ] Type "Deutsch" and verify "Deutschland" appears
  - [ ] Select "Deutschland"
  - [ ] Verify field shows "Deutschland"

#### **3. Status Section Test**
- [ ] Select "Angestellte/r" radio button
- [ ] Verify "Sonstiges" option is not visible (since not selected)

#### **4. Gender Section Test**
- [ ] Select "Männlich" radio button
- [ ] Verify selection is saved

#### **5. Additional Information Section Test**
- [ ] Fill in "Familienstand": Select "Verheiratet"
- [ ] Fill in "unterhaltspflichtige Kinder": Select "2"
- [ ] Fill in "Höchster Abschluss": "Abitur"
- [ ] **Test Country Dropdown**: Click "Staatsangehörigkeit" field
  - [ ] Verify dropdown opens with searchable country list
  - [ ] Type "Deutsch" and verify "Deutschland" appears
  - [ ] Select "Deutschland"
  - [ ] Verify field shows "Deutschland"
- [ ] Fill in "Mobilität": "Führerschein Klasse B"
- [ ] Fill in "Beworbene Position": "Gärtner"

#### **6. Banking Information Section Test**
- [ ] Fill in "IBAN": "DE89370400440532013000"
- [ ] Fill in "BIC": "COBADEFFXXX"
- [ ] Fill in "Bank": "Commerzbank"

#### **7. German-specific Information Section Test**
- [ ] Fill in "Renten-Vers. Nr.": "12345678901"
- [ ] Fill in "Steuer-ID": "12 345 678 901"
- [ ] Fill in "Konfession": "evangelisch"
- [ ] Fill in "Mitglied in gesetzl. KV": "Ja, gesetzlich versichert"
- [ ] Fill in "KV-Nr.": "A123456789"

#### **8. Additional Information Section Test**
- [ ] Select "Nein" for "Agentur für Arbeit"
- [ ] Select "Ja" for "Weitere Beschäftigungen"
- [ ] Fill in "Beschäftigungen Details": "Nebenjob als Taxifahrer"
- [ ] Fill in "Arbeitgeber Adresse": "Taxi Hamburg GmbH, Taxistraße 1, 20000 Hamburg"
- [ ] Select "Nein" for "Kurzfristige Beschäftigung"
- [ ] Fill in "Notizen": "Verfügbar ab sofort"

#### **9. Declaration Section Test**
- [ ] Fill in "Ort, Datum": "Hamburg, 05.08.2025"
- [ ] **Test Signature Functionality**:
  - [ ] Click on signature area
  - [ ] Draw a signature using mouse/touch
  - [ ] Verify signature appears in the field
  - [ ] Test "Löschen" button to clear signature
  - [ ] Redraw signature
  - [ ] Verify signature is saved

#### **10. Form Validation Test**
- [ ] Try to submit form without required fields
- [ ] Verify error messages appear for missing fields
- [ ] Fill in all required fields
- [ ] Verify no validation errors remain

#### **11. Review Page Test**
- [ ] Click "Formular einreichen" button
- [ ] Verify review page opens
- [ ] Verify all entered data is displayed correctly:
  - [ ] Personal information
  - [ ] Country selections (Deutschland for both fields)
  - [ ] Signature shows "Unterschrieben" status
  - [ ] Declaration place and date

#### **12. Backend Submission Test**
- [ ] Click "Formular einreichen" on review page
- [ ] Verify success message appears
- [ ] Verify form data is saved to database

#### **13. Database Verification Test**
```sql
-- Check if data was saved correctly
SELECT 
  vor_nachname,
  email,
  in as geburtsort,
  staatsangehoerigkeit,
  unterhaltspflichtige_kinder,
  erklarung_ort_datum,
  LENGTH(erklarung_unterschrift) as signature_length
FROM users 
WHERE email = 'max.mustermann@example.com'
ORDER BY created_at DESC 
LIMIT 1;
```

#### **14. Management Page Test**
- [ ] Navigate to management page
- [ ] Verify new user appears in the list
- [ ] Click "Details" to view user information
- [ ] Verify all data is displayed correctly:
  - [ ] Country fields show "Deutschland"
  - [ ] Children field shows "2" (as number)
  - [ ] Signature field shows "Unterschrieben"

#### **15. PDF Export Test**
- [ ] Click "PDF Export" button
- [ ] Verify PDF is generated
- [ ] Verify PDF contains:
  - [ ] All form data
  - [ ] Country names correctly displayed
  - [ ] Signature image in PDF

### **Expected Results:**

#### **Frontend Validation:**
- ✅ All required fields show validation errors when empty
- ✅ Country dropdowns work with search functionality
- ✅ Signature can be drawn and cleared
- ✅ Review page displays all data correctly

#### **Backend Storage:**
- ✅ All form data saved to database
- ✅ Country fields saved as full country names
- ✅ Children field saved as integer (2)
- ✅ Signature saved as base64 data URL
- ✅ Declaration fields saved correctly

#### **Management Interface:**
- ✅ User appears in management list
- ✅ Details modal shows all information
- ✅ Country fields display correctly
- ✅ Children field shows as number

#### **PDF Generation:**
- ✅ PDF contains all form data
- ✅ Signature appears as image in PDF
- ✅ Country names displayed correctly

### **Test Environment:**
- **Frontend:** Next.js development server
- **Backend:** PHP development server on port 8000
- **Database:** MySQL with updated schema
- **Browser:** Chrome/Firefox with developer tools

### **Notes:**
- The signature data URL will be a long base64 string starting with "data:image/png;base64,"
- Country dropdowns should filter results as you type
- All required fields must be completed before form submission
- The test uses realistic German data and addresses 