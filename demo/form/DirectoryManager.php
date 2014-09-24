<?php

use \DirectoryIterator;
use \RecursiveIteratorIterator;
use \RecursiveDirectoryIterator;
use \Exception;

class DirectoryManager extends DirectoryIterator {

    /**
     *
     * @var string 
     */
    public $directory;
    
    /**
     *
     * @var DirectoryIterator 
     */
    public $iterator;
    
    /**
     *
     * @var array 
     */
    public $fileNames = array();     
    
    /**
     *
     * @var array 
     */
    public $files = array();     
    
    /**
     * Constructor
     */
    public function __construct()
    {
        
    }
    
    /**
     * Set directory iterator and automatically browse directory content
     * Create directory if not exists
     * 
     * @param string $directory
     * 
     * @return boolean
     * @throws Exception
     */
    public function setDirectoryIterator($directory)
    {
        $this->directory = $directory;
        
        $this->createDirectory($this->directory);

        $this->iterator = new DirectoryIterator($directory);
        
        if (is_object($this->iterator)) {
            $this->browse();
            
            return true;
   
        } else {
            throw new Exception("$directory is invalid directory !");
        } 
    }
    
    /**
     * List all directory content recursively
     * 
     * @param array $files
     *  
     * @return mixed
     */
    public function browse()
    {
        $files = (array) array();
        
        if (empty($this->iterator)) {
            return false;
        }
        
        foreach ($this->iterator as $info) {
            
            if ($info->isFile()) {
                
                $files[$info->__toString()] = $info;
                
                //Save filenames to work on it later
                $this->fileNames[$info->getFilename()] = $info->getFilename();
            
            } else if (!$info->isDot()) {
                
                $list = array(
                    $info->__toString() => $this->recursiveDirectoryIterator(
                        $this->directory.DIRECTORY_SEPARATOR.$info->__toString()
                    )
                );
                
                $this->files = (!empty($files)) ? 
                    array_merge_recursive($files, $filest) : $list ;
            }
        }
        
        return $this->files;        
    }
    
    
    /**
     * Get directories content
     * 
     * @return array
     */
    public function getContent()
    {
        return (array) $this->fileNames;
    }

    /**
     * Create directory if needed
     * 
     * @param string $directory Directory to create
     * 
     * @return boolean
     */
    private function createDirectory($directory)
    {
        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }
        
        return true;
    }    
    
    /**
     * Move all directory files or one specific file to another directory
     * Try to create directory if not exists
     * 
     * @param string $newDirectory New directory where to move files
     * @param string $fileToMove   Specific file to move
     * 
     * @return boolean
     */
    public function move($newDirectory, $fileToMove = null)
    {
        if((sizeof($this->fileNames)>=1) && !empty($this->fileNames)) {
            
            $this->createDirectory($newDirectory);
            
            foreach ($this->fileNames as $key => $file){
                $basePath = $this->directory . DIRECTORY_SEPARATOR . $file;
                $newPath  = $newDirectory . DIRECTORY_SEPARATOR . $file;

                if (!empty($fileToMove)) {
                    ($file === $fileToMove) ? copy($basePath, $newPath) : '' ;
                } else {
                    copy($basePath, $newPath);
                }

            }
            
            return true;
        }
        
        return false;
    }
     
    /**
     * Delete all directory content and folders, or one specific file
     * 
     * @param string $fileToDelete Specific file to delete
     * 
     * @return boolean
     */
    public function delete($fileToDelete = null)
    {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->directory, 
                RecursiveDirectoryIterator::SKIP_DOTS
            ),
            RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($files as $fileInfo) {
            
            if (($fileInfo->getFilename() === $fileToDelete) && !empty($fileToDelete)) {
                unlink($fileInfo->getRealPath());
                $this->updateFiles($fileInfo);
                
            } else if (empty($fileToDelete)) { 
                unlink($fileInfo->getRealPath());
                $this->updateFiles($fileInfo);
            }            
            
        }

        //Remove all empty directories        
        (empty($fileToDelete)) ? rmdir($this->directory) : ''; 
        
        return true;
    }
    
    /**
     * Update file content
     * 
     * @param object $info Informations on files
     * 
     * @return array
     */
    private function updateFiles($info)
    {
        if ($info->getFilename() === $this->fileNames[$info->getFilename()]) {
            unset($this->fileNames[$info->getFilename()]);
        }
        
        return $this->fileNames;
    } 
}