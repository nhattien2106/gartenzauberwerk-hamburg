<?php

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'admin');
define('DB_NAME', 'comgatus');

/**
 * Creates and returns a database connection using PDO
 * 
 * This function establishes a secure connection to the MySQL database
 * using the constants defined above. It includes error handling
 * to gracefully handle connection failures.
 * 
 * @return PDO Returns a PDO database connection object
 * @throws PDOException If the database connection fails
 */
function getDBconnectDB() 
{
    try{
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);

        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $pdo;
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}
?>
