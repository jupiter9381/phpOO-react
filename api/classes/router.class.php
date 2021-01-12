<?php
/**
 * This router will return a main, documentation or about page
 *
 * @author YOUR NAME
 *
 */
class Router {
    private $page;
    private $type = "HTML";

    /**
     * @param $pageType - can be "main", "documentation" or "about"
     */
    public function __construct($recordset) {
        $url = $_SERVER["REQUEST_URI"];
        $path = parse_url($url)['path'];
        //$path = str_replace(BASEPATH,"",$path);
        
        $pathArr = explode('/',$path);
        $path = (empty($pathArr[1])) ? "main" : $pathArr[1];
        ($path == "api")
            ? $this->api_route($pathArr, $recordset)
            : $this->html_route($path);

    }

    public function api_route($pathArr, $recordset) {
        $this->type = "JSON";
        $this->page = new JSONpage($pathArr, $recordset);
    }

    public function html_route($path) {
        $ini['routes'] = parse_ini_file("config/routes.ini",true);
        $pageInfo = isset($path, $ini['routes'][$path])
            ? $ini['routes'][$path]
            : $ini['routes']['error'];

        $this->page = new WebPageWithNav($pageInfo['title'], $pageInfo['heading1'], $pageInfo['footer']);
        $this->page->addToBody($pageInfo['text']);

        $documentations = "Endpoint: /api/ <br>
                    Description: Gives basic information about the API in JSON format including a welcome message, the developer name, and a list of available endpoints <br>
                    Parameters: None <br>
                    Authentication: None <br>
                    Example output: {'message':'welcome','author':'Mohammad Gerashi'} <p>
                    
                    Endpoint: /api/login <br>
                    Type: POST <br>
                    Description: To login with email and password <br>
                    Parameters: {email: '', password: ''} <br>
                    Authentication: None <br>
                    Example output: {status: 200, message: 'User authorised, Welcome John', token: '', user: {}} <p>

                    Endpoint: /api/schedule?day=Monday <br>
                    Type: GET <br>
                    Description: To get slots data based on Day (Monday~Sunday)<br>
                    Parameters: None <br>
                    Authentication: None <br>
                    Example output: {count: 5, data: []} <p>

                    Endpoint: /api/schedule_detail?slotId=10209 <br>
                    Type: GET <br>
                    Description: To get slots data including session, content, author and room information based on slotId<br>
                    Parameters: None <br>
                    Authentication: None <br>
                    Example output: {count: 5, data: []} <p>

                    Endpoint: /api/schedule_detail?slotId=10209 <br>
                    Type: GET <br>
                    Description: To get slots data including session, content, author and room information based on slotId<br>
                    Parameters: None <br>
                    Authentication: None <br>
                    Example output: {count: 5, data: []} <p>

                    Endpoint: /api/authors <br>
                    Type: GET <br>
                    Description: To get authors list<br>
                    Parameters: None <br>
                    Authentication: None <br>
                    Example output: {count: 3768, data: []} <p>

                    Endpoint: /api/content_authors?authorId=13087 <br>
                    Type: GET <br>
                    Description: To get author information and content data based on authorId<br>
                    Parameters: None <br>
                    Authentication: JWT Token in header <br>
                    Example output: {count: 1, data: []} <p>

                    Endpoint: /api/content_authors?authorId=13087 <br>
                    Type: GET <br>
                    Description: To get author information and content data based on authorId<br>
                    Parameters: None <br>
                    Authentication: JWT Token in header <br>
                    Example output: {count: 1, data: []} <p>

                    Endpoint: /api/sessions <br>
                    Type: GET <br>
                    Description: To get all sessions data<br>
                    Parameters: None <br>
                    Authentication: JWT Token in header <br>
                    Example output: {count: 370, data: []} <p>

                    Endpoint: /api/sessions?sessionId=2375&name=Gender <br>
                    Type: GET <br>
                    Description: To update session name based on sessionId if only admin<br>
                    Parameters: None <br>
                    Authentication: JWT Token in header <br>
                    Example output: {count: 0, data: []} <p>


        ";
        if($pageInfo['title'] == "Documentation"){
            $this->page->addToBody($documentations);
        }
    }

    public function get_type() {
        return $this->type ;
    }

    public function get_page() {
        return $this->page->get_page();
    }
}