<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

/**
 * API Entry Point for Personal Information Form
 * 
 * This file handles all incoming HTTP requests and routes them to appropriate
 * functions based on the request method and path.
 * 
 * @package PersonalInfoForm
 * @version 1.0
 */

header('Content-Type: application/json');

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];

$path = $_GET['path'] ?? '';

switch ($method) {
case 'POST':
    if ($path === 'register') {
        handleUserRegistration();
    }
    break;
case 'GET':
    if ($path === 'career-options') {
        getCareerOptions();
    } elseif ($path === 'users') {
        getAllUsers();
    }
    break;
case 'DELETE':
    if ($path === 'delete-user') {
        deleteUser();
    }
    break;
default:
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    break;
}
?>