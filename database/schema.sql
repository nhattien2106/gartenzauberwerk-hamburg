-- Personal Information Form Database Schema
-- Comprehensive user data collection system

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Basic Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    telefon VARCHAR(20),
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    land_of_birth VARCHAR(100) NOT NULL,
    sex ENUM('male', 'female', 'other') NOT NULL,
    
    -- Career and Education
    status_career VARCHAR(255) NOT NULL,
    career_other VARCHAR(255), -- For "other" option in career status
    graduate_status VARCHAR(100),
    apply_position VARCHAR(100),
    
    -- Family Information
    family_status ENUM('single', 'married', 'divorced', 'widowed', 'partnership') NOT NULL,
    children_count INT DEFAULT 0,
    
    -- Nationality and Mobility
    nationality VARCHAR(100) NOT NULL,
    mobil_status TEXT, -- For driver license and other mobility info
    
    -- Banking Information (European format)
    iban VARCHAR(34) NOT NULL, -- IBAN can be up to 34 characters
    bic VARCHAR(11), -- BIC/SWIFT code
    bank_name VARCHAR(100),
    
    -- German-specific Information
    rentenversicherung_nummer VARCHAR(20), -- German pension insurance number
    steuer_id VARCHAR(20), -- German tax ID
    
    -- Religious and Insurance
    konfession VARCHAR(100), -- Religious denomination
    member_of_assurance BOOLEAN DEFAULT FALSE,
    assurance_number VARCHAR(50), -- Format: word + numbers
    
    -- System Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_email (email),
    INDEX idx_last_name (last_name),
    INDEX idx_iban (iban)
);

-- Career Status Options Table (for checkbox management)
CREATE TABLE career_status_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default career status options
INSERT INTO career_status_options (status_name) VALUES
('Student'),
('pupil'),
('trainee'),
('employee'),
('job-seeker'),
('Retired'),
('Other');

-- User Career Status Junction Table (for multiple selections)
CREATE TABLE user_career_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    career_status_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (career_status_id) REFERENCES career_status_options(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_career (user_id, career_status_id)
);

-- Comments for documentation
COMMENT ON TABLE users IS 'Main table for storing personal information form data';
COMMENT ON COLUMN users.iban IS 'International Bank Account Number (European format)';
COMMENT ON COLUMN users.bic IS 'Bank Identifier Code (SWIFT)';
COMMENT ON COLUMN users.rentenversicherung_nummer IS 'German pension insurance number';
COMMENT ON COLUMN users.steuer_id IS 'German tax identification number';
COMMENT ON COLUMN users.assurance_number IS 'Insurance number starting with word followed by numbers';
