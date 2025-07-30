#!/bin/bash

# MITARBEITERSTAMMDATEN Test Cases
# This script tests the backend API with 3 different user scenarios

echo "🧪 MITARBEITERSTAMMDATEN API Test Suite"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if backend is running
check_backend() {
    print_status "Checking if backend is running..."
    if curl -s http://localhost:8000/api/index.php?path=career-options > /dev/null; then
        print_success "Backend is running on localhost:8000"
        return 0
    else
        print_error "Backend is not running! Please start it with: cd backend && php -S localhost:8000"
        return 1
    fi
}

# Test Case 1: Student
test_case_1() {
    echo ""
    echo "📚 Test Case 1: Student (Student/in)"
    echo "===================================="
    
    print_status "Testing student registration..."
    
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
    
    echo ""
    print_success "Test Case 1 completed!"
}

# Test Case 2: Employee
test_case_2() {
    echo ""
    echo "💼 Test Case 2: Employee (Angestellte/r)"
    echo "========================================"
    
    print_status "Testing employee registration..."
    
    curl -X POST http://localhost:8000/api/index.php?path=register \
        -H "Content-Type: application/json" \
        -d '{
            "vor_nachname": "Michael Weber",
            "anschrift": "Hauptstraße 45, 20144 Hamburg",
            "telefon": "040 98765432",
            "mobil": "0151 9876543",
            "email": "m.weber@web.de",
            "geburt_am": "1985-12-03",
            "in": "München, Deutschland",
            "status": "Angestellte/r",
            "geschlecht": "maennlich",
            "familienstand": "verheiratet",
            "unterhaltspflichtige_kinder": "2",
            "hoechster_abschluss": "Bachelor Wirtschaftswissenschaften",
            "staatsangehoerigkeit": "Deutsch",
            "mobilitaet": "Führerschein Klasse B, C1",
            "bewoerbene_position": "Gartenbau-Techniker",
            "iban": "DE12500105170648489890",
            "bic": "INGDDEFFXXX",
            "bank": "ING-DiBa",
            "renten_vers_nr": "98765432109",
            "steuer_id": "98765432109",
            "konfession": "katholisch",
            "mitglied_kv": "Ja",
            "kv_nr": "B987654321",
            "agentur_meldung": "ja",
            "agentur_ort": "Hamburg",
            "weitere_beschaeftigungen": "ja",
            "beschaeftigungen_details": "Minijob als Gärtner (10h/Woche)",
            "arbeitgeber_adresse": "Gartenzauberwerk GmbH, Gartenstraße 1, 20095 Hamburg",
            "kurzfristige_beschaeftigung": "nein",
            "notizen": "5 Jahre Erfahrung im Gartenbau"
        }'
    
    echo ""
    print_success "Test Case 2 completed!"
}

# Test Case 3: Job Seeker
test_case_3() {
    echo ""
    echo "🔍 Test Case 3: Job Seeker (Arbeitssuchend)"
    echo "============================================"
    
    print_status "Testing job seeker registration..."
    
    curl -X POST http://localhost:8000/api/index.php?path=register \
        -H "Content-Type: application/json" \
        -d '{
            "vor_nachname": "Sarah Müller",
            "anschrift": "Kirchweg 7, 20249 Hamburg",
            "telefon": "040 55566677",
            "mobil": "0162 5556667",
            "email": "sarah.mueller@gmail.com",
            "geburt_am": "1992-08-22",
            "in": "Berlin, Deutschland",
            "status": "Arbeitssuchend",
            "geschlecht": "weiblich",
            "familienstand": "geschieden",
            "unterhaltspflichtige_kinder": "1",
            "hoechster_abschluss": "Ausbildung zur Gärtnerin",
            "staatsangehoerigkeit": "Deutsch",
            "mobilitaet": "Führerschein Klasse B",
            "bewoerbene_position": "Gärtnerin",
            "iban": "DE89370400440532013001",
            "bic": "COBADEFFXXX",
            "bank": "Commerzbank",
            "renten_vers_nr": "55566677788",
            "steuer_id": "55566677788",
            "konfession": "ohne Konfession",
            "mitglied_kv": "Ja",
            "kv_nr": "C555666777",
            "agentur_meldung": "ja",
            "agentur_ort": "Hamburg",
            "weitere_beschaeftigungen": "nein",
            "arbeitgeber_adresse": "Gartenzauberwerk GmbH, Gartenstraße 1, 20095 Hamburg",
            "kurzfristige_beschaeftigung": "ja",
            "kurzfristige_bis": "2024-06-30",
            "notizen": "Sofort verfügbar, flexible Arbeitszeiten"
        }'
    
    echo ""
    print_success "Test Case 3 completed!"
}

# Test Career Options API
test_career_options() {
    echo ""
    echo "🎯 Test Career Options API"
    echo "=========================="
    
    print_status "Fetching career options..."
    
    curl -X GET http://localhost:8000/api/index.php?path=career-options \
        -H "Content-Type: application/json"
    
    echo ""
    print_success "Career options test completed!"
}

# Test Error Cases
test_error_cases() {
    echo ""
    echo "❌ Test Error Cases"
    echo "==================="
    
    print_status "Testing missing required fields..."
    
    # Test missing required field
    curl -X POST http://localhost:8000/api/index.php?path=register \
        -H "Content-Type: application/json" \
        -d '{
            "vor_nachname": "Test User",
            "email": "test@example.com"
        }'
    
    echo ""
    print_success "Error cases test completed!"
}

# Main menu
show_menu() {
    echo ""
    echo "🎛️  Test Management Menu"
    echo "========================"
    echo "1) Test Career Options API"
    echo "2) Test Case 1: Student"
    echo "3) Test Case 2: Employee"
    echo "4) Test Case 3: Job Seeker"
    echo "5) Test Error Cases"
    echo "6) Run All Tests"
    echo "7) Exit"
    echo ""
    read -p "Select an option (1-7): " choice
}

# Run all tests
run_all_tests() {
    print_status "Running all tests..."
    
    if check_backend; then
        test_career_options
        test_case_1
        test_case_2
        test_case_3
        test_error_cases
        
        echo ""
        print_success "All tests completed!"
    fi
}

# Main execution
main() {
    echo "🚀 Starting MITARBEITERSTAMMDATEN Test Suite..."
    
    if ! check_backend; then
        exit 1
    fi
    
    while true; do
        show_menu
        
        case $choice in
            1)
                test_career_options
                ;;
            2)
                test_case_1
                ;;
            3)
                test_case_2
                ;;
            4)
                test_case_3
                ;;
            5)
                test_error_cases
                ;;
            6)
                run_all_tests
                ;;
            7)
                print_success "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please select 1-7."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main 