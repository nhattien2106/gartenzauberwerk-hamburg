#!/bin/bash

# MITARBEITERSTAMMDATEN Test Environment
# This script starts all necessary services in separate tabs

echo "🚀 Starting MITARBEITERSTAMMDATEN Test Environment"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "test_cases.sh" ]; then
    print_warning "Please run this script from the project root directory"
    exit 1
fi

# Function to create a new terminal tab (works with most terminal emulators)
create_tab() {
    local title="$1"
    local command="$2"
    
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="$title" -- bash -c "$command; exec bash"
    elif command -v konsole &> /dev/null; then
        konsole --new-tab -e bash -c "$command; exec bash" &
    elif command -v xterm &> /dev/null; then
        xterm -title "$title" -e bash -c "$command; exec bash" &
    else
        print_warning "No supported terminal found. Please run commands manually:"
        echo "Tab 1: $command"
    fi
}

# Start backend server
start_backend() {
    print_status "Starting PHP backend server..."
    create_tab "Backend Server" "cd backend && php -S localhost:8000"
    sleep 2
}

# Start frontend server
start_frontend() {
    print_status "Starting Next.js frontend server..."
    create_tab "Frontend Server" "cd frontend && npm run dev"
    sleep 3
}

# Start test suite
start_tests() {
    print_status "Starting test suite..."
    create_tab "Test Suite" "./test_cases.sh"
}

# Show manual instructions
show_manual_instructions() {
    echo ""
    echo "📋 Manual Tab Setup (if automatic tabs don't work):"
    echo "=================================================="
    echo ""
    echo "Tab 1 - Backend Server:"
    echo "  cd backend && php -S localhost:8000"
    echo ""
    echo "Tab 2 - Frontend Server:"
    echo "  cd frontend && npm run dev"
    echo ""
    echo "Tab 3 - Test Suite:"
    echo "  ./test_cases.sh"
    echo ""
    echo "Tab 4 - Database (if needed):"
    echo "  mysql -u your_username -p your_database_name"
    echo ""
}

# Main menu
show_menu() {
    echo ""
    echo "🎛️  Test Environment Menu"
    echo "========================"
    echo "1) Start Backend Server"
    echo "2) Start Frontend Server"
    echo "3) Start Test Suite"
    echo "4) Start All Services"
    echo "5) Show Manual Instructions"
    echo "6) Exit"
    echo ""
    read -p "Select an option (1-6): " choice
}

# Start all services
start_all() {
    print_status "Starting all services..."
    start_backend
    start_frontend
    start_tests
    
    echo ""
    print_success "All services started!"
    echo ""
    echo "🌐 Access Points:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000/api/"
    echo "  Test Suite: Running in separate tab"
    echo ""
}

# Main execution
main() {
    while true; do
        show_menu
        
        case $choice in
            1)
                start_backend
                ;;
            2)
                start_frontend
                ;;
            3)
                start_tests
                ;;
            4)
                start_all
                ;;
            5)
                show_manual_instructions
                ;;
            6)
                print_success "Goodbye!"
                exit 0
                ;;
            *)
                print_warning "Invalid option. Please select 1-6."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main 