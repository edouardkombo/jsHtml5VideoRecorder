<?php
if (empty($_SESSION['id'])) {
    session_start();    
}

ini_set('memory_limit', '1024M');

require 'Session.php';
require 'DirectoryManager.php';

$session    = new Session();
$directory  = new DirectoryManager();

$session->init();

if (isset($_POST)) {
    
    /*************************************
     *** GET PICTURE ***
     ************************************/    
    //Variables
    $path               = (string) filter_input(INPUT_GET, 'path');                 
    $extension          = (string) filter_input(INPUT_GET, 'extension');
    $type               = (string) filter_input(INPUT_GET, 'type');     

    //Set session and directory
    $id             = $session->getId();    
    
    //"/media/Temp/1234/1234.yyy"
    $simplePath             = $path . $id . DIRECTORY_SEPARATOR . $id . '.' . $extension;
    
    //"C:/xxxx/media/Temp/1234"
    $basePath                = (string) $_SERVER['DOCUMENT_ROOT'] . $path . $id;   
    
    //"C:/xxxx/media/Temp/1234/1234.yyy"
    $baseFilename            = (string) $basePath . DIRECTORY_SEPARATOR . $id . '.' . $extension;    
    
    //Search inside "C:/xxxx/media/Temp/1234" directory
    $directory->setDirectoryIterator($basePath);

    //Get media
    $media = file_get_contents('php://input');

    $firstArray     = array('\\', '/', '%5C');
    $secondArray    = array('/', '/', '/');

    //Format strings
    $baseFilename   = str_replace($firstArray, $secondArray, $baseFilename);
    $simplePath     = str_replace($firstArray, $secondArray, $simplePath);

    //If a content exists, we delete and replace it
    $directory->delete($id . '.' . $extension);

    //Create file and return status
    file_put_contents($baseFilename, $media);       
       
    //Return media url inside media directory
    echo $simplePath;    
}
