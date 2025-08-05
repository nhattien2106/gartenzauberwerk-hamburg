<?php


/**
 * Handles user registration by inserting data into the database
 * 
 * This function processes user registration data, validates required fields,
 * and inserts the data into the database. It includes error handling for
 * missing required fields and database connection errors.
 * 
 * @return void
 */
function handleUserRegistration()
{

    $rawData = file_get_contents('php://input');

    $data = json_decode($rawData, true);

    $require = ['vor_nachname', 'email', 'mobil', 'geburt_am'];

    foreach ($require as $field) {

        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            return;
        }
    }

    $pdo = getDBconnectDB();
    $sql = "INSERT INTO users (
        vor_nachname, anschrift, telefon, mobil, email, 
        geburt_am, in_ort, geschlecht, status, status_sonstiges, hoechster_abschluss, 
        bewoerbene_position, familienstand, unterhaltspflichtige_kinder, staatsangehoerigkeit, mobilitaet, iban, 
        bic, bank, renten_vers_nr, steuer_id, konfession, 
        mitglied_kv, kv_nr, agentur_meldung, agentur_ort, weitere_beschaeftigungen, beschaeftigungen_details, 
        arbeitgeber_adresse, kurzfristige_beschaeftigung, kurzfristige_bis, notizen, erklarung_ort_datum, erklarung_unterschrift
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    try{
        $stmt = $pdo->prepare($sql);
        $stmt->execute(
            [
                $data['vor_nachname'],    // First & Last name from form
                $data['anschrift'],       // Address from form
                $data['telefon'] ?? '',   // Landline phone from form
                $data['mobil'],           // Mobile phone from form
                $data['email'],           // Email address from form
                $data['geburt_am'],       // Date of birth from form
                $data['in'] ?? $data['in_ort'] ?? '', // Place of birth from form
                $data['geschlecht'],      // Gender from form
                
                // Career information
                $data['status'],          // Career status from form
                $data['status_sonstiges'] ?? '', // Other career option if selected
                $data['hoechster_abschluss'] ?? '', // Education level from form
                $data['bewoerbene_position'] ?? '', // Position applying for from form
                
                // Family information
                $data['familienstand'],   // Marital status from form
                $data['unterhaltspflichtige_kinder'], // Number of children from form
                
                // Nationality and mobility
                $data['staatsangehoerigkeit'], // Nationality from form
                $data['mobilitaet'] ?? '',      // Driver license info from form
                
                // Banking information
                $data['iban'],            // IBAN from form
                $data['bic'] ?? '',             // BIC/SWIFT code from form
                $data['bank'] ?? '',            // Bank name from form
                
                // German-specific information
                $data['renten_vers_nr'] ?? '',  // German pension insurance number
                $data['steuer_id'] ?? '',       // German tax ID
                
                // Religious and insurance information
                $data['konfession'] ?? '',      // Religious denomination from form
                ($data['mitglied_kv'] === 'Ja' ? 1 : 0),     // Insurance membership status
                $data['kv_nr'] ?? '',           // Insurance number from form
                
                // Additional Information (Right Section)
                $data['agentur_meldung'] ?? 'nein',     // Agency notification
                $data['agentur_ort'] ?? '',             // Agency location
                $data['weitere_beschaeftigungen'] ?? 'nein', // Additional employments
                $data['beschaeftigungen_details'] ?? '', // Details of additional employments
                $data['arbeitgeber_adresse'] ?? '',     // Employer address
                $data['kurzfristige_beschaeftigung'] ?? 'nein', // Short-term employment
                (isset($data['kurzfristige_bis']) && $data['kurzfristige_bis'] && $data['kurzfristige_bis'] !== '') ? $data['kurzfristige_bis'] : null, // Short-term employment until date
                $data['notizen'] ?? '',                 // Notes
                $data['erklarung_ort_datum'] ?? '',     // Declaration place and date
                $data['erklarung_unterschrift'] ?? ''   // Digital signature
            ]
        );
        echo json_encode(['success' => 'User registered successfully']);
    } catch(PDOException $e){
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        
    }
    
    
}

/**
 * Retrieves career options from the database
 * 
 * This function fetches all active career options from the database and returns
 * them as a JSON-encoded array. It is used to populate dropdowns in the frontend.
 * 
 * @return void
 */
function getCareerOptions()
{
    // Test version - return mock data without database
    $options = [
        ['id' => 1, 'status_name' => 'Schüler/in'],
        ['id' => 2, 'status_name' => 'Auszubildende/r'],
        ['id' => 3, 'status_name' => 'Student/in'],
        ['id' => 4, 'status_name' => 'Angestellte/r'],
        ['id' => 5, 'status_name' => 'Arbeitssuchend'],
        ['id' => 6, 'status_name' => 'Rentner/in'],
        ['id' => 7, 'status_name' => 'Sonstiges']
    ];
    
    echo json_encode($options);
}

/**
 * Retrieves all users from the database
 * 
 * This function fetches all users from the database and returns them as a
 * JSON-encoded array. It is used for the management page to display all
 * submitted forms.
 * 
 * @return void
 */
function getAllUsers()
{
    try {
        $pdo = getDBconnectDB();
        $sql = "SELECT id, vor_nachname, anschrift, telefon, mobil, email, geburt_am, in_ort, status, status_sonstiges, geschlecht, familienstand, unterhaltspflichtige_kinder, hoechster_abschluss, staatsangehoerigkeit, mobilitaet, bewoerbene_position, iban, bic, bank, renten_vers_nr, steuer_id, konfession, mitglied_kv, kv_nr, agentur_meldung, agentur_ort, weitere_beschaeftigungen, beschaeftigungen_details, arbeitgeber_adresse, kurzfristige_beschaeftigung, kurzfristige_bis, notizen, created_at FROM users ORDER BY created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($users);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

/**
 * Validates an IBAN (International Bank Account Number)
 * 
 * This function checks if the provided IBAN is valid according to German banking
 * standards. It performs basic validation checks including country code, length,
 * and character set.
 * 
 * @param string $iban The IBAN to validate
 * 
 * @return bool True if the IBAN is valid, false otherwise
 */
function validateIBAN($iban)
{
    $iban = str_replace(' ', '', strtoupper($iban));

    if (substr($iban, 0, 2) !== 'DE') {
        return false;
    }
    if (strlen($iban) !== 22) {
        return false;
    }
    if (!preg_match('/^[A-Z0-9]+$/', $iban)) {
        return false;
    }

    return true;
}

/**
 * Validates a German tax ID (Steuer-ID)
 * 
 * This function checks if the provided tax ID is valid according to German tax
 * identification standards. It performs basic validation checks including length
 * and character set.
 * 
 * @param string $steuerId The tax ID to validate
 * 
 * @return bool True if the tax ID is valid, false otherwise
 */
function validateTaxID($steuerId)
{
    $steuerId = str_replace([' ', '-'], '', $steuerId);

    if (strlen($steuerId) !== 11) {
        return false;
    }

    if (!preg_match('/^[0-9]+$/', $steuerId)) {
        return false;
    }

    return true;
}

/**
 * Deletes a user from the database
 * 
 * This function deletes a user record from the database based on the provided
 * user ID. It is used for the management page to remove submitted forms.
 * 
 * @return void
 */
function deleteUser()
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id']) || !is_numeric($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid user ID provided']);
            return;
        }
        
        $pdo = getDBconnectDB();
        $sql = "DELETE FROM users WHERE id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$input['id']]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => 'User deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>