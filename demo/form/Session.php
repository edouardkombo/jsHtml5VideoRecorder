<?php

class Session
{
    /**
     *
     * @var integer
     */
    public $id;
    
    /**
     * Constructor
     */
    public function __construct()
    {
    } 
    
    /**
     * Init session id
     * 
     * @return array
     */
    public function init()
    {
        if (!isset($_SESSION['id'])) {
            $this->id = time();
            $_SESSION['id'] = "".$this->id."";            
        } else {
            $this->id = $_SESSION['id'];
        }
        
        return $_SESSION;
    }
    
    /**
     * Return id
     * 
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }
    
    /**
     * Destroy actual session
     */
    public function destroy()
    {
        $this->id = 0;
        unset($_SESSION['id']);
        session_unset();               
    }
}
