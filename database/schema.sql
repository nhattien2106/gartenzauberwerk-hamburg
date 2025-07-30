-- Personal Information Form Database Schema
-- Comprehensive user data collection system

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Basic Personal Information (German field names)
    vor_nachname VARCHAR(100) NOT NULL, -- First and Last Name
    anschrift TEXT NOT NULL, -- Address
    telefon VARCHAR(20), -- Landline phone
    mobil VARCHAR(20) NOT NULL, -- Mobile phone
    email VARCHAR(100) UNIQUE NOT NULL,
    geburt_am DATE NOT NULL, -- Date of birth
    in_ort VARCHAR(100) NOT NULL, -- Place of birth
    geschlecht ENUM('weiblich', 'maennlich') NOT NULL, -- Gender
    
    -- Career and Education
    status VARCHAR(100) NOT NULL, -- Career status
    status_sonstiges VARCHAR(255), -- For "other" option in career status
    hoechster_abschluss VARCHAR(100), -- Highest education level
    bewoerbene_position VARCHAR(100), -- Position applying for
    
    -- Family Information
    familienstand ENUM('ledig', 'verheiratet', 'geschieden', 'verwitwet', 'partnerschaft') NOT NULL,
    unterhaltspflichtige_kinder INT DEFAULT 0, -- Number of dependent children
    
    -- Nationality and Mobility
    staatsangehoerigkeit VARCHAR(100) NOT NULL, -- Nationality
    mobilitaet TEXT, -- For driver license and other mobility info
    
    -- Banking Information (European format)
    iban VARCHAR(34) NOT NULL, -- IBAN can be up to 34 characters
    bic VARCHAR(11), -- BIC/SWIFT code
    bank VARCHAR(100), -- Bank name
    
    -- German-specific Information
    renten_vers_nr VARCHAR(20), -- German pension insurance number
    steuer_id VARCHAR(20), -- German tax ID
    
    -- Religious and Insurance
    konfession VARCHAR(100), -- Religious denomination
    mitglied_kv BOOLEAN DEFAULT FALSE, -- Member of health insurance
    kv_nr VARCHAR(50), -- Health insurance number
    
    -- Additional Information
    agentur_meldung ENUM('ja', 'nein') DEFAULT 'nein', -- Agency notification
    agentur_ort VARCHAR(100), -- Agency location
    weitere_beschaeftigungen ENUM('ja', 'nein') DEFAULT 'nein', -- Additional employments
    beschaeftigungen_details TEXT, -- Details of additional employments
    arbeitgeber_adresse TEXT, -- Employer address
    kurzfristige_beschaeftigung ENUM('ja', 'nein') DEFAULT 'nein', -- Short-term employment
    kurzfristige_bis DATE, -- Short-term employment until date
    notizen TEXT, -- Notes
    
    -- System Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_email (email),
    INDEX idx_vor_nachname (vor_nachname),
    INDEX idx_iban (iban)
);

-- Career Status Options Table (for checkbox management)
CREATE TABLE career_status_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default career status options (German)
INSERT INTO career_status_options (status_name) VALUES
('Schüler/in'),
('Auszubildende/r'),
('Student/in'),
('Angestellte/r'),
('Arbeitssuchend'),
('Rentner/in'),
('Sonstiges');

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
