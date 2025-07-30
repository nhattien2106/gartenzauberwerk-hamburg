# 🧪 MITARBEITERSTAMMDATEN Testing Guide

## 🚀 Quick Start

### Option 1: Automated Tab Management
```bash
./start_test_environment.sh
```

### Option 2: Manual Setup
```bash
# Tab 1: Backend Server
cd backend && php -S localhost:8000

# Tab 2: Frontend Server  
cd frontend && npm run dev

# Tab 3: Test Suite
./test_cases.sh
```

## 📋 Test Cases Overview

### Test Case 1: Student (Student/in)
- **Status**: Student/in
- **Gender**: weiblich (female)
- **Marital Status**: ledig (single)
- **Children**: 0
- **Education**: Abitur
- **Position**: Werkstudent Marketing
- **Notes**: Verfügbar ab September 2024

### Test Case 2: Employee (Angestellte/r)
- **Status**: Angestellte/r
- **Gender**: maennlich (male)
- **Marital Status**: verheiratet (married)
- **Children**: 2
- **Education**: Bachelor Wirtschaftswissenschaften
- **Position**: Gartenbau-Techniker
- **Additional Jobs**: Minijob als Gärtner (10h/Woche)
- **Notes**: 5 Jahre Erfahrung im Gartenbau

### Test Case 3: Job Seeker (Arbeitssuchend)
- **Status**: Arbeitssuchend
- **Gender**: weiblich (female)
- **Marital Status**: geschieden (divorced)
- **Children**: 1
- **Education**: Ausbildung zur Gärtnerin
- **Position**: Gärtnerin
- **Short-term Employment**: ja (until 2024-06-30)
- **Notes**: Sofort verfügbar, flexible Arbeitszeiten

## 🎯 Testing Checklist

### Frontend Testing
- [ ] Form loads correctly at http://localhost:3000
- [ ] All fields are visible and functional
- [ ] Radio buttons work (gender, status)
- [ ] Form validation works
- [ ] Review page shows correct data
- [ ] PDF export generates properly
- [ ] Only selected options show in PDF (not all radio options)

### Backend Testing
- [ ] Career options API returns data
- [ ] Registration API accepts data
- [ ] Database insertion works
- [ ] Error handling for missing fields
- [ ] CORS headers working

### PDF Export Testing
- [ ] Single A4 page format
- [ ] Professional layout
- [ ] German field names
- [ ] All filled data visible
- [ ] Clean, readable text
- [ ] No color parsing errors

## 🔧 Individual Test Commands

### Test Career Options API
```bash
curl -X GET http://localhost:8000/api/index.php?path=career-options
```

### Test Case 1: Student
```bash
curl -X POST http://localhost:8000/api/index.php?path=register \
  -H "Content-Type: application/json" \
  -d '{
    "vor_nachname": "Anna Schmidt",
    "anschrift": "Musterstraße 123, 20095 Hamburg",
    "telefon": "040 12345678",
    "mobil": "0170 1234567",
    "email": "anna.schmidt@email.de",
    "geburt_am": "2000-05-15",
    "in": "Hamburg, Deutschland",
    "status": "Student/in",
    "geschlecht": "weiblich",
    "familienstand": "ledig",
    "unterhaltspflichtige_kinder": "0",
    "hoechster_abschluss": "Abitur",
    "staatsangehoerigkeit": "Deutsch",
    "mobilitaet": "Führerschein Klasse B",
    "bewoerbene_position": "Werkstudent Marketing",
    "iban": "DE89370400440532013000",
    "bic": "COBADEFFXXX",
    "bank": "Commerzbank",
    "renten_vers_nr": "12345678901",
    "steuer_id": "12345678901",
    "konfession": "evangelisch",
    "mitglied_kv": "Ja",
    "kv_nr": "A123456789",
    "agentur_meldung": "nein",
    "weitere_beschaeftigungen": "nein",
    "arbeitgeber_adresse": "Gartenzauberwerk GmbH, Gartenstraße 1, 20095 Hamburg",
    "kurzfristige_beschaeftigung": "nein",
    "notizen": "Verfügbar ab September 2024"
  }'
```

### Test Error Case (Missing Required Fields)
```bash
curl -X POST http://localhost:8000/api/index.php?path=register \
  -H "Content-Type: application/json" \
  -d '{
    "vor_nachname": "Test User",
    "email": "test@example.com"
  }'
```

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Kill existing processes
pkill -f "php -S"

# Start fresh
cd backend && php -S localhost:8000
```

### Frontend Not Starting
```bash
# Kill existing processes
pkill -f "next dev"

# Start fresh
cd frontend && npm run dev
```

### Database Connection Issues
- Check database credentials in `backend/config/database.php`
- Ensure MySQL server is running
- Verify database exists

### PDF Export Issues
- Check browser console for errors
- Ensure all form data is filled
- Try different browsers (Chrome recommended)

## 📊 Expected Results

### Career Options API Response
```json
[
  {"id": 1, "status_name": "Schüler/in"},
  {"id": 2, "status_name": "Auszubildende/r"},
  {"id": 3, "status_name": "Student/in"},
  {"id": 4, "status_name": "Angestellte/r"},
  {"id": 5, "status_name": "Arbeitssuchend"},
  {"id": 6, "status_name": "Rentner/in"},
  {"id": 7, "status_name": "Sonstiges"}
]
```

### Successful Registration Response
```json
{"success": "User registered successfully"}
```

### Error Response (Missing Fields)
```json
{"error": "Missing required field: vor_nachname"}
```

## 🎉 Success Criteria

- ✅ All 3 test cases submit successfully
- ✅ Database stores all data correctly
- ✅ PDF exports work for all cases
- ✅ Review page shows only selected options
- ✅ Form validation prevents invalid submissions
- ✅ Error handling works properly
- ✅ CORS allows frontend-backend communication

## 📝 Notes

- The backend currently uses mock data for career options
- Database connection needs to be configured in `backend/config/database.php`
- PDF export uses html2canvas and jsPDF libraries
- All form fields are in German as per requirements
- Employer section has been removed as requested 